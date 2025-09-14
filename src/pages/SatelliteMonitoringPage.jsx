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
      className="w-full h-auto rounded-md"
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Canlı Uydu İzleme</h1>
      <p className="text-gray-600 mb-6">
        Uydu görüntüleri NASA GIBS / Sentinel Hub üzerinden yükleniyor
      </p>

      {/* 🔹 Uydu Görüntüsünü burada çağırıyoruz */}
      <SatelliteImage lat={40.85} lng={29.0} />
    </div>
  </div>
);

};

export default SatelliteMonitoringPage;
