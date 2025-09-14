// Uydu Görüntü Servisi - Basit ve Çalışan
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Bbox hesaplama (standart)
function bbox({ lat, lng }, delta = 0.05) {
    return `${(lng - delta).toFixed(4)},${(lat - delta).toFixed(4)},${(lng + delta).toFixed(4)},${(lat + delta).toFixed(4)}`;
}

// NASA GIBS URL üretimi
function gibsUrl(coords, dateStr = null) {
    const d = dateStr || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 1 hafta öncesi
    return `https://gibs.earthdata.nasa.gov/image-download?TIME=${d}&extent=${bbox(coords)}&epsg=4326&layers=MODIS_Terra_CorrectedReflectance_TrueColor&format=image/jpeg&width=1024&height=768`;
}

class SatelliteService {
    // Gerçek kıyı koordinatları - Dinamik
    static getCoastalLocations() {
        return [
            // Marmara Denizi Bölgesi
            {
                id: 1,
                name: 'Marmara Denizi - Tuzla',
                coordinates: { lat: 40.8250, lng: 29.3083 },
                region: 'Marmara',
                priority: 'high',
                bounds: { north: 40.9, south: 40.7, east: 29.5, west: 29.1 }
            },
            {
                id: 2,
                name: 'Marmara Denizi - Pendik',
                coordinates: { lat: 40.8750, lng: 29.2500 },
                region: 'Marmara',
                priority: 'high',
                bounds: { north: 40.95, south: 40.8, east: 29.4, west: 29.1 }
            },
            {
                id: 3,
                name: 'Marmara Denizi - Silivri',
                coordinates: { lat: 41.0750, lng: 28.2500 },
                region: 'Marmara',
                priority: 'medium',
                bounds: { north: 41.15, south: 41.0, east: 28.4, west: 28.1 }
            },
            {
                id: 4,
                name: 'Marmara Denizi - Bandırma',
                coordinates: { lat: 40.3500, lng: 27.9667 },
                region: 'Marmara',
                priority: 'medium',
                bounds: { north: 40.45, south: 40.25, east: 28.1, west: 27.8 }
            },
            // İstanbul Boğazı
            {
                id: 5,
                name: 'İstanbul Boğazı - Beşiktaş',
                coordinates: { lat: 41.0428, lng: 29.0069 },
                region: 'İstanbul',
                priority: 'high',
                bounds: { north: 41.1, south: 40.98, east: 29.1, west: 28.9 }
            },
            {
                id: 6,
                name: 'İstanbul Boğazı - Üsküdar',
                coordinates: { lat: 41.0167, lng: 29.0167 },
                region: 'İstanbul',
                priority: 'high',
                bounds: { north: 41.08, south: 40.95, east: 29.1, west: 28.9 }
            },
            // Çanakkale Boğazı
            {
                id: 7,
                name: 'Çanakkale Boğazı - Eceabat',
                coordinates: { lat: 40.1833, lng: 26.3667 },
                region: 'Çanakkale',
                priority: 'high',
                bounds: { north: 40.25, south: 40.1, east: 26.5, west: 26.2 }
            },
            // Ege Denizi
            {
                id: 8,
                name: 'Ege Denizi - İzmir Körfezi',
                coordinates: { lat: 38.4333, lng: 27.1500 },
                region: 'İzmir',
                priority: 'medium',
                bounds: { north: 38.5, south: 38.35, east: 27.3, west: 27.0 }
            },
            // Akdeniz
            {
                id: 9,
                name: 'Akdeniz - Antalya Körfezi',
                coordinates: { lat: 36.8833, lng: 30.7000 },
                region: 'Antalya',
                priority: 'medium',
                bounds: { north: 36.95, south: 36.8, east: 30.8, west: 30.6 }
            },
            {
                id: 10,
                name: 'Akdeniz - Mersin Körfezi',
                coordinates: { lat: 36.8000, lng: 34.6333 },
                region: 'Mersin',
                priority: 'medium',
                bounds: { north: 36.85, south: 36.75, east: 34.7, west: 34.5 }
            },
            // Karadeniz
            {
                id: 11,
                name: 'Karadeniz - Trabzon',
                coordinates: { lat: 41.0000, lng: 39.7167 },
                region: 'Trabzon',
                priority: 'low',
                bounds: { north: 41.05, south: 40.95, east: 39.8, west: 39.6 }
            },
            {
                id: 12,
                name: 'Karadeniz - Samsun',
                coordinates: { lat: 41.2833, lng: 36.3333 },
                region: 'Samsun',
                priority: 'low',
                bounds: { north: 41.35, south: 41.2, east: 36.4, west: 36.2 }
            }
        ];
    }

