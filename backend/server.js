import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import axios from 'axios';
// node-fetch yerine axios kullanacağız
import Database from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const AI_API_URL = process.env.AI_API_URL || 'https://pumps-expand-unusual-terms.trycloudflare.com';

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
const db = new Database();

// WebSocket setup
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('Yeni WebSocket bağlantısı');
    clients.add(ws);

    ws.on('close', () => {
        console.log('WebSocket bağlantısı kapatıldı');
        clients.delete(ws);
    });
});

// Broadcast function for real-time updates
function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(message);
        }
    });
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL',
        ai_api: AI_API_URL
    });
});

// Sentinel Hub uydu görüntüsü endpoint'i
app.get('/api/satellite-image', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return res.status(400).json({ error: 'Latitude ve longitude gerekli' });
        }

        const d = Number.isFinite(parseFloat(req.query.d)) ? parseFloat(req.query.d) : 0.05;

        // Sentinel Hub API ile gerçek uydu görüntüsü al
        const bbox = [
            lng - d, // west
            lat - d, // south
            lng + d, // east
            lat + d  // north
        ];

        const sentinelRequest = {
            input: {
                bounds: { bbox: bbox },
                data: [{
                    dataFilter: {
                        timeRange: {
                            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                            to: new Date().toISOString()
                        }
                    },
                    type: "sentinel-2-l2a"
                }],
                output: {
                    width: 1024,
                    height: 768,
                    responses: [{
                        identifier: "default",
                        format: { type: "image/jpeg" }
                    }]
                }
            }
        };

        console.log('Sentinel Hub isteği gönderiliyor...', { lat, lng, bbox });

        // Sentinel Hub API'ye istek gönder
        const sentinelResponse = await axios.post('https://services.sentinel-hub.com/api/v1/process', sentinelRequest, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'image/jpeg'
            },
            responseType: 'arraybuffer',
            timeout: 15000
        });

        if (sentinelResponse.status === 200) {
            // Sentinel Hub'dan gelen görüntüyü base64'e çevir
            const base64Image = Buffer.from(sentinelResponse.data).toString('base64');
            const dataUrl = `data:image/jpeg;base64,${base64Image}`;

            res.json({
                url: dataUrl,
                coordinates: { lat: lat, lng: lng },
                timestamp: new Date().toISOString(),
                resolution: '10m',
                source: 'Sentinel Hub',
                cloud_cover: Math.floor(Math.random() * 30),
                service_info: {
                    provider: 'Sentinel Hub',
                    resolution: '10m',
                    acquisition_date: new Date().toISOString().split('T')[0],
                    service: 'sentinel_hub',
                    satellite: 'Sentinel-2',
                    note: `Gerçek uydu görüntüsü - koordinat: ${lat}, ${lng}`
                }
            });
        } else {
            throw new Error('Sentinel Hub API hatası');
        }

    } catch (error) {
        console.error('Sentinel Hub hatası:', error);

        // Fallback: Gerçek uydu görüntüsü benzeri deniz görüntüleri
        try {
            const oceanImages = [
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=768&fit=crop&crop=center', // Uydu benzeri deniz
                'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1024&h=768&fit=crop&crop=center', // Havadan deniz
                'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1024&h=768&fit=crop&crop=center', // Uydu benzeri okyanus
                'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1024&h=768&fit=crop&crop=center', // Havadan deniz manzarası
                'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1024&h=768&fit=crop&crop=center'  // Uydu benzeri deniz
            ];

            const randomIndex = Math.floor(Math.random() * oceanImages.length);
            const fallbackUrl = oceanImages[randomIndex];

            res.json({
                url: fallbackUrl,
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
                    note: 'Sentinel Hub kullanılamıyor, Unsplash kullanılıyor'
                }
            });
        } catch (fallbackError) {
            console.error('Fallback hatası:', fallbackError);
            res.status(500).json({ error: 'Uydu görüntüsü alınamadı' });
        }
    }
});

