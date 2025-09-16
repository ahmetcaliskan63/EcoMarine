import React, { useState, useEffect } from "react";
import { MapPin, Clock, RefreshCw, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

// 🔹 Lokasyon isimlerini normalize et
const normalizeLocation = (loc = "") => {
  const lower = loc.toLowerCase();
  if (lower.includes("doğu")) return "Marmara Bölgesi - Doğu";
  if (lower.includes("batı")) return "Marmara Bölgesi - Batı";
  if (lower.includes("kuzey")) return "Marmara Bölgesi - Kuzey";
  if (lower.includes("güney")) return "Marmara Bölgesi - Güney";
  if (lower.includes("merkez") || lower.includes("orta"))
    return "Marmara Bölgesi - Merkez";
  return "Marmara Bölgesi";
};

// 🔹 Uydu Görüntüsü Component
function SatelliteImage({ satelliteData, isLoading }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    let interval;
    if (isAutoPlay && satelliteData.length > 0) {
      interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % satelliteData.length
        );
      }, 7000);
    }
    return () => interval && clearInterval(interval);
  }, [isAutoPlay, satelliteData.length]);

  if (isLoading && satelliteData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Analiz verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (satelliteData.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-lg shadow-sm">
        <p className="text-sm text-gray-600">Görüntü bulunamadı</p>
      </div>
    );
  }

  const currentImage = satelliteData[currentImageIndex];
  const level = currentImage.pollution_level?.toLowerCase();

  const getLabelText = (level) => {
    switch (level) {
      case "clean":
      case "temiz":
        return "Temiz";
      case "moderate":
      case "orta":
        return "Orta Kirlilik";
      case "critical":
      case "kirli":
      case "kritik":
        return "Kritik Kirlilik";
      default:
        return "Bilinmeyen";
    }
  };

  const getLevelColor = (level) => {
    if (["clean", "temiz"].includes(level)) return "bg-green-500";
    if (["moderate", "orta"].includes(level)) return "bg-yellow-500";
    if (["critical", "kirli", "kritik"].includes(level)) return "bg-red-500";
    return "bg-gray-400";
  };

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg shadow-sm overflow-hidden">
      <img
        key={currentImageIndex}
        src={currentImage.image_url}
        alt={`Uydu Görüntüsü ${currentImageIndex + 1} - ${currentImage.location}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Sayaç */}
      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
        {currentImageIndex + 1}/{satelliteData.length}
      </div>

      {/* Konum bilgisi */}
      <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-2 rounded-lg text-sm flex items-center">
        <MapPin className="h-4 w-4 mr-1" />
        {normalizeLocation(currentImage.location)}
      </div>

      {/* Analiz sonucu */}
      {currentImage.pollution_level &&
        currentImage.pollution_level !== "unknown" && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${getLevelColor(level)}`}
              ></div>
              <span>
                {getLabelText(level)}{" "}
                {currentImage.confidence ? `(%${currentImage.confidence})` : ""}
              </span>
            </div>
          </div>
        )}

      {/* Zaman bilgisi */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded text-sm flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        {new Date(currentImage.timestamp).toLocaleTimeString("tr-TR")}
      </div>

      {/* Kontroller */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        <button
          onClick={() =>
            setCurrentImageIndex(
              (prev) =>
                prev === 0 ? satelliteData.length - 1 : prev - 1
            )
          }
          className="bg-black/70 text-white p-2 rounded-full hover:bg-black/80"
        >
          ◀
        </button>
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`px-3 py-1 rounded-full text-sm ${
            isAutoPlay ? "bg-green-600" : "bg-gray-600"
          } text-white`}
        >
          {isAutoPlay ? "⏸" : "▶️"}
        </button>
        <button
          onClick={() =>
            setCurrentImageIndex((prev) => (prev + 1) % satelliteData.length)
          }
          className="bg-black/70 text-white p-2 rounded-full hover:bg-black/80"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

// 🔹 Sayfa
const SatelliteMonitoringPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [satelliteData, setSatelliteData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [alarms, setAlarms] = useState([]);

  // 🔹 API'den veri çekme
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
        setSatelliteData(await satelliteResponse.json());
      }
      if (statsResponse.ok) {
        setStatistics(await statsResponse.json());
      }
      if (alarmsResponse.ok) {
        setAlarms(await alarmsResponse.json());
      }
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSatelliteData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/update-satellite-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Veri güncelleme hatası:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Trend verisi (LineChart için)
  const trendData = satelliteData.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    location: normalizeLocation(d.location),
    pollution: Number(d.confidence) || 0,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Canlı Uydu İzleme</h1>
            <p className="text-gray-600">
              Uydu görüntüleri NASA GIBS üzerinden alınmakta ve AI ile analiz
              edilmektedir.
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={updateSatelliteData}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>🤖 AI Analizi</span>
            </button>
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Yenile</span>
            </button>
          </div>
        </div>

        {/* 🔹 Uydu Görüntüsü */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Canlı Uydu Görüntüsü</h3>
          <div className="max-w-2xl mx-auto">
            <SatelliteImage
              satelliteData={satelliteData}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* 🔹 İstatistikler */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Toplam Alan</p>
              <p className="text-2xl font-bold">{statistics.total_area} km²</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Temiz Alan</p>
              <p className="text-2xl font-bold">{statistics.clean_area} km²</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600">Orta Kirlilik</p>
              <p className="text-2xl font-bold">
                {statistics.moderate_pollution} km²
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Kritik Alan</p>
              <p className="text-2xl font-bold">
                {statistics.critical_area} km²
              </p>
            </div>
          </div>
        )}

        {/* 🔹 AI Uyarıları */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">🤖 AI Uyarıları</h3>
          </div>
          {satelliteData.filter((d) =>
            ["kirli", "kritik", "critical"].includes(
              d.pollution_level?.toLowerCase()
            )
          ).length > 0 ? (
            [...new Map(
              satelliteData
                .filter((d) =>
                  ["kirli", "kritik", "critical"].includes(
                    d.pollution_level?.toLowerCase()
                  )
                )
                .map((item) => [
                  normalizeLocation(item.location),
                  { ...item, location: normalizeLocation(item.location) },
                ])
            ).values()].map((alarm, idx) => (
              <div
                key={idx}
                className="border-l-4 border-red-500 bg-red-50 p-4 rounded-lg mb-3 shadow-sm"
              >
                <p className="font-medium text-gray-900 mb-1">
                  🚨 Kritik Kirlilik Tespit Edildi
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  📍 {alarm.location} - %{alarm.confidence} kirlilik
                </p>
                <p className="text-xs text-gray-500">
                  ⏰{" "}
                  {new Date(alarm.timestamp).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-gray-500 mb-1">Aktif AI uyarısı yok</p>
            </div>
          )}
        </div>

        {/* 🔹 Trend Analizi */}
<div className="bg-white rounded-lg shadow-md p-6 mt-8">
  <h3 className="text-lg font-semibold mb-4">Kirlilik Trend Analizi</h3>
  <div className="h-80">
    {satelliteData.length === 0 ? (
      <div className="flex items-center justify-center h-full text-gray-500">
        Veri bulunamadı
      </div>
    ) : (
      (() => {
        // 🔹 Veriyi bölge bazında grupla
        const groupedTrend = {};
        satelliteData.forEach((d) => {
          const loc = normalizeLocation(d.location);
          const time = new Date(d.timestamp).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          if (!groupedTrend[time]) groupedTrend[time] = { time };
          groupedTrend[time][loc] = Number(d.confidence) || 0;
        });

        const trendData = Object.values(groupedTrend);

        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />

              {/* 🔹 Her bölge için ayrı çizgi */}
              <Line type="monotone" dataKey="Marmara Bölgesi - Batı" stroke="#ef4444" name="Batı" dot={false} />
              <Line type="monotone" dataKey="Marmara Bölgesi - Doğu" stroke="#3b82f6" name="Doğu" dot={false} />
              <Line type="monotone" dataKey="Marmara Bölgesi - Güney" stroke="#22c55e" name="Güney" dot={false} />
              <Line type="monotone" dataKey="Marmara Bölgesi - Kuzey" stroke="#eab308" name="Kuzey" dot={false} />
              <Line type="monotone" dataKey="Marmara Bölgesi - Merkez" stroke="#a855f7" name="Merkez" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );
      })()
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default SatelliteMonitoringPage;
