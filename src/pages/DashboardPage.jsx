import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'
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
  Users,
  Calendar,
  Activity
} from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState({
    activeTasks: 5,
    highPriorityTasks: 2,
    completedThisMonth: 12,
    averageResponseTime: '2.5 saat',
    successRate: 85,
    totalNotifications: 3
  })

  // Saat güncellemesi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Günaydın'
    if (hour < 18) return 'İyi günler'
    return 'İyi akşamlar'
  }

  const getMotivationalMessage = () => {
    const messages = [
      'Bugün harika bir gün! Görevlerinizi tamamlamaya hazır mısınız?',
      'Çevremizi korumak için her görev önemli. Devam edin!',
      'Başarılı müdahaleleriniz deniz yaşamını koruyor.',
      'Saha personeli olarak yaptığınız iş çok değerli.',
      'Her tamamlanan görev, daha temiz bir çevre demek.'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const recentNotifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Yüksek Öncelikli Görev',
      message: 'Marmara Denizi\'nde acil müdahale gerekiyor',
      time: '5 dakika önce'
    },
    {
      id: 2,
      type: 'info',
      title: 'Sistem Güncellemesi',
      message: 'Yeni raporlama özellikleri eklendi',
      time: '1 saat önce'
    },
    {
      id: 3,
      type: 'success',
      title: 'Görev Tamamlandı',
      message: 'Görev #1234 başarıyla tamamlandı',
      time: '2 saat önce'
    }
  ]

  const recentLocations = [
    { id: 1, name: 'Marmara Denizi - Tuzla', status: 'active', priority: 'high' },
    { id: 2, name: 'İstanbul Boğazı - Beşiktaş', status: 'completed', priority: 'medium' },
    { id: 3, name: 'Karadeniz - Şile', status: 'pending', priority: 'low' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Kişiselleştirilmiş Karşılama */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.name || 'Kullanıcı'}! 👋
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            {getMotivationalMessage()}
          </p>
          <p className="text-sm text-gray-500">
            Son giriş: {new Date(user?.loginTime).toLocaleString('tr-TR')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Aktif Görevler */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Görevler</p>
                <p className="text-3xl font-bold text-primary-500">{stats.activeTasks}</p>
                <p className="text-sm text-gray-500">{stats.highPriorityTasks} yüksek öncelikli</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="text-primary-500" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/tasks" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                Tüm görevlerimi gör →
              </Link>
            </div>
          </div>

          {/* Bu Ay Tamamlanan */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bu Ay Tamamlanan</p>
                <p className="text-3xl font-bold text-success">{stats.completedThisMonth}</p>
                <p className="text-sm text-gray-500">görev</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-success" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp size={16} className="mr-1" />
                <span>+12% geçen aya göre</span>
              </div>
            </div>
          </div>

          {/* Ortalama Müdahale Süresi */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Müdahale</p>
                <p className="text-3xl font-bold text-warning">{stats.averageResponseTime}</p>
                <p className="text-sm text-gray-500">süre</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-warning" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-yellow-600">
                <Activity size={16} className="mr-1" />
                <span>Hedef: 2 saat</span>
              </div>
            </div>
          </div>

          {/* Başarı Oranı */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
                <p className="text-3xl font-bold text-secondary-500">{stats.successRate}%</p>
                <p className="text-sm text-gray-500">müdahale</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <TrendingUp className="text-secondary-500" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-secondary-500 h-2 rounded-full" 
                  style={{ width: `${stats.successRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Bölüm - Bildirimler ve Harita */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Son Bildirimler */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="mr-2 text-primary-500" size={20} />
                Son Bildirimler
              </h3>
              <Link to="/notifications" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                Tümünü gör
              </Link>
            </div>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'urgent' ? 'bg-accent-red' :
                    notification.type === 'success' ? 'bg-success' : 'bg-primary-500'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Harita Özeti */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="mr-2 text-secondary-500" size={20} />
                Son Raporlanan Konumlar
              </h3>
              <Link to="/map" className="text-sm text-secondary-500 hover:text-secondary-600 font-medium">
                Haritada detaylı gör
              </Link>
            </div>
            <div className="space-y-3">
              {recentLocations.map((location) => (
                <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      location.status === 'active' ? 'bg-accent-red' :
                      location.status === 'completed' ? 'bg-success' : 'bg-warning'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{location.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{location.status}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    location.priority === 'high' ? 'bg-red-100 text-red-800' :
                    location.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {location.priority === 'high' ? 'Yüksek' : 
                     location.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
                  Yarın (15 Mart) 12:00-13:00 arasında sistem bakımı olacaktır. 
                  Bu süre zarfında uygulama erişilemeyebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
