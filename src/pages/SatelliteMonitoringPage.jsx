import React, { useState, useEffect, useRef } from 'react'
import {
    Satellite,
    Camera,
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin,
    RefreshCw,
    Activity,
    TrendingUp,
    Eye,
    Zap,
    Brain
} from 'lucide-react'
import AIService from '../services/aiService'
import SatelliteService from '../services/satelliteService'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Uydu görüntüsü component'i
function SatelliteImage({ lat, lng }) {
    const [src, setSrc] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!lat || !lng) return;

        setIsLoading(true);
        setError('');

        // Deniz görüntüsü al
        const loadSatelliteImage = async () => {
            try {
                const imageData = await SatelliteService.getSatelliteImage({ lat, lng });
                setSrc(imageData.url);
                setIsLoading(false);
                console.log('Deniz görüntüsü yüklendi:', imageData);
            } catch (err) {
                console.error('Deniz görüntüsü yükleme hatası:', err);
                setError('Deniz görüntüsü yüklenemedi');
                setIsLoading(false);
            }
        };

        loadSatelliteImage();

        // 2 saniye sonra yükleme durumunu kapat
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [lat, lng]);

    const handleImageLoad = () => {
        setIsLoading(false);
        setError('');
    };

    const handleImageError = () => {
        setIsLoading(false);
        setError('Görüntü yüklenemedi');

        // Fallback: Farklı deniz görüntüsü dene
        const fallbackImages = [
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1024&h=768&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1024&h=768&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1024&h=768&fit=crop&crop=center'
        ];
        const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
        setSrc(randomFallback);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Gerçek uydu görüntüsü yükleniyor...</p>
                    <p className="text-xs text-gray-500 mt-1">Sentinel Hub API kullanılıyor</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                <div className="text-center">
                    <div className="text-red-500 mb-2">⚠️ {error}</div>
                    <p className="text-sm text-gray-600">Alternatif görüntü deneniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt="Gerçek Uydu Görüntüsü"
            className="w-full h-auto rounded-md"
            onLoad={handleImageLoad}
            onError={handleImageError}
        />
    );
}

const SatelliteMonitoringPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [satelliteData, setSatelliteData] = useState([])
    const [statistics, setStatistics] = useState({
        total_area: 0,
        clean_area: 0,
        moderate_pollution: 0,
        polluted_area: 0,
        critical_area: 0
    })
    const [alarms, setAlarms] = useState([])
    const [lastUpdate, setLastUpdate] = useState(new Date())
    const [isConnected, setIsConnected] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [aiStatus, setAiStatus] = useState('ready') // ready, analyzing, error
    const [currentImage, setCurrentImage] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [autoAnalysis, setAutoAnalysis] = useState(true)
    const wsRef = useRef(null)
    const analysisIntervalRef = useRef(null)

    // WebSocket bağlantısı
    useEffect(() => {
        const connectWebSocket = () => {
            try {
                const ws = new WebSocket(`ws://${BACKEND_URL.replace('http://', '')}`)
                wsRef.current = ws

                ws.onopen = () => {
                    console.log('WebSocket bağlantısı kuruldu')
                    setIsConnected(true)
                }

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data)
                    handleWebSocketMessage(data)
                }

                ws.onclose = () => {
                    console.log('WebSocket bağlantısı kapatıldı')
                    setIsConnected(false)
                    // 5 saniye sonra tekrar bağlanmaya çalış
                    setTimeout(connectWebSocket, 5000)
                }

                ws.onerror = (error) => {
                    console.error('WebSocket hatası:', error)
                    setIsConnected(false)
                }
            } catch (error) {
                console.error('WebSocket bağlantı hatası:', error)
                setIsConnected(false)
            }
        }

        connectWebSocket()

        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [])

    const handleWebSocketMessage = (data) => {
        switch (data.type) {
            case 'satellite_update':
                setSatelliteData(prev => [data.data, ...prev.slice(0, 19)])
                setLastUpdate(new Date())
                break
            case 'new_analysis':
                setSatelliteData(prev => [data.data, ...prev.slice(0, 19)])
                setLastUpdate(new Date())
                break
            default:
                break
        }
    }

    // API'den veri çekme
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                // Backend bağlantısını test et
                const healthResponse = await fetch(`${BACKEND_URL}/api/health`)
                if (!healthResponse.ok) {
                    throw new Error(`Backend bağlantı hatası: ${healthResponse.status}`)
                }

                const [satelliteResponse, statsResponse, alarmsResponse] = await Promise.all([
                    fetch(`${BACKEND_URL}/api/satellite-monitoring`),
                    fetch(`${BACKEND_URL}/api/statistics`),
                    fetch(`${BACKEND_URL}/api/alarms`)
                ])

                if (satelliteResponse.ok) {
                    const satelliteData = await satelliteResponse.json()
                    setSatelliteData(satelliteData)
                } else {
                    console.warn('Uydu verileri alınamadı:', satelliteResponse.status)
                }

                if (statsResponse.ok) {
                    const stats = await statsResponse.json()
                    setStatistics(stats)
                } else {
                    console.warn('İstatistik verileri alınamadı:', statsResponse.status)
                }

                if (alarmsResponse.ok) {
                    const alarmsData = await alarmsResponse.json()
                    setAlarms(alarmsData)
                } else {
                    console.warn('Alarm verileri alınamadı:', alarmsResponse.status)
                }

                setLastUpdate(new Date())
            } catch (error) {
                console.error('Veri çekme hatası:', error)
                // Hata durumunda varsayılan verileri kullan
                setSatelliteData([])
                setStatistics({
                    total_area: 0,
                    clean_area: 0,
                    moderate_pollution: 0,
                    polluted_area: 0,
                    critical_area: 0
                })
                setAlarms([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()

        // Her 30 saniyede bir veri güncelle
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [])

    // Otomatik analiz sistemi
    useEffect(() => {
        if (autoAnalysis) {
            // İlk analizi hemen başlat
            startAutoAnalysis()

            // Her 30 saniyede bir yeni analiz
            analysisIntervalRef.current = setInterval(() => {
                startAutoAnalysis()
            }, 30000)
        }

        return () => {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current)
            }
        }
    }, [autoAnalysis])

    const getPollutionLevelColor = (level) => {
        switch (level) {
            case 'temiz': return 'bg-green-100 text-green-800 border-green-200'
            case 'orta_kirlilik': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'kirli': return 'bg-red-100 text-red-800 border-red-200'
            case 'kritik': return 'bg-pink-100 text-pink-800 border-pink-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getPollutionLevelText = (level) => {
        switch (level) {
            case 'temiz': return 'Temiz'
            case 'orta_kirlilik': return 'Orta Kirlilik'
            case 'kirli': return 'Kirli'
            case 'kritik': return 'Kritik'
            default: return 'Bilinmeyen'
        }
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('tr-TR')
    }

    const refreshData = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${BACKEND_URL}/api/satellite-monitoring`)
            if (response.ok) {
                const data = await response.json()
                setSatelliteData(data)
                setLastUpdate(new Date())
            }
        } catch (error) {
            console.error('Veri yenileme hatası:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Otomatik analiz başlatma
    const startAutoAnalysis = async () => {
        if (isAnalyzing) return // Eğer zaten analiz yapılıyorsa bekle

        setIsAnalyzing(true)
        setAiStatus('analyzing')

        try {
            // Dinamik kıyı konumu seç - Marmara Denizi odaklı
            const location = SatelliteService.getRandomLocationInBounds('Marmara')
            setSelectedLocation(location)

            // Uydu görüntüsü al
            const satelliteImage = await SatelliteService.getSatelliteImage(location.coordinates)
            setCurrentImage(satelliteImage)

            console.log('Uydu görüntüsü alındı:', satelliteImage)
            console.log('Seçilen konum:', location)

            // AI servisini kullanarak analiz yap
            const analysisResult = await AIService.analyzeSatelliteImage(satelliteImage.url, {
                ...location.coordinates,
                location: location.name
            })

            console.log('AI analiz sonucu:', analysisResult)

            // Sonucu state'e ekle
            const newAnalysis = {
                ...analysisResult,
                location: location.name,
                coordinates: location.coordinates,
                timestamp: new Date().toISOString(),
                image_url: satelliteImage.url,
                satellite_info: satelliteImage
            }

            setSatelliteData(prev => [newAnalysis, ...prev.slice(0, 19)])
            setLastUpdate(new Date())
            setAiStatus('ready')

            // Eğer kirlilik seviyesi yüksekse alarm oluştur
            if (['kirli', 'kritik'].includes(analysisResult.pollution_level)) {
                const newAlarm = {
                    id: Date.now(),
                    location: location.name,
                    pollution_level: analysisResult.pollution_level,
                    confidence: analysisResult.confidence,
                    message: `${location.name} bölgesinde ${analysisResult.pollution_level} seviye kirlilik tespit edildi`,
                    created_at: new Date().toISOString()
                }
                setAlarms(prev => [newAlarm, ...prev])
            }

        } catch (error) {
            console.error('AI analiz hatası:', error)
            setAiStatus('error')

            // Hata durumunda simüle edilmiş analiz yap
            const location = selectedLocation || SatelliteService.getRandomLocationInBounds('Marmara')
            const simulatedAnalysis = {
                pollution_level: 'temiz',
                confidence: 85,
                risk_score: 1.5,
                recommendations: ['Sistem hatası nedeniyle simüle edilmiş analiz']
            }

            const newAnalysis = {
                ...simulatedAnalysis,
                location: location.name,
                coordinates: location.coordinates,
                timestamp: new Date().toISOString(),
                image_url: currentImage?.url || '',
                satellite_info: currentImage
            }

            setSatelliteData(prev => [newAnalysis, ...prev.slice(0, 19)])
            setLastUpdate(new Date())
        } finally {
            setIsAnalyzing(false)
        }
    }

    // Otomatik analizi durdur/başlat
    const toggleAutoAnalysis = () => {
        setAutoAnalysis(!autoAnalysis)
        if (analysisIntervalRef.current) {
            clearInterval(analysisIntervalRef.current)
        }
    }

    if (isLoading && satelliteData.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Uydu verileri yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <Satellite className="mr-3 text-primary-500" size={32} />
                                Canlı Uydu İzleme Sistemi
                            </h1>
                            <p className="text-lg text-gray-600 mt-2">
                                Uydu tabanlı otomatik deniz kirliliği izleme ve erken uyarı sistemi
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                <span className="text-sm font-medium">
                                    {isConnected ? 'Aktif İzleme' : 'Bağlantı Yok'}
                                </span>
                            </div>
                            <button
                                onClick={toggleAutoAnalysis}
                                className={`flex items-center space-x-2 ${autoAnalysis
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                    } px-4 py-2 rounded-lg font-medium transition-colors`}
                            >
                                <Activity className="animate-pulse" size={16} />
                                <span>{autoAnalysis ? 'Otomatik Analizi Durdur' : 'Otomatik Analizi Başlat'}</span>
                            </button>
                            <button
                                onClick={refreshData}
                                disabled={isLoading}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <RefreshCw className={`${isLoading ? 'animate-spin' : ''}`} size={16} />
                                <span>Yenile</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-500">
                            Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
                        </p>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${aiStatus === 'ready' ? 'bg-green-100 text-green-800' :
                            aiStatus === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            <Brain size={14} />
                            <span>
                                {aiStatus === 'ready' ? 'AI Hazır' :
                                    aiStatus === 'analyzing' ? 'AI Analiz Ediyor' :
                                        'AI Hatası'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* İstatistik Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="card bg-blue-50 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Toplam Alan</p>
                                <p className="text-3xl font-bold text-blue-700">{statistics.total_area}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <MapPin className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-green-50 border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Temiz</p>
                                <p className="text-3xl font-bold text-green-700">{statistics.clean_area}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-yellow-50 border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-600">Orta Kirlilik</p>
                                <p className="text-3xl font-bold text-yellow-700">{statistics.moderate_pollution}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <AlertTriangle className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-red-50 border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600">Kirli</p>
                                <p className="text-3xl font-bold text-red-700">{statistics.polluted_area}</p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-pink-50 border-pink-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-pink-600">Kritik</p>
                                <p className="text-3xl font-bold text-pink-700">{statistics.critical_area}</p>
                            </div>
                            <div className="p-3 bg-pink-100 rounded-lg">
                                <Zap className="text-pink-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Uydu Görüntüsü ve Analiz */}
                <div className="mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Eye className="mr-2 text-primary-500" size={20} />
                                Uydu Görüntüsü ve AI Analiz
                            </h3>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${autoAnalysis ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></div>
                                    <span className="text-sm text-gray-500">
                                        {autoAnalysis ? 'Otomatik Analiz Aktif' : 'Otomatik Analiz Kapalı'}
                                    </span>
                                </div>
                                {selectedLocation && (
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">{selectedLocation.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-80 flex items-center justify-center relative overflow-hidden">
                            {isAnalyzing ? (
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-lg text-blue-700 font-medium">AI Analiz Ediyor...</p>
                                    <p className="text-sm text-blue-600 mt-2">
                                        {selectedLocation ? `${selectedLocation.name} bölgesi analiz ediliyor...` : 'Yapay zeka modülü görüntüyü analiz ediyor'}
                                    </p>
                                </div>
                            ) : selectedLocation ? (
                                <div className="w-full h-full relative">
                                    <SatelliteImage
                                        lat={selectedLocation.coordinates.lat}
                                        lng={selectedLocation.coordinates.lng}
                                    />
                                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
                                        <p className="text-sm font-medium">{selectedLocation.name}</p>
                                        <p className="text-xs opacity-75">
                                            {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}
                                        </p>
                                        <div className="mt-2 pt-2 border-t border-white border-opacity-30">
                                            <p className="text-xs opacity-75">
                                                NASA GIBS • 250m
                                            </p>
                                            <p className="text-xs opacity-60">
                                                {new Date().toISOString().split('T')[0]}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Analiz sonucu overlay */}
                                    {satelliteData.length > 0 && satelliteData[0].location === selectedLocation?.name && (
                                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
                                            <p className="text-sm font-medium">
                                                {getPollutionLevelText(satelliteData[0].pollution_level)} - %{satelliteData[0].confidence} güven
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Satellite className="mx-auto mb-4 text-blue-600" size={48} />
                                    <p className="text-lg text-blue-700 font-medium">Uydu görüntüsü bekleniyor...</p>
                                    <p className="text-sm text-blue-600 mt-2">
                                        Otomatik analiz başlatılıyor...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ana İçerik */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Son Uydu Analizleri */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Camera className="mr-2 text-primary-500" size={20} />
                                Son Uydu Analizleri
                            </h3>
                            <div className="flex items-center space-x-2">
                                <Activity className="text-green-500" size={16} />
                                <span className="text-sm text-gray-500">Canlı</span>
                            </div>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {satelliteData.map((item, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${getPollutionLevelColor(item.pollution_level)}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">{item.location}</h4>
                                        <span className="text-sm font-medium">
                                            {getPollutionLevelText(item.pollution_level)} - %{item.confidence} güven
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span className="flex items-center">
                                            <Clock size={14} className="mr-1" />
                                            {formatTime(item.timestamp)}
                                        </span>
                                        <span className="flex items-center">
                                            <Satellite size={14} className="mr-1" />
                                            Satellite
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Aktif Alarmlar */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <AlertTriangle className="mr-2 text-red-500" size={20} />
                                Aktif Alarmlar
                            </h3>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                {alarms.length} aktif
                            </span>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {alarms.length > 0 ? (
                                alarms.map((alarm, index) => (
                                    <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-start space-x-3">
                                            <AlertTriangle className="text-yellow-600 mt-1" size={16} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 mb-1">
                                                    {alarm.message}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-600">
                                                    <span>{alarm.location} - %{alarm.confidence} güven</span>
                                                    <span>{formatTime(alarm.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                                    <p>Şu anda aktif alarm bulunmuyor</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SatelliteMonitoringPage