    // Rastgele konum seç
    static getRandomLocation() {
        const locations = this.getCoastalLocations();
        return locations[Math.floor(Math.random() * locations.length)];
    }

    // Dinamik koordinat seçimi - Bölge sınırları içinde
    static getRandomLocationInBounds(region = null) {
        const locations = this.getCoastalLocations();
        let filteredLocations = locations;

        // Bölge filtresi
        if (region) {
            filteredLocations = locations.filter(loc => loc.region === region);
        }

        const selectedLocation = filteredLocations[Math.floor(Math.random() * filteredLocations.length)];

        // Seçilen bölge sınırları içinde rastgele koordinat üret
        const bounds = selectedLocation.bounds;
        const randomLat = bounds.south + Math.random() * (bounds.north - bounds.south);
        const randomLng = bounds.west + Math.random() * (bounds.east - bounds.west);

        return {
            ...selectedLocation,
            coordinates: {
                lat: parseFloat(randomLat.toFixed(4)),
                lng: parseFloat(randomLng.toFixed(4))
            }
        };
    }

    // Koordinat için uydu görüntüsü al (BACKEND PROXY)
    static async getSatelliteImage(coordinates) {
        console.log('Backend proxy ile uydu görüntüsü alınmaya çalışılıyor...', coordinates);

        try {
            // Backend API'ye istek gönder
            const response = await fetch(`${BACKEND_URL}/api/satellite-image?lat=${coordinates.lat}&lng=${coordinates.lng}&d=0.05`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Backend\'den uydu görüntüsü alındı:', data);

            return {
                url: data.url,
                coordinates: data.coordinates,
                timestamp: data.timestamp,
                resolution: data.resolution,
                source: data.source,
                cloud_cover: data.cloud_cover,
                service_info: data.service_info
            };

        } catch (error) {
            console.error('Backend proxy hatası:', error);

            // Fallback: Doğrudan Unsplash deniz görüntüsü
            const oceanImages = [
                'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1024&h=768&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1024&h=768&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1024&h=768&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1024&h=768&fit=crop&crop=center',
                'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1024&h=768&fit=crop&crop=center'
            ];

            const randomIndex = Math.floor(Math.random() * oceanImages.length);
            const fallbackUrl = oceanImages[randomIndex];

            return {
                url: fallbackUrl,
                coordinates: coordinates,
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
                    note: 'Backend kullanılamıyor, Unsplash kullanılıyor'
                }
            };
        }
    }

    // Bbox hesaplama yardımcı fonksiyonu
    static bbox(coords, delta = 0.05) {
        return `${(coords.lng - delta).toFixed(4)},${(coords.lat - delta).toFixed(4)},${(coords.lng + delta).toFixed(4)},${(coords.lat + delta).toFixed(4)}`;
    }

    // Koordinat için detaylı uydu bilgileri
    static getSatelliteInfo(coordinates) {
        return {
            coordinates: coordinates,
            satellite: 'MODIS Terra',
            resolution: '250m',
            spectral_bands: ['Red', 'Green', 'Blue'],
            acquisition_time: new Date().toISOString(),
            cloud_cover: Math.floor(Math.random() * 30),
            quality: 'High',
            processing_level: 'L2A'
        };
    }
}

export default SatelliteService;