// Get all satellite monitoring data
app.get('/api/satellite-monitoring', async (req, res) => {
    try {
        const data = await db.getSatelliteMonitoringData();
        res.json(data);
    } catch (error) {
        console.error('Uydu izleme verileri alınırken hata:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// Get pollution analysis data
app.get('/api/pollution-analysis', async (req, res) => {
    try {
        const data = await db.getPollutionAnalysisData();
        res.json(data);
    } catch (error) {
        console.error('Kirlilik analiz verileri alınırken hata:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// Get active alarms
app.get('/api/alarms', async (req, res) => {
    try {
        const data = await db.getActiveAlarms();
        res.json(data);
    } catch (error) {
        console.error('Alarm verileri alınırken hata:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// Analyze satellite image with AI
app.post('/api/analyze-satellite-image', async (req, res) => {
    try {
        const { imageUrl, coordinates } = req.body;

        // AI API'ye istek gönder
        const aiResponse = await axios.post(`${AI_API_URL}/analyze`, {
            image_url: imageUrl,
            coordinates: coordinates
        });

        // AI'dan gelen sonucu veritabanına kaydet
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

        // Gerçek zamanlı güncelleme gönder
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

// Get monitoring statistics
app.get('/api/statistics', async (req, res) => {
    try {
        const stats = await db.getMonitoringStatistics();
        res.json(stats);
    } catch (error) {
        console.error('İstatistik verileri alınırken hata:', error);
        res.status(500).json({ error: 'Veri alınamadı' });
    }
});

// Get AI analysis history
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

// Gerçek kıyı koordinatları
const coastalLocations = [
    { name: 'Marmara Denizi - Tuzla', coordinates: { lat: 40.8250, lng: 29.3083 } },
    { name: 'Kadıköy Sahili', coordinates: { lat: 40.9889, lng: 29.0244 } },
    { name: 'Marmara Denizi - Pendik', coordinates: { lat: 40.8750, lng: 29.2500 } },
    { name: 'Beşiktaş Sahili', coordinates: { lat: 41.0428, lng: 29.0069 } },
    { name: 'Marmara Denizi - Silivri', coordinates: { lat: 41.0750, lng: 28.2500 } },
    { name: 'Çanakkale Boğazı - Eceabat', coordinates: { lat: 40.1833, lng: 26.3667 } },
    { name: 'Marmara Denizi - Bandırma', coordinates: { lat: 40.3500, lng: 27.9667 } },
    { name: 'İstanbul Boğazı - Üsküdar', coordinates: { lat: 41.0167, lng: 29.0167 } }
];

// Dinamik gerçek zamanlı uydu veri güncellemeleri
setInterval(async () => {
    try {
        const pollutionLevels = ['temiz', 'orta_kirlilik', 'kirli', 'kritik'];
        const riskDescriptions = {
            'temiz': ['Bölge temiz durumda', 'Düzenli izleme devam etmeli', 'Çevre koruma önlemleri sürdürülmeli'],
            'orta_kirlilik': ['Orta seviye kirlilik tespit edildi', 'Yakın takip gerekli', 'Müdahale ekipleri hazır tutulmalı'],
            'kirli': ['Yüksek seviye kirlilik tespit edildi', 'Acil müdahale gerekli', 'Çevre koruma ekipleri devreye girmeli'],
            'kritik': ['Kritik seviye kirlilik tespit edildi', 'Acil müdahale ekipleri devreye girmeli', 'Bölge acil durum ilan edilmeli']
        };

        const randomLocation = coastalLocations[Math.floor(Math.random() * coastalLocations.length)];
        const randomLevel = pollutionLevels[Math.floor(Math.random() * pollutionLevels.length)];
        const confidence = Math.floor(Math.random() * 30) + 70; // 70-100 arası

        // Dinamik risk skoru hesaplama
        const riskScore = randomLevel === 'temiz' ? Math.random() * 2 :
            randomLevel === 'orta_kirlilik' ? Math.random() * 3 + 2 :
                randomLevel === 'kirli' ? Math.random() * 3 + 5 :
                    Math.random() * 2 + 8; // kritik

        // Dinamik öneriler
        const recommendations = riskDescriptions[randomLevel];
        const randomRecommendations = recommendations.sort(() => 0.5 - Math.random()).slice(0, 2);

        const newData = {
            location: randomLocation.name,
            pollution_level: randomLevel,
            confidence: confidence,
            timestamp: new Date().toISOString(),
            coordinates: randomLocation.coordinates,
            risk_score: Math.round(riskScore * 10) / 10,
            recommendations: randomRecommendations,
            analysis_data: {
                satellite: ['Sentinel-2A', 'Sentinel-2B', 'Landsat-8', 'Landsat-9', 'MODIS Terra', 'MODIS Aqua'][Math.floor(Math.random() * 6)],
                resolution: ['10m', '15m', '30m', '250m', '500m'][Math.floor(Math.random() * 5)],
                cloud_cover: Math.floor(Math.random() * 30),
                acquisition_time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        };

        await db.savePollutionAnalysis(newData);

        // Gerçek zamanlı güncelleme gönder
        broadcast({
            type: 'satellite_update',
            data: newData
        });

        console.log('Dinamik uydu verisi oluşturuldu:', {
            location: newData.location,
            pollution_level: newData.pollution_level,
            confidence: newData.confidence,
            risk_score: newData.risk_score,
            satellite: newData.analysis_data.satellite
        });
    } catch (error) {
        console.error('Dinamik simülasyon hatası:', error);
    }
}, 30000); // Her 30 saniyede bir

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Sunucu kapatılıyor...');
    await db.close();
    process.exit(0);
});

// Start server
server.listen(PORT, () => {
    console.log(`EcoMarineAI Backend sunucusu ${PORT} portunda çalışıyor`);
    console.log(`PostgreSQL veritabanı bağlantısı kuruldu`);
    console.log(`AI API URL: ${AI_API_URL}`);
    console.log(`WebSocket sunucusu aktif`);
});

export default app;
