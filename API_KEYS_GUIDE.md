# API Anahtarları Rehberi

EcoMarineAI sisteminin gerçek uydu görüntülerini alabilmesi için aşağıdaki API anahtarlarını almanız ve `satelliteService.js` dosyasında güncellemeniz gerekiyor:

## 1. Google Maps API
- **URL**: https://console.cloud.google.com/
- **Servis**: Maps JavaScript API, Static Maps API
- **Dosyada değiştirilecek**: `AIzaSyBvOkBwJ1J3J4J5J6J7J8J9J0J1J2J3J4J5`
- **Maliyet**: Ücretsiz kullanım limiti var

## 2. Bing Maps API
- **URL**: https://www.bingmapsportal.com/
- **Servis**: Bing Maps REST Services
- **Dosyada değiştirilecek**: `AnBingMapsKey`
- **Maliyet**: Ücretsiz kullanım limiti var

## 3. Mapbox API
- **URL**: https://account.mapbox.com/
- **Servis**: Mapbox Tiles API
- **Dosyada değiştirilecek**: `mapbox_token`
- **Maliyet**: Ücretsiz kullanım limiti var

## 4. Thunderforest API
- **URL**: https://www.thunderforest.com/
- **Servis**: Thunderforest Maps
- **Dosyada değiştirilecek**: `thunderforest_key`
- **Maliyet**: Ücretsiz kullanım limiti var

## 5. MapTiler API
- **URL**: https://cloud.maptiler.com/
- **Servis**: MapTiler Cloud
- **Dosyada değiştirilecek**: `maptiler_key`
- **Maliyet**: Ücretsiz kullanım limiti var

## 6. Here Maps API
- **URL**: https://developer.here.com/
- **Servis**: HERE Maps API
- **Dosyada değiştirilecek**: `here_api_key`
- **Maliyet**: Ücretsiz kullanım limiti var

## 7. MapQuest API
- **URL**: https://developer.mapquest.com/
- **Servis**: MapQuest Static Map API
- **Dosyada değiştirilecek**: `mapquest_key`
- **Maliyet**: Ücretsiz kullanım limiti var

## 8. TomTom API
- **URL**: https://developer.tomtom.com/
- **Servis**: TomTom Maps API
- **Dosyada değiştirilecek**: `tomtom_key`
- **Maliyet**: Ücretsiz kullanım limiti var

## 9. OpenMapTiles API
- **URL**: https://openmaptiles.com/
- **Servis**: OpenMapTiles Cloud
- **Dosyada değiştirilecek**: `openmaptiles_key`
- **Maliyet**: Ücretsiz kullanım limiti var

## Önemli Notlar:

1. **CORS Sorunları**: Bazı servisler client-side erişime izin vermeyebilir. Bu durumda backend'de proxy endpoint oluşturmanız gerekebilir.

2. **Rate Limiting**: Her servisin kendi rate limiti vardır. Çok fazla istek gönderirseniz geçici olarak engellenebilirsiniz.

3. **Maliyet**: Ücretsiz limitler aşıldığında ücretlendirme başlar. Kullanımınızı takip edin.

4. **Güvenlik**: API anahtarlarınızı asla public repository'de paylaşmayın. `.env` dosyasında saklayın.

## Hızlı Test İçin:

Şimdilik sistem çalışacak çünkü:
- OpenStreetMap ücretsiz ve CORS'a açık
- Sentinel-2 ve Landsat-8 WMS servisleri genellikle çalışır
- NASA Worldview ve Esri servisleri genellikle erişilebilir

Ancak en iyi sonuçlar için yukarıdaki API anahtarlarını almanızı öneriyoruz.
