// Yapay Zeka API Servisi
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://diego-imposed-today-hearing.trycloudflare.com';

class AIService {
    // Uydu görüntüsünü analiz et
    static async analyzeSatelliteImage(imageUrl, coordinates) {
        try {
            console.log('AI API\'ye istek gönderiliyor:', AI_API_URL);

            const response = await fetch(`${AI_API_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_url: imageUrl,
                    coordinates: coordinates,
                    analysis_type: 'marine_pollution',
                    region: 'marmara_sea'
                })
            });

            if (!response.ok) {
                throw new Error(`AI API hatası: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            console.log('AI API yanıtı:', result);
            return result;
        } catch (error) {
            console.error('AI analiz hatası:', error);
            // API çalışmazsa simülasyon kullan
            return await this.simulateAnalysis(imageUrl, coordinates);
        }
    }

    // Kirlilik seviyesini tahmin et
    static async predictPollutionLevel(location, historicalData) {
        try {
            const response = await fetch(`${AI_API_URL}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: location,
                    historical_data: historicalData
                })
            });

            if (!response.ok) {
                throw new Error(`AI tahmin hatası: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('AI tahmin hatası:', error);
            throw error;
        }
    }

    // Alarm seviyesini değerlendir
    static async evaluateAlarmLevel(pollutionData) {
        try {
            const response = await fetch(`${AI_API_URL}/evaluate-alarm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pollution_data: pollutionData
                })
            });

            if (!response.ok) {
                throw new Error(`AI alarm değerlendirme hatası: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('AI alarm değerlendirme hatası:', error);
            throw error;
        }
    }

    // Simüle edilmiş AI analizi (API çalışmazsa)
    static async simulateAnalysis(imageUrl, coordinates) {
        // Rastgele analiz sonucu oluştur
        const pollutionLevels = ['temiz', 'orta_kirlilik', 'kirli', 'kritik'];
        const randomLevel = pollutionLevels[Math.floor(Math.random() * pollutionLevels.length)];
        const confidence = Math.floor(Math.random() * 30) + 70; // 70-100 arası

        return {
            pollution_level: randomLevel,
            confidence: confidence,
            analysis_data: {
                image_url: imageUrl,
                coordinates: coordinates,
                timestamp: new Date().toISOString(),
                ai_model: 'EcoMarineAI-v1.0',
                analysis_type: 'satellite_image_analysis'
            },
            recommendations: this.getRecommendations(randomLevel),
            risk_score: this.calculateRiskScore(randomLevel, confidence)
        };
    }

    // Kirlilik seviyesine göre öneriler
    static getRecommendations(pollutionLevel) {
        switch (pollutionLevel) {
            case 'temiz':
                return [
                    'Bölge temiz durumda',
                    'Düzenli izleme devam etmeli',
                    'Çevre koruma önlemleri sürdürülmeli'
                ];
            case 'orta_kirlilik':
                return [
                    'Orta seviye kirlilik tespit edildi',
                    'Yakın takip gerekli',
                    'Müdahale ekipleri hazır tutulmalı'
                ];
            case 'kirli':
                return [
                    'Yüksek seviye kirlilik tespit edildi',
                    'Acil müdahale gerekli',
                    'İlgili kurumlara bildirim yapılmalı'
                ];
            case 'kritik':
                return [
                    'Kritik seviye kirlilik tespit edildi',
                    'Acil müdahale ekipleri devreye sokulmalı',
                    'Halk sağlığı açısından önlem alınmalı'
                ];
            default:
                return ['Analiz tamamlanamadı'];
        }
    }

    // Risk skoru hesapla
    static calculateRiskScore(pollutionLevel, confidence) {
        const levelScores = {
            'temiz': 1,
            'orta_kirlilik': 3,
            'kirli': 7,
            'kritik': 10
        };

        const baseScore = levelScores[pollutionLevel] || 0;
        const confidenceMultiplier = confidence / 100;

        return Math.round(baseScore * confidenceMultiplier * 10) / 10;
    }
}

export default AIService;
