# EcoMarineAI - Canlı Uydu İzleme Sistemi

EcoMarineAI, denizlerde meydana gelen çevresel kirleticilerin erken evrede tespit edilmesini ve hızlı müdahale mekanizmalarının tetiklenmesini amaçlayan yapay zekâ destekli, bütünleşik bir izleme ve karar destek sistemidir.

## Özellikler

- 🌊 **Canlı Uydu İzleme**: Gerçek zamanlı uydu görüntüleri ve analizleri
- 🤖 **Yapay Zeka Analizi**: Otomatik kirlilik tespiti ve sınıflandırması
- 📊 **İstatistik Dashboard**: Kirlilik seviyeleri ve trend analizleri
- 🚨 **Erken Uyarı Sistemi**: Kritik durumlar için otomatik alarmlar
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- ⚡ **Gerçek Zamanlı Güncellemeler**: WebSocket ile canlı veri akışı

## Kurulum

### Frontend

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

### Backend

1. Backend klasörüne gidin:
   ```bash
   cd backend
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. Backend'i başlatın:
   ```bash
   npm run dev
   ```

## Kullanım

1. Uygulamayı başlattıktan sonra `http://localhost:5173` adresine gidin
2. Giriş yapın (test kullanıcısı: admin/admin)
3. "Uydu İzleme" sekmesine tıklayın
4. "AI Analiz" butonuna tıklayarak yeni analiz başlatın
5. Gerçek zamanlı verileri takip edin

## Teknolojiler

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React (İkonlar)
- Axios (HTTP İstekleri)

### Backend
- Node.js
- Express.js
- SQLite
- WebSocket
- Axios (AI API Entegrasyonu)

## AI Entegrasyonu

Sistem, yapay zeka modülü ile entegre çalışır:
- Uydu görüntülerini analiz eder
- Kirlilik seviyelerini sınıflandırır
- Risk skorları hesaplar
- Öneriler sunar

## Proje Yapısı

```
EcoMarine/
├── src/
│   ├── components/          # React bileşenleri
│   ├── pages/              # Sayfa bileşenleri
│   ├── services/           # API servisleri
│   └── utils/              # Yardımcı fonksiyonlar
├── backend/                # Backend API
│   ├── server.js          # Ana sunucu dosyası
│   ├── database.js        # Veritabanı işlemleri
│   └── package.json       # Backend bağımlılıkları
└── package.json           # Frontend bağımlılıkları
```

## Geliştirme

1. Yeni özellikler için feature branch oluşturun
2. Kod değişikliklerini test edin
3. Pull request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.