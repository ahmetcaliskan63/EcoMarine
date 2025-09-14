const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

class SatelliteService {
  // Marmara ve kıyı bölgeleri
  static getCoastalLocations() {
    return [
      {
        id: 1,
        name: "Marmara Denizi - Tuzla",
        coordinates: { lat: 40.825, lng: 29.3083 },
        region: "Marmara",
        priority: "high",
      },
      {
        id: 2,
        name: "Marmara Denizi - Pendik",
        coordinates: { lat: 40.875, lng: 29.25 },
        region: "Marmara",
        priority: "high",
      },
      {
        id: 3,
        name: "Marmara Denizi - Silivri",
        coordinates: { lat: 41.075, lng: 28.25 },
        region: "Marmara",
        priority: "medium",
      },
      {
        id: 4,
        name: "Marmara Denizi - Bandırma",
        coordinates: { lat: 40.35, lng: 27.9667 },
        region: "Marmara",
        priority: "medium",
      },
    ];
  }

  // Rastgele Marmara konumu seç
  static getRandomLocationInBounds(region = "Marmara") {
    const locations = this.getCoastalLocations();
    const filtered = locations.filter((loc) => loc.region === region);
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  // Uydu görüntüsü al (backend proxy → NASA GIBS)
  static async getSatelliteImage(coordinates) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/satellite-image?lat=${coordinates.lat}&lng=${coordinates.lng}&d=0.2`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("NASA GIBS görüntü alındı:", data);

      return {
        url: data.url, // <img src={url} /> ile direkt kullanılabilir
        coordinates: data.coordinates,
        timestamp: data.timestamp,
        resolution: data.resolution,
        source: data.source,
        service_info: data.service_info,
      };
    } catch (err) {
      console.error("Uydu görüntüsü alınamadı, fallback kullanılıyor:", err);

      // Fallback: Unsplash deniz görselleri
      const fallbackImages = [
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1024&h=768&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1024&h=768&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1024&h=768&fit=crop&crop=center",
      ];
      const random = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

      return {
        url: random,
        coordinates,
        timestamp: new Date().toISOString(),
        resolution: "1024x768",
        source: "Unsplash Fallback",
        service_info: { provider: "Unsplash Ocean" },
      };
    }
  }
}

export default SatelliteService;
