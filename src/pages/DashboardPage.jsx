import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Plus,
  BarChart3,
  Bell,
  TrendingUp,
  Calendar,
  Activity,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

// 🔹 Lokasyon isimlerini normalize et
const normalizeLocation = (loc) => {
  if (!loc) return "Bilinmeyen Bölge";
  return loc
    .replace("Marmara Denizi", "Marmara Bölgesi")
    .replace("Bölgesi", "")
    .trim();
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState(null);
  const [satelliteData, setSatelliteData] = useState([]);

  // Saat güncellemesi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Günaydın";
    if (hour < 18) return "İyi günler";
    return "İyi akşamlar";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Bugün harika bir gün! Görevlerinizi tamamlamaya hazır mısınız?",
      "Çevremizi korumak için her görev önemli. Devam edin!",
      "Başarılı müdahaleleriniz deniz yaşamını koruyor.",
      "Saha personeli olarak yaptığınız iş çok değerli.",
      "Her tamamlanan görev, daha temiz bir çevre demek.",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // 🔹 API’den verileri çek
  const fetchData = async () => {
    try {
      const [statsRes, satRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/statistics`),
        fetch(`${BACKEND_URL}/api/satellite-monitoring`),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      if (satRes.ok) {
        const data = await satRes.json();
        setSatelliteData(data);
      }
    } catch (err) {
      console.error("❌ Dashboard veri çekme hatası:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Kişiselleştirilmiş Karşılama */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.name || "Kullanıcı"}! 👋
          </h1>
          <p className="text-lg text-gray-600 mb-2">{getMotivationalMessage()}</p>
          <p className="text-sm text-gray-500">
            Son giriş:{" "}
            {user?.loginTime
              ? new Date(user.loginTime).toLocaleString("tr-TR")
              : "-"}
          </p>
        </div>

        {/* Hızlı Erişim Butonları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/tasks/new" className="group">
            <div className="card hover:shadow-hover transition-all duration-200 cursor-pointer bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Yeni Görev Başlat</h3>
                  <p className="text-sm opacity-90">Yeni bir görev oluşturun</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/reports" className="group">
            <div className="card hover:shadow-hover transition-all duration-200 cursor-pointer bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Rapor Oluştur</h3>
                  <p className="text-sm opacity-90">Analiz ve raporlar</p>
                </div>
              </div>
            </div>
          </Link>

          <button className="group">
            <div className="card hover:shadow-hover transition-all duration-200 cursor-pointer bg-gradient-to-r from-accent-red to-red-600 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Acil Durum Bildir</h3>
                  <p className="text-sm opacity-90">Acil müdahale gereken durumlar</p>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Ana İstatistik Kartları */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Bölge</p>
                  <p className="text-3xl font-bold text-primary-500">
                    {stats.total_area}
                  </p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FileText className="text-primary-500" size={24} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temiz Alan</p>
                  <p className="text-3xl font-bold text-success">{stats.clean_area}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="text-success" size={24} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orta Kirlilik</p>
                  <p className="text-3xl font-bold text-warning">
                    {stats.moderate_pollution}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="text-warning" size={24} />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kritik Alan</p>
                  <p className="text-3xl font-bold text-red-500">
                    {stats.critical_area}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="text-red-500" size={24} />
                </div>
              </div>
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

        {/* Duyurular */}
        <div className="mt-8">
          <div className="card bg-blue-50 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Sistem Duyurusu</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Yarın 12:00-13:00 arasında sistem bakımı olacaktır. Bu süre
                  zarfında uygulama erişilemeyebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
