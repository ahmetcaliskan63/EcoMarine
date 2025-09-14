import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User, Menu, X, MapPin, FileText, BarChart3, Home, LogOut, Satellite } from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'
import { useAuth } from './AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', label: 'Ana Sayfa', icon: Home },
    { path: '/satellite-monitoring', label: 'Uydu İzleme', icon: Satellite },
    { path: '/tasks', label: 'Görevlerim', icon: FileText },
    { path: '/reports', label: 'Raporlar', icon: BarChart3 },
    { path: '/map', label: 'Harita', icon: MapPin },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-primary-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo ve Uygulama Adı */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-500 font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold">EcoMarineAI Sistemi</span>
            </Link>
          </div>

          {/* Desktop Menü */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(item.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-white hover:bg-primary-600'
                    }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sağ Taraf - Bildirimler ve Profil */}
          <div className="flex items-center space-x-4">
            {/* Bildirim İkonu */}
            <NotificationDropdown />

            {/* Kullanıcı Profil Menüsü */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 text-white hover:bg-primary-600 rounded-md transition-colors duration-200"
              >
                <User size={20} />
                <span className="hidden sm:block">{user?.name || 'Kullanıcı'}</span>
              </button>

              {/* Profil Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profilim
                  </Link>
                  <hr className="my-1" />
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => {
                      setIsProfileOpen(false)
                      logout()
                      navigate('/login')
                    }}
                  >
                    <LogOut size={16} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobil Menü Butonu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-primary-600 rounded-md transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-600 rounded-md mt-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive(item.path)
                        ? 'bg-primary-700 text-white'
                        : 'text-white hover:bg-primary-700'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
