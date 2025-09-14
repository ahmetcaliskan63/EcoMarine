import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import axios from 'axios';
import Database from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const AI_API_URL = process.env.AI_API_URL || 'https://pumps-expand-unusual-terms.trycloudflare.com';

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
const db = new Database();

// WebSocket setup
const server = createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Yeni WebSocket bağlantısı');
    clients.add(ws);

    ws.on('close', () => {
        console.log('WebSocket bağlantısı kapatıldı');
        clients.delete(ws);
    });
});

// Broadcast helper
function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(message);
        }
    });
}

// 🔹 Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL',
        ai_api: AI_API_URL
    });
});

// 🔹 NASA GIBS uydu görüntüsü endpoint'i
app.get('/api/satellite-image', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return res.status(400).json({ error: 'Latitude ve longitude gerekli' });
        }

        // Daha geniş alan (1 derece ~ 111 km)
        const d = 1.0;

        // BBOX hesapla
        const bbox = [
            (lng - d).toFixed(4),
            (lat - d).toFixed(4),
            (lng + d).toFixed(4),
            (lat + d).toFixed(4)
        ].join(',');

        // Bugünün tarihi
        const date = new Date().toISOString().split('T')[0];

        // NASA GIBS WMS URL (MODIS Terra True Color, 250m çözünürlük)
        const gibsUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=768&WIDTH=1024&CRS=EPSG:4326&BBOX=${bbox}&TIME=${date}`;

        res.json({
            url: gibsUrl,
            coordinates: { lat, lng },
            timestamp: new Date().toISOString(),
            resolution: '250m',
            source: 'NASA GIBS',
            cloud_cover: Math.floor(Math.random() * 30),
            service_info: {
                provider: 'NASA GIBS',
                resolution: '250m',
                acquisition_date: date,
                service: 'gibs_wms',
                satellite: 'MODIS Terra',
                note: `NASA GIBS ücretsiz uydu görüntüsü - koordinat: ${lat}, ${lng}`
            }
        });
    } catch (error) {
        console.error('NASA GIBS hatası:', error);

        // Fallback: Unsplash deniz fotoğrafları
        const oceanImages = [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=768&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1024&h=768&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1024&h=768&fit=crop&crop=center'
        ];

        res.json({
            url: oceanImages[Math.floor(Math.random() * oceanImages.length)],
            coordinates: { lat: parseFloat(req.query.lat), lng: parseFloat(req.query.lng) },
            timestamp: new Date().toISOString(),
            resolution: '1024x768',
            source: 'Unsplash Fallback',
            cloud_cover: Math.floor(Math.random() * 30),
            service_info: {
                provider: 'Unsplash Ocean',
                resolution: '1024x768',
                acquisition_date: new Date().toISOString().split('T')[0],
                service: 'unsplash_fallback',
                satellite: 'Simulated Ocean View',
                note: 'NASA GIBS kullanılamıyor, Unsplash fallback kullanıldı'
            }
        });
    }
});

// 🔹 Uydu izleme verileri
app.get('/api/satellite-monitoring', async (req, res) => {
    try {
        const data = await db.getSatelliteMonitoringData();
        res.json(data);
    } catch (error) {
        console.error('Uydu izleme verileri alınırken hata:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// 🔹 Kirlilik analizi
app.get('/api/pollution-analysis', async (req, res) => {
    try {
        const data = await db.getPollutionAnalysisData();
        res.json(data);
    } catch (error) {
        console.error('Kirlilik analiz verileri alınırken hata:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// 🔹 Alarmlar
app.get('/api/alarms', async (req, res) => {
    try {
        const data = await db.getActiveAlarms();
        res.json(data);
    } catch (error) {
        console.error('Alarm verileri alınırken hata:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// 🔹 AI analizi
app.post('/api/analyze-satellite-image', async (req, res) => {
    try {
        const { imageUrl, coordinates } = req.body;
        const aiResponse = await axios.post(`${AI_API_URL}/analyze`, {
            image_url: imageUrl,
            coordinates: coordinates
        });

        const analysisResult = {
            location: coordinates.location || 'Bilinmeyen Konum',
            pollution_level: aiResponse.data.pollution_level || 'unknown',
            confidence: aiResponse.data.confidence || 0,
            analysis_data: aiResponse.data,
            timestamp: new Date().toISOString(),
            coordinates: coordinates,
            risk_score: aiResponse.data.risk_score || 0,
            recommendations: aiResponse.data.recommendations || []
        };

        await db.savePollutionAnalysis(analysisResult);

        broadcast({
            type: 'new_analysis',
            data: analysisResult
        });

        res.json(analysisResult);
    } catch (error) {
        console.error('AI analiz hatası:', error);
        res.status(500).json({ error: 'Analiz yapılamadı' });
    }
});

// 🔹 İstatistik
app.get('/api/statistics', async (req, res) => {
    try {
        const stats = await db.getMonitoringStatistics();
        res.json(stats);
    } catch (error) {
        console.error('İstatistik verileri alınırken hata:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// 🔹 AI geçmişi
app.get('/api/ai-history', async (req, res) => {
    try {
        const client = await db.pool.connect();
        const result = await client.query(`
      SELECT * FROM ai_analysis_history 
      ORDER BY created_at DESC 
      LIMIT 50
    `);
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('AI geçmişi alınırken hata:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Sunucu kapatılıyor...');
    await db.close();
    process.exit(0);
});

// Start server
server.listen(PORT, () => {
    console.log(`EcoMarineAI Backend ${PORT} portunda çalışıyor`);
    console.log(`AI API URL: ${AI_API_URL}`);
    console.log(`WebSocket sunucusu aktif`);
});

export default app;
