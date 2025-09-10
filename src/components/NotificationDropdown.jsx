import React, { useState, useEffect, useRef } from 'react'
import { Bell, X, AlertCircle, CheckCircle, Info } from 'lucide-react'

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'Yüksek Öncelikli Görev',
      message: 'Marmara Denizi\'nde acil müdahale gerekiyor',
      time: '5 dakika önce',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Sistem Güncellemesi',
      message: 'Yeni raporlama özellikleri eklendi',
      time: '1 saat önce',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Görev Tamamlandı',
      message: 'Görev #1234 başarıyla tamamlandı',
      time: '2 saat önce',
      read: true
    }
  ])

  const dropdownRef = useRef(null)

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle size={16} className="text-accent-red" />
      case 'success':
        return <CheckCircle size={16} className="text-success" />
      case 'info':
        return <Info size={16} className="text-primary-500" />
      default:
        return <Bell size={16} className="text-gray-500" />
    }
  }

  const getNotificationBg = (type) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-50 border-l-4 border-accent-red'
      case 'success':
        return 'bg-green-50 border-l-4 border-success'
      case 'info':
        return 'bg-blue-50 border-l-4 border-primary-500'
      default:
        return 'bg-gray-50 border-l-4 border-gray-300'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bildirim İkonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-primary-600 rounded-md transition-colors duration-200"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menü */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                >
                  Tümünü Okundu İşaretle
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Bildirim Listesi */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Henüz bildirim yok</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${getNotificationBg(notification.type)} ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200">
            <button className="w-full text-center text-sm text-primary-500 hover:text-primary-600 font-medium">
              Tüm Bildirimleri Gör
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
