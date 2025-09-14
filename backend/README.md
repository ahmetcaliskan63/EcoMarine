# EcoMarineAI Backend - PostgreSQL

Bu backend, EcoMarineAI uygulaması için PostgreSQL veritabanı ile çalışan API servislerini sağlar.

## Gereksinimler

- Node.js 18+
- PostgreSQL 12+
- npm veya yarn

## Kurulum

1. PostgreSQL'i yükleyin ve çalıştırın
2. Veritabanı oluşturun:
   ```sql
   CREATE DATABASE ecomarine_db;
   ```

3. Environment dosyasını oluşturun:
   ```bash
   cp env.example .env
   ```

4. `.env` dosyasını düzenleyin:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecomarine_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

5. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

6. Veritabanı tablolarını oluşturun:
   ```bash
   npm run db:migrate
   ```

7. Örnek verileri ekleyin:
   ```bash
   npm run db:seed
   ```

8. Backend'i başlatın:
   ```bash
   npm run dev
   ```

## API Endpoints

### GET /api/health
Sistem durumu kontrolü

### GET /api/satellite-monitoring
Uydu izleme verilerini getirir

### GET /api/pollution-analysis
Kirlilik analiz verilerini getirir

### GET /api/alarms
Aktif alarmları getirir

### POST /api/analyze-satellite-image
Uydu görüntüsünü AI ile analiz eder

### GET /api/statistics
İzleme istatistiklerini getirir

### GET /api/ai-history
AI analiz geçmişini getirir

## Veritabanı Yapısı

- `satellite_monitoring`: Uydu izleme verileri
- `alarms`: Alarm kayıtları
- `statistics`: İstatistik verileri
- `users`: Kullanıcı bilgileri
- `ai_analysis_history`: AI analiz geçmişi

## WebSocket

Gerçek zamanlı veri güncellemeleri için WebSocket desteği

## AI Entegrasyonu

Yapay zeka API'si ile entegrasyon için `AI_API_URL` environment değişkenini ayarlayın.
