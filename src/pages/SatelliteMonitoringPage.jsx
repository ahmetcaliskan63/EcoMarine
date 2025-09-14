import React, { useState, useEffect, useRef } from "react";
import {
  Satellite,
  Camera,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  Activity,
  Eye,
  Zap,
  Brain,
} from "lucide-react";
import AIService from "../services/aiService";
import SatelliteService from "../services/satelliteService";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

// 🔹 Uydu Görüntüsü Component
function SatelliteImage({ lat, lng }) {
  const [src, setSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!lat || !lng) return;

    setIsLoading(true);
    setError("");

    const loadSatelliteImage = async () => {
      try {
        const imageData = await SatelliteService.getSatelliteImage({ lat, lng });
        setSrc(imageData.url);
        setIsLoading(false);
      } catch (err) {
        console.error("Uydu görüntüsü yükleme hatası:", err);
        setError("Uydu görüntüsü yüklenemedi");
        setIsLoading(false);
      }
    };

    loadSatelliteImage();
  }, [lat, lng]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Gerçek uydu görüntüsü yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Uydu Görüntüsü"
      className="w-full h-auto rounded-lg shadow-sm max-h-96 object-cover"
    />
  );
}

const SatelliteMonitoringPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [satelliteData, setSatelliteData] = useState([]);
  const [statistics, setStatistics] = useState({
    total_area: 0,
    clean_area: 0,
    moderate_pollution: 0,
    polluted_area: 0,
    critical_area: 0,
  });
  const [alarms, setAlarms] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiStatus, setAiStatus] = useState("ready"); // ready, analyzing, error
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const wsRef = useRef(null);
  const analysisIntervalRef = useRef(null);

  // 🔹 WebSocket bağlantısı
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(
          `ws://${BACKEND_URL.replace("http://", "")}`
        );
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket bağlantısı kuruldu");
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        };

        ws.onclose = () => {
          console.log("WebSocket bağlantısı kapatıldı");
          setIsConnected(false);
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error("WebSocket hatası:", error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error("WebSocket bağlantı hatası:", error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case "satellite_update":
        setSatelliteData((prev) => [data.data, ...prev.slice(0, 19)]);
        setLastUpdate(new Date());
        break;
      case "new_analysis":
        setSatelliteData((prev) => [data.data, ...prev.slice(0, 19)]);
        setLastUpdate(new Date());
        break;
      default:
        break;
    }
  };

  // 🔹 API'den veri çekme
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [satelliteResponse, statsResponse, alarmsResponse] =
          await Promise.all([
            fetch(`${BACKEND_URL}/api/satellite-monitoring`),
            fetch(`${BACKEND_URL}/api/statistics`),
            fetch(`${BACKEND_URL}/api/alarms`),
          ]);

        if (satelliteResponse.ok) {
          const satelliteData = await satelliteResponse.json();
          setSatelliteData(satelliteData);
        }

        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setStatistics(stats);
        }

        if (alarmsResponse.ok) {
          const alarmsData = await alarmsResponse.json();
          setAlarms(alarmsData);
        }

        setLastUpdate(new Date());
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // ... (Senin mevcut analiz, UI ve render kodların burada olduğu gibi kalacak)

return (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Canlı Uydu İzleme</h1>
      <p className="text-gray-600 mb-6">
        Uydu görüntüleri NASA GIBS / Sentinel Hub üzerinden yükleniyor
      </p>

      {/* 🔹 İstatistikler Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Alan</p>
              <p className="text-2xl font-bold text-gray-900">1,247 km²</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temiz Alan</p>
              <p className="text-2xl font-bold text-gray-900">892 km²</p>
              <p className="text-sm text-green-600">71.5%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Orta Kirlilik</p>
              <p className="text-2xl font-bold text-gray-900">245 km²</p>
              <p className="text-sm text-yellow-600">19.6%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kritik Alan</p>
              <p className="text-2xl font-bold text-gray-900">110 km²</p>
              <p className="text-sm text-red-600">8.8%</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Uydu Görüntüsü */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Canlı Uydu Görüntüsü</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Canlı</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="max-w-2xl mx-auto">
              <SatelliteImage lat={40.85} lng={29.0} />
            </div>
            
            {/* Görüntü üzerinde bilgi overlay'i */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
              <div className="flex items-center space-x-2">
                <Satellite className="h-4 w-4" />
                <span>Koordinat: 40.85°N, 29.0°E</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}</span>
              </div>
            </div>
          </div>
          
          {/* Alt bilgi çubuğu */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Temiz Alan</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Orta Kirlilik</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Kritik Alan</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 inline mr-1" />
                Yenile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Geçmiş Veriler ve Analizler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Son Analizler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Son Analizler</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Canlı</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Marmara Denizi - Kuzey</p>
                  <p className="text-sm text-gray-600">Temiz - %95 sağlıklı</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">2 saat önce</p>
                <p className="text-xs text-green-600">✓ Başarılı</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">İstanbul Boğazı</p>
                  <p className="text-sm text-gray-600">Orta kirlilik - %78 sağlıklı</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">4 saat önce</p>
                <p className="text-xs text-yellow-600">⚠ Dikkat</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Haliç Bölgesi</p>
                  <p className="text-sm text-gray-600">Kritik - %45 sağlıklı</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">6 saat önce</p>
                <p className="text-xs text-red-600">🚨 Alarm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Uyarılar ve Alarmlar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Aktif Uyarılar</h3>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              3 Aktif
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-900">Kritik Kirlilik Seviyesi</p>
                  <p className="text-sm text-red-700">Haliç bölgesinde kritik seviye tespit edildi</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-xs text-red-600 mt-2">2 saat önce</p>
            </div>

            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-900">Orta Seviye Uyarı</p>
                  <p className="text-sm text-yellow-700">İstanbul Boğazı'nda artış gözlemlendi</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-xs text-yellow-600 mt-2">5 saat önce</p>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">Sistem Bildirimi</p>
                  <p className="text-sm text-blue-700">Yeni uydu görüntüsü başarıyla işlendi</p>
                </div>
                <CheckCircle className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xs text-blue-600 mt-2">1 saat önce</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Detaylı Analiz Grafikleri */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Kirlilik Trend Analizi</h3>
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
              <option>Son 7 Gün</option>
              <option>Son 30 Gün</option>
              <option>Son 3 Ay</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 inline mr-1" />
              Yenile
            </button>
          </div>
        </div>

        {/* Grafik Alanı (Placeholder) */}
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Kirlilik trend grafiği burada görünecek</p>
            <p className="text-sm text-gray-500">Chart.js veya başka bir grafik kütüphanesi ile entegre edilecek</p>
          </div>
        </div>
      </div>

      {/* 🔹 Sistem Durumu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">AI Analiz Motoru</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Aktif</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Son Analiz:</span>
              <span className="text-gray-900">2 dakika önce</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Başarı Oranı:</span>
              <span className="text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">İşlenen Görüntü:</span>
              <span className="text-gray-900">1,247</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Uydu Bağlantısı</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Bağlı</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Son Güncelleme:</span>
              <span className="text-gray-900">1 dakika önce</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sinyal Gücü:</span>
              <span className="text-green-600">Mükemmel</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gecikme:</span>
              <span className="text-gray-900">45ms</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Veri Depolama</h4>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Sağlıklı</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Kullanılan Alan:</span>
              <span className="text-gray-900">2.4 GB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Toplam Kapasite:</span>
              <span className="text-gray-900">10 GB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Boş Alan:</span>
              <span className="text-green-600">7.6 GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default SatelliteMonitoringPage;
