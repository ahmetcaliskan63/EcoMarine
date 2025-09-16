import React, { useState, useEffect, useCallback } from 'react'
import { MapPin, Navigation, Filter, Layers, Download, RefreshCw, Map } from 'lucide-react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import GoogleMap from '../components/GoogleMap'
import WmsSlideshow from '../components/WmsSlideshow'

const MapPage = () => {
  const [selectedLayer, setSelectedLayer] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [mapCenter, setMapCenter] = useState([41.0082, 28.9784]) // İstanbul
  const [mapZoom, setMapZoom] = useState(10)
  const [loading, setLoading] = useState(false)
  const [apiKeyError, setApiKeyError] = useState(false)

  // API Key kontrolü
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === '') {
      setApiKeyError(true)
      console.error('Google Maps API Key bulunamadı!')
    }
  }, [])

  // Demo veriler
  const [mapData, setMapData] = useState({
    events: [
      {
        id: 2,
        title: 'İstanbul Boğazı Su Kalitesi',
        type: 'water_quality',
        priority: 'medium',
        status: 'completed',
        location: [41.0354, 29.0045],
        description: 'Su kalitesi ölçümleri tamamlandı',
        date: '2024-01-14',
        personnel: 'Mehmet Kaya'
      },
      {
        id: 3,
        title: 'Karadeniz Deniz Yaşamı',
        type: 'wildlife',
        priority: 'low',
        status: 'active',
        location: [41.2500, 29.5000], // Karadeniz kıyısı
        description: 'Deniz kaplumbağası gözlemi',
        date: '2024-01-13',
        personnel: 'Ayşe Demir'
      },
      {
        id: 4,
        title: 'Marmara Denizi',
        type: 'emergency',
        priority: 'high',
        status: 'active',
        location: [40.8500, 29.2000], // Marmara Denizi'nin sağ tarafı
        description: 'Marmara Denizi izleme',
        date: '2024-01-12',
        personnel: 'Fatma Özkan'
      }
    ],
    regions: [
      { name: 'Marmara Denizi', center: [40.9923, 29.0234], radius: 50000 },
      { name: 'İstanbul Boğazı', center: [41.0354, 29.0045], radius: 20000 },
      { name: 'Karadeniz', center: [41.2500, 29.5000], radius: 80000 },
      { name: 'Ege Denizi', center: [40.8765, 28.9876], radius: 100000 }
    ]
  })

  const getEventIcon = (type, priority) => {
    const colors = {
      pollution: priority === 'high' ? '#E74C3C' : '#FFC107',
      water_quality: '#1E5A7D',
      wildlife: '#28a745',
      emergency: '#E67E22'
    }
    return colors[type] || '#6c757d'
  }


  const getEventTypeLabel = (type) => {
    const labels = {
      pollution: 'Kirlilik',
      water_quality: 'Su Kalitesi',
      wildlife: 'Deniz Yaşamı',
      emergency: 'Acil Durum'
    }
    return labels[type] || type
  }

  const getPriorityLabel = (priority) => {
    const labels = {
      high: 'Yüksek',
      medium: 'Orta',
      low: 'Düşük'
    }
    return labels[priority] || priority
  }

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Aktif',
      completed: 'Tamamlandı',
      pending: 'Beklemede'
    }
    return labels[status] || status
  }

  const handleFilterChange = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleMapClick = useCallback((event) => {
    console.log('Map clicked:', event.latLng.lat(), event.latLng.lng())
  }, [])

  // NASA GIBS WMTS tile overlay (GoogleMapsCompatible in EPSG:3857)
  const gibsDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const gibsOverlay = {
    name: 'NASA GIBS MODIS TrueColor',
    template: `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${gibsDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`,
    minZoom: 1,
    maxZoom: 9
  }

  // Kullanıcının verdiği WMS GetMap tekil görüntü URL'leri (slideshow için)
  const wmsImages = [
    'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=768&WIDTH=1024&CRS=EPSG:4326&BBOX=20.0800,37.9700,22.0800,39.9700&TIME=2025-09-14',
    'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=768&WIDTH=1024&CRS=EPSG:4326&BBOX=18.0800,39.9700,20.0800,41.9700&TIME=2025-09-14',
    'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=768&WIDTH=1024&CRS=EPSG:4326&BBOX=16.0800,39.9700,18.0800,41.9700&TIME=2025-09-14',
    'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=768&WIDTH=1024&CRS=EPSG:4326&BBOX=15.0800,39.9700,17.0800,41.9700&TIME=2025-09-14',
    'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&STYLES=&FORMAT=image/jpeg&TRANSPARENT=FALSE&HEIGHT=768&WIDTH=1024&CRS=EPSG:4326&BBOX=14.0800,39.9700,16.0800,41.9700&TIME=2025-09-14'
  ]

  const render = (status) => {
    // API Key hatası kontrolü
    if (apiKeyError) {
      return (
        <div className="h-96 w-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-center">
            <Map size={64} className="mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">API Anahtarı Bulunamadı</h3>
            <p className="text-gray-600 mb-4">Google Maps API anahtarı .env dosyasında tanımlanmalı</p>
            <div className="bg-gray-100 p-3 rounded-lg text-sm font-mono text-left">
              REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
            </div>
          </div>
        </div>
      )
    }

    switch (status) {
      case Status.LOADING:
        return (
          <div className="h-96 w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Harita yükleniyor...</p>
            </div>
          </div>
        )
      case Status.FAILURE:
        return (
          <div className="h-96 w-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
            <div className="text-center">
              <Map size={64} className="mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Harita Yüklenemedi</h3>
              <p className="text-gray-600 mb-4">Google Maps API anahtarı geçersiz veya quota aşıldı</p>
              <button 
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        )
      default:
        return (
          <div className="h-96 w-full">
            <GoogleMap
              center={mapCenter}
              zoom={mapZoom}
              events={filteredEvents}
              onMapClick={handleMapClick}
              tileOverlays={[gibsOverlay]}
            />
          </div>
        )
    }
  }

  const filteredEvents = mapData.events.filter(event => {
    if (selectedLayer !== 'all' && event.type !== selectedLayer) return false
    if (selectedRegion !== 'all') {
      const region = mapData.regions.find(r => r.name === selectedRegion)
      if (region) {
        // Basit mesafe hesaplama (haversine formülü yerine)
        const lat1 = event.location[0]
        const lng1 = event.location[1]
        const lat2 = region.center[0]
        const lng2 = region.center[1]
        const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2))
        if (distance > region.radius) return false
      }
    }
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Kontroller */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <MapPin className="mr-3 text-primary-500" size={32} />
                Harita
              </h1>
              <p className="text-gray-600">
                Olayların harita üzerinde gösterimi, saha personeli konumları ve çevresel olayların harita üzerinde görüntülenmesi
              </p>
            </div>
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <button
                onClick={() => setMapCenter([41.0082, 28.9784])}
                className="btn-secondary flex items-center space-x-2"
              >
                <Navigation size={16} />
                <span>İstanbul'a Git</span>
              </button>
              <button
                onClick={handleFilterChange}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <Download size={16} />
                )}
                <span>{loading ? 'Yükleniyor...' : 'Harita İndir'}</span>
              </button>
            </div>
          </div>

          {/* Filtreler */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Olay Türü</label>
                <select
                  value={selectedLayer}
                  onChange={(e) => setSelectedLayer(e.target.value)}
                  className="input-field"
                >
                  <option value="all">Tüm Türler</option>
                  <option value="pollution">Kirlilik</option>
                  <option value="water_quality">Su Kalitesi</option>
                  <option value="wildlife">Deniz Yaşamı</option>
                  <option value="emergency">Acil Durum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bölge</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="input-field"
                >
                  <option value="all">Tüm Bölgeler</option>
                  <option value="Marmara Denizi">Marmara Denizi</option>
                  <option value="İstanbul Boğazı">İstanbul Boğazı</option>
                  <option value="Karadeniz">Karadeniz</option>
                  <option value="Ege Denizi">Ege Denizi</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleFilterChange}
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 w-full"
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <Filter size={16} />
                  )}
                  <span>{loading ? 'Filtreleniyor...' : 'Filtrele'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Harita */}
        <div className="card p-0 overflow-hidden">
          <div className="h-96 w-full relative">
            {/* Google Maps Harita */}
            <Wrapper 
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''} 
              render={render}
            >
              <div className="h-96 w-full">
                <GoogleMap
                  center={mapCenter}
                  zoom={mapZoom}
                  events={filteredEvents}
                  onMapClick={handleMapClick}
                  tileOverlays={[gibsOverlay]}
                />
              </div>
            </Wrapper>
            {/* WMS Slideshow overlay */}
            <WmsSlideshow urls={wmsImages} intervalMs={3000} title={`GIBS WMS (${wmsImages.length} görüntü)`} />
            
            {/* Son Raporlanan Konumlar */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Son Raporlanan Konumlar</h4>
              <div className="space-y-2">
                {filteredEvents.slice(0, 3).map((event, index) => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getEventIcon(event.type, event.priority) }}
                    ></div>
                    <span className="text-sm text-gray-700">{event.title}</span>
                  </div>
                ))}
                <div className="text-xs text-gray-500 mt-2">
                  {filteredEvents.length} aktif olay
                </div>
              </div>
            </div>
            
            
            {/* Koordinat ve Zoom Bilgisi */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm text-gray-600">
                <div className="font-medium">Marmara Denizi Bölgesi</div>
                <div>Koordinat: 41.0082°N, 28.9784°E</div>
                <div>Zoom Seviyesi: {mapZoom}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Son güncelleme: {new Date().toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
            
            {/* Harita Kontrolleri */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
                <button 
                  onClick={() => setMapZoom(Math.max(mapZoom - 1, 1))}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  <span className="text-lg font-bold">-</span>
                </button>
                <button 
                  onClick={() => setMapCenter([41.0082, 28.9784])}
                  className="p-2 bg-primary-100 hover:bg-primary-200 rounded transition-colors"
                >
                  <Navigation size={16} className="text-primary-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Olay Listesi */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Layers className="mr-2 text-primary-500" size={20} />
                Olay Listesi ({filteredEvents.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.priority === 'high' ? 'bg-red-100 text-red-800' :
                      event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {getPriorityLabel(event.priority)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Layers size={12} />
                      <span>{getEventTypeLabel(event.type)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={12} />
                      <span>{getStatusLabel(event.status)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>👤 {event.personnel}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>📅 {event.date}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mt-2 p-2 bg-white rounded border">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapPage
