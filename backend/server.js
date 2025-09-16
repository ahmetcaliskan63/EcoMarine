import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import fetch from "node-fetch";
import FormData from "form-data";
import Database from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const AI_API_URL = "https://diego-imposed-today-hearing.trycloudflare.com";

app.use(cors());
app.use(express.json());

const SATELLITE_IMAGE_URLS = [
    "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&FORMAT=image/jpeg&WIDTH=1024&HEIGHT=768&CRS=EPSG:4326&BBOX=23.0899,51.9700,25.0899,53.9700&TIME=2025-09-14",
    "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&FORMAT=image/jpeg&WIDTH=1024&HEIGHT=768&CRS=EPSG:4326&BBOX=23.0899,35.9700,25.0899,37.9700&TIME=2025-09-14",
    "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&FORMAT=image/jpeg&WIDTH=1024&HEIGHT=768&CRS=EPSG:4326&BBOX=20.0800,36.9700,22.0800,38.9700&TIME=2025-09-14",
    "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&FORMAT=image/jpeg&WIDTH=1024&HEIGHT=768&CRS=EPSG:4326&BBOX=20.0800,37.9700,22.0800,39.9700&TIME=2025-09-14",
    "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&FORMAT=image/jpeg&WIDTH=1024&HEIGHT=768&CRS=EPSG:4326&BBOX=18.0800,39.9700,20.0800,41.9700&TIME=2025-09-14",
    "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&FORMAT=image/jpeg&WIDTH=1024&HEIGHT=768&CRS=EPSG:4326&BBOX=16.0800,39.9700,18.0800,41.9700&TIME=2025-09-14",
    "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&FORMAT=image/jpeg&WIDTH=1024&HEIGHT=768&CRS=EPSG:4326&BBOX=14.0800,39.9700,16.0800,41.9700&TIME=2025-09-14",
  ];
// DB init
const db = new Database();

// WebSocket setup
const server = createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("🔌 Yeni WebSocket bağlantısı");
  clients.add(ws);
  ws.on("close", () => {
    clients.delete(ws);
  });
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === 1) client.send(msg);
  });
}

// ✅ Sağlık kontrolü
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    ai_api: AI_API_URL || "tanımsız",
    db_connected: !!db.pool,
  });
});
app.get("/api/satellite-monitoring", async (req, res) => {
  try {
    const result = await db.pool.query(
      "SELECT id, location, pollution_level, confidence, timestamp FROM satellite_monitoring ORDER BY timestamp DESC LIMIT 7"
    );

    // DB satırlarını NASA URL'leri ile eşleştir
    const enriched = result.rows.map((row, idx) => ({
      ...row,
      image_url: SATELLITE_IMAGE_URLS[idx % SATELLITE_IMAGE_URLS.length], // sırayla döner
    }));

    res.json(enriched);
  } catch (err) {
    console.error("❌ DB sorgu hatası:", err.message);
    res.status(500).json({ error: "DB query failed" });
  }
});
  

// ✅ İstatistikler
app.get("/api/statistics", async (req, res) => {
  try {
    const stats = await db.getMonitoringStatistics();
    if (!stats) {
      console.error("❌ İstatistik bulunamadı");
      return res.status(404).json({ error: "İstatistik yok" });
    }
    res.json(stats);
  } catch (err) {
    console.error("❌ İstatistik hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ AI ile analiz (NASA görsel → indir → form-data → AI’ya gönder)
app.post("/api/update-satellite-data", async (req, res) => {
  try {
    if (!AI_API_URL) {
      console.error("❌ AI_API_URL yok (.env içinde tanımla)");
      return res.status(500).json({ error: "AI_API_URL eksik" });
    }

    const records = await db.getRandomSatelliteRecords(3);
    if (!records || records.length === 0) {
      console.error("❌ DB’de analiz yapılacak uydu kaydı yok");
      return res.status(404).json({ error: "Kayıt yok" });
    }

    for (const row of records) {
      try {
        console.log(`🛰 Görüntü indiriliyor: ${row.location}`);
        const resp = await fetch(row.image_url);
        if (!resp.ok) throw new Error(`NASA indirme hatası: ${resp.status}`);
        const buffer = await resp.arrayBuffer();

        // Form-data hazırla
        const formData = new FormData();
        formData.append("file", Buffer.from(buffer), {
          filename: "satellite.jpg",
          contentType: "image/jpeg",
        });

        console.log(`🤖 AI analize gönderiliyor: ${row.location}`);
        const aiResp = await fetch(`${AI_API_URL}/v1/predict_file`, {
          method: "POST",
          body: formData,
          headers: formData.getHeaders(),
        });

        if (!aiResp.ok) throw new Error(`AI API HTTP ${aiResp.status}`);
        const aiData = await aiResp.json();

        console.log(`✅ AI sonucu (${row.location}):`, aiData);

        // DB güncelle
        await db.updateSatelliteRecord(row.id, aiData);

        // WebSocket broadcast
        broadcast({ type: "new_analysis", data: aiData });
      } catch (err) {
        console.error(`❌ AI analiz hatası (${row.location}):`, err.message);
      }
    }

    res.json({ message: "AI analizi tamamlandı" });
  } catch (err) {
    console.error("❌ Genel AI güncelleme hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Server başlat
server.listen(PORT, () => {
  console.log(`🚀 Backend ${PORT} portunda çalışıyor`);
  console.log(`🤖 AI API URL: ${AI_API_URL || "tanımsız"}`);
});
