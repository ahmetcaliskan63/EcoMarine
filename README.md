# EcoMarineAI - Saha Personeli Yönetim Sistemi

## Proje Hakkında

EcoMarineAI, deniz kirliliği izleme ve saha personeli yönetimi için geliştirilmiş kurumsal web uygulamasıdır. Saha personelinin görevlerini yönetmek, raporları analiz etmek ve çevresel verileri takip etmek için tasarlanmıştır.

## Teknoloji Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Chart.js + React Chart.js 2
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcıda `http://localhost:5173` adresini açın.

## Proje Yapısı

```
src/
├── components/     # Yeniden kullanılabilir bileşenler
├── pages/          # Sayfa bileşenleri
├── styles/         # CSS/SASS dosyaları
├── assets/         # Görseller, ikonlar
├── utils/          # Yardımcı fonksiyonlar
├── App.jsx         # Ana uygulama bileşeni
├── main.jsx        # Uygulama giriş noktası
└── index.css       # Global stiller
```

## Tasarım Sistemi

### Renk Paleti
- **Birincil**: #1E5A7D (Kurumsal Mavi)
- **İkincil**: #3A847C (Petrol Yeşili)
- **Vurgu**: #E67E22 (Turuncu), #E74C3C (Kırmızı)

### Tipografi
- **Font**: Roboto (Google Fonts)
- **Boyutlar**: 12px, 14px, 16px, 18px, 20px, 24px
- **Ağırlıklar**: 300, 400, 500, 600, 700

## Geliştirme Aşamaları

Bu proje, detaylı tasarım dokümanına göre 12 aşamada geliştirilmektedir:

1. ✅ Proje Kurulumu ve Teknoloji Stack
2. 🔄 Tasarım Sistemi Geliştirme
3. ⏳ Layout Bileşenleri
4. ⏳ Giriş Sayfası
5. ⏳ Dashboard
6. ⏳ Görev Listesi
7. ⏳ Görev Detayı
8. ⏳ Raporlar
9. ⏳ Profil/Ayarlar
10. ⏳ Responsive Tasarım
11. ⏳ Backend Entegrasyonu
12. ⏳ Test ve Kalite Kontrolü

## Lisans

Bu proje özel bir kurumsal uygulamadır.
