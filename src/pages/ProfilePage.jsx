import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthContext'
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Trash2,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Monitor
} from 'lucide-react'

const ProfilePage = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Profil bilgileri
  const [profileData, setProfileData] = useState({
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@ecomarineai.com',
    phone: '+90 532 123 45 67',
    department: 'Saha Operasyonları',
    role: 'Saha Personeli',
    location: 'İstanbul, Türkiye',
    joinDate: '2023-01-15',
    lastLogin: '2024-03-14T14:30:00Z'
  })

  // Şifre değiştirme
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })


  // Oturum geçmişi
  const [sessionHistory] = useState([
    {
      id: 1,
      device: 'Windows PC',
      browser: 'Chrome 122.0',
      location: 'İstanbul, Türkiye',
      ip: '192.168.1.100',
      loginTime: '2024-03-14T14:30:00Z',
      isCurrent: true
    },
    {
      id: 2,
      device: 'iPhone 15',
      browser: 'Safari 17.2',
      location: 'İstanbul, Türkiye',
      ip: '192.168.1.101',
      loginTime: '2024-03-13T09:15:00Z',
      isCurrent: false
    },
    {
      id: 3,
      device: 'MacBook Pro',
      browser: 'Chrome 121.0',
      location: 'Ankara, Türkiye',
      ip: '10.0.0.50',
      loginTime: '2024-03-12T16:45:00Z',
      isCurrent: false
    }
  ])

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (strength) => {
    if (strength <= 2) return 'Zayıf'
    if (strength <= 3) return 'Orta'
    return 'Güçlü'
  }

  const handleProfileUpdate = async () => {
    setLoading(true)
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateUser(profileData)
      setIsEditing(false)
    } catch (error) {
      console.error('Profil güncellenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!')
      return
    }

    if (getPasswordStrength(passwordData.newPassword) < 3) {
      alert('Şifre çok zayıf! En az 8 karakter ve farklı karakter türleri kullanın.')
      return
    }

    setLoading(true)
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
      alert('Şifre başarıyla değiştirildi!')
    } catch (error) {
      console.error('Şifre değiştirilirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Hesap silme işlemi başlatıldı. 30 gün içinde geri alınabilir.')
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Hesap silinirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'profile', label: 'Profil Bilgileri', icon: User },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'sessions', label: 'Oturumlar', icon: Clock }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil ve Ayarlar</h1>
          <p className="text-gray-600">Hesap bilgilerinizi yönetin ve tercihlerinizi ayarlayın</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sol Sidebar - Tab Menüsü */}
          <div className="lg:col-span-1">
            <div className="card">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Sağ İçerik Alanı */}
          <div className="lg:col-span-3">
            {/* Profil Bilgileri Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Avatar ve Temel Bilgiler */}
                <div className="card">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {profileData.firstName} {profileData.lastName}
                      </h2>
                      <p className="text-gray-600">{profileData.role}</p>
                      <p className="text-sm text-gray-500">{profileData.department}</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Edit size={16} />
                      <span>{isEditing ? 'İptal' : 'Düzenle'}</span>
                    </button>
                  </div>
                </div>

                {/* Profil Formu */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Kişisel Bilgiler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Departman</label>
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Konum</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span>{loading ? 'Kaydediliyor...' : 'Kaydet'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Hesap Bilgileri */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Hesap Bilgileri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Katılım Tarihi</p>
                        <p className="font-medium">{formatDate(profileData.joinDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="text-gray-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Son Giriş</p>
                        <p className="font-medium">{formatDate(profileData.lastLogin)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Güvenlik Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Şifre Değiştirme */}
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Şifre Değiştir</h3>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Shield size={16} />
                      <span>{showPasswordForm ? 'İptal' : 'Şifre Değiştir'}</span>
                    </button>
                  </div>

                  {showPasswordForm && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="input-field pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="input-field pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {passwordData.newPassword && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(getPasswordStrength(passwordData.newPassword))}`}
                                  style={{ width: `${(getPasswordStrength(passwordData.newPassword) / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                {getPasswordStrengthText(getPasswordStrength(passwordData.newPassword))}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              En az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermeli
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre Tekrar</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="input-field pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                            <AlertCircle size={14} />
                            <span>Şifreler eşleşmiyor</span>
                          </p>
                        )}
                        {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                          <p className="mt-1 text-sm text-green-600 flex items-center space-x-1">
                            <CheckCircle size={14} />
                            <span>Şifreler eşleşiyor</span>
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handlePasswordChange}
                          disabled={loading || getPasswordStrength(passwordData.newPassword) < 3 || passwordData.newPassword !== passwordData.confirmPassword}
                          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save size={16} />
                          <span>{loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hesap Silme */}
                <div className="card border-red-200 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-red-900">Hesabı Sil</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Hesabınızı kalıcı olarak silmek istiyorsanız bu seçeneği kullanın.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="btn-danger flex items-center space-x-2"
                    >
                      <Trash2 size={16} />
                      <span>Hesabı Sil</span>
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Oturumlar Tab */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Aktif Oturumlar</h3>
                  <div className="space-y-4">
                    {sessionHistory.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            {session.device.includes('iPhone') ? (
                              <Smartphone className="text-primary-500" size={20} />
                            ) : (
                              <Monitor className="text-primary-500" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{session.device}</p>
                            <p className="text-sm text-gray-500">{session.browser}</p>
                            <p className="text-sm text-gray-500">{session.location} • {session.ip}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{formatDate(session.loginTime)}</p>
                          {session.isCurrent && (
                            <span className="badge badge-success">Aktif</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hesap Silme Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Hesabı Sil</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-secondary"
                >
                  İptal
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="btn-danger flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>{loading ? 'Siliniyor...' : 'Hesabı Sil'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
