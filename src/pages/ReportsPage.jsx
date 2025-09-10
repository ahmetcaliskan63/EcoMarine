import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar,
  MapPin,
  Users,
  FileText,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  RefreshCw
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

// Chart.js kayıt
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPersonnel, setSelectedPersonnel] = useState('all')
  const [loading, setLoading] = useState(false)

  // Demo veriler
  const [reportData, setReportData] = useState({
    kpis: {
      totalEvents: 47,
      averageResponseTime: '2.3 saat',
      completionRate: 89,
      successRate: 85,
      activeTasks: 12
    },
    // Aylık Görev Performansı
    monthlyTaskPerformance: {
      labels: ['Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık', 'Ocak'],
      datasets: [
        {
          label: 'Tamamlanan',
          data: [15, 21, 28, 15, 30, 18],
          backgroundColor: '#1E5A7D',
          borderColor: '#1E5A7D',
          borderWidth: 1
        },
        {
          label: 'Toplam',
          data: [18, 24, 32, 18, 35, 24],
          backgroundColor: '#3A847C',
          borderColor: '#3A847C',
          borderWidth: 1
        }
      ]
    },
    // Haftalık Olay Takibi
    weeklyEventTracking: {
      labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      datasets: [
        {
          label: 'Yeni Olaylar',
          data: [3, 5, 2, 7, 5, 1, 2],
          borderColor: '#E67E22',
          backgroundColor: 'rgba(230, 126, 34, 0.1)',
          tension: 0.4,
          fill: false
        },
        {
          label: 'Çözülmüş',
          data: [2, 4, 2, 5, 4, 1, 1],
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          tension: 0.4,
          fill: false
        }
      ]
    },
    // Öncelik Dağılımı
    priorityDistribution: {
      labels: ['Yüksek', 'Orta', 'Düşük'],
      data: [12, 23, 18],
      backgroundColor: ['#E74C3C', '#FFC107', '#28a745']
    },
    // Durum Dağılımı
    statusDistribution: {
      labels: ['Tamamlandı', 'Devam Ediyor', 'Açık'],
      data: [42, 8, 5],
      backgroundColor: ['#28a745', '#1E5A7D', '#6c757d']
    },
    personnelPerformance: [
      { name: 'Ahmet Yılmaz', completed: 12, success: 11, avgTime: '2.1 saat' },
      { name: 'Mehmet Kaya', completed: 10, success: 9, avgTime: '2.5 saat' },
      { name: 'Ayşe Demir', completed: 8, success: 7, avgTime: '2.8 saat' },
      { name: 'Fatma Özkan', completed: 6, success: 5, avgTime: '3.2 saat' }
    ]
  })

  const handleFilterChange = () => {
    setLoading(true)
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleExport = (format) => {
    alert(`${format} formatında rapor indiriliyor...`)
  }

  const getPeriodLabel = (period) => {
    const periods = {
      'this_week': 'Bu Hafta',
      'this_month': 'Bu Ay',
      'last_month': 'Geçen Ay',
      'this_quarter': 'Bu Çeyrek',
      'this_year': 'Bu Yıl'
    }
    return periods[period] || period
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Filtreler */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Raporlar ve Analizler</h1>
              <p className="text-gray-600">
                Çevresel verilerin analizi ve performans raporları
              </p>
            </div>
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <button
                onClick={() => handleExport('PDF')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>PDF İndir</span>
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Excel İndir</span>
              </button>
            </div>
          </div>

          {/* Filtreler */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dönem</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="input-field"
                >
                  <option value="this_week">Bu Hafta</option>
                  <option value="this_month">Bu Ay</option>
                  <option value="last_month">Geçen Ay</option>
                  <option value="this_quarter">Bu Çeyrek</option>
                  <option value="this_year">Bu Yıl</option>
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
                  <option value="marmara">Marmara Denizi</option>
                  <option value="bosphorus">İstanbul Boğazı</option>
                  <option value="blacksea">Karadeniz</option>
                  <option value="aegean">Ege Denizi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Olay Türü</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input-field"
                >
                  <option value="all">Tüm Türler</option>
                  <option value="pollution">Kirlilik</option>
                  <option value="wildlife">Deniz Yaşamı</option>
                  <option value="water_quality">Su Kalitesi</option>
                  <option value="emergency">Acil Durum</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personel</label>
                <select
                  value={selectedPersonnel}
                  onChange={(e) => setSelectedPersonnel(e.target.value)}
                  className="input-field"
                >
                  <option value="all">Tüm Personel</option>
                  <option value="ahmet">Ahmet Yılmaz</option>
                  <option value="mehmet">Mehmet Kaya</option>
                  <option value="ayse">Ayşe Demir</option>
                  <option value="fatma">Fatma Özkan</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleFilterChange}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <Filter size={16} />
                )}
                <span>{loading ? 'Yükleniyor...' : 'Filtrele'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Olay</p>
                <p className="text-3xl font-bold text-primary-500">{reportData.kpis.totalEvents}</p>
                <p className="text-sm text-gray-500">Bu ay</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <BarChart3 className="text-primary-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Süre</p>
                <p className="text-3xl font-bold text-warning">{reportData.kpis.averageResponseTime}</p>
                <p className="text-sm text-gray-500">müdahale</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-warning" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tamamlanma</p>
                <p className="text-3xl font-bold text-success">{reportData.kpis.completionRate}%</p>
                <p className="text-sm text-gray-500">oranı</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-success" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
                <p className="text-3xl font-bold text-secondary-500">{reportData.kpis.successRate}%</p>
                <p className="text-sm text-gray-500">müdahale</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <Target className="text-secondary-500" size={24} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Görev</p>
                <p className="text-3xl font-bold text-accent-orange">{reportData.kpis.activeTasks}</p>
                <p className="text-sm text-gray-500">şu an</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Activity className="text-accent-orange" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Grafikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Aylık Görev Performansı */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="mr-2 text-primary-500" size={20} />
                Aylık Görev Performansı
              </h3>
              <button
                onClick={() => handleExport('Chart')}
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                <Download size={16} />
              </button>
            </div>
            <div className="h-64">
              <Bar
                data={reportData.monthlyTaskPerformance}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    title: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      titleColor: '#1f2937',
                      bodyColor: '#374151',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                      cornerRadius: 8,
                      displayColors: true,
                      callbacks: {
                        title: function(context) {
                          return context[0].label;
                        },
                        label: function(context) {
                          return context.dataset.label + ' : ' + context.parsed.y;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Haftalık Olay Takibi */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="mr-2 text-secondary-500" size={20} />
                Haftalık Olay Takibi
              </h3>
              <button
                onClick={() => handleExport('Chart')}
                className="text-sm text-secondary-500 hover:text-secondary-600"
              >
                <Download size={16} />
              </button>
            </div>
            <div className="h-64">
              <Line
                data={reportData.weeklyEventTracking}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    title: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      titleColor: '#1f2937',
                      bodyColor: '#374151',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                      cornerRadius: 8,
                      displayColors: true,
                      callbacks: {
                        title: function(context) {
                          return context[0].label;
                        },
                        label: function(context) {
                          return context.dataset.label + ' : ' + context.parsed.y;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Pasta Grafikler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Öncelik Dağılımı */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="mr-2 text-accent-orange" size={20} />
                Öncelik Dağılımı
              </h3>
              <button
                onClick={() => handleExport('Chart')}
                className="text-sm text-accent-orange hover:text-orange-600"
              >
                <Download size={16} />
              </button>
            </div>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: reportData.priorityDistribution.labels,
                  datasets: [
                    {
                      data: reportData.priorityDistribution.data,
                      backgroundColor: reportData.priorityDistribution.backgroundColor,
                      borderWidth: 2,
                      borderColor: '#fff',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    title: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      titleColor: '#1f2937',
                      bodyColor: '#374151',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                      cornerRadius: 8,
                      displayColors: true,
                      callbacks: {
                        title: function(context) {
                          return context[0].label;
                        },
                        label: function(context) {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((context.parsed / total) * 100);
                          return context.dataset.label + ' : ' + context.parsed + ' (' + percentage + '%)';
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>

          {/* Durum Dağılımı */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="mr-2 text-primary-500" size={20} />
                Durum Dağılımı
              </h3>
              <button
                onClick={() => handleExport('Chart')}
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                <Download size={16} />
              </button>
            </div>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: reportData.statusDistribution.labels,
                  datasets: [
                    {
                      data: reportData.statusDistribution.data,
                      backgroundColor: reportData.statusDistribution.backgroundColor,
                      borderWidth: 2,
                      borderColor: '#fff',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                    title: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      titleColor: '#1f2937',
                      bodyColor: '#374151',
                      borderColor: '#e5e7eb',
                      borderWidth: 1,
                      cornerRadius: 8,
                      displayColors: true,
                      callbacks: {
                        title: function(context) {
                          return context[0].label;
                        },
                        label: function(context) {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((context.parsed / total) * 100);
                          return context.dataset.label + ' : ' + context.parsed + ' (' + percentage + '%)';
                        }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Personel Performansı */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="mr-2 text-primary-500" size={20} />
                Personel Performansı
              </h3>
              <button
                onClick={() => handleExport('Excel')}
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                <Download size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.personnelPerformance.map((person, index) => (
                <div key={person.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{person.name}</h4>
                    <span className="text-sm text-gray-500">{person.avgTime}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-gray-600">Tamamlanan:</span>
                      <span className="font-medium">{person.completed}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target size={16} className="text-blue-500" />
                      <span className="text-gray-600">Başarılı:</span>
                      <span className="font-medium">{person.success}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${(person.success / person.completed) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Başarı oranı: {Math.round((person.success / person.completed) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Özet Rapor */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="mr-2 text-gray-500" size={20} />
              Özet Rapor
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('PDF')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Excel</span>
              </button>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Genel Durum</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Bu ay toplam {reportData.kpis.totalEvents} olay tespit edildi</li>
                  <li>• Ortalama müdahale süresi {reportData.kpis.averageResponseTime}</li>
                  <li>• Görev tamamlanma oranı %{reportData.kpis.completionRate}</li>
                  <li>• Başarılı müdahale oranı %{reportData.kpis.successRate}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Öneriler</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Marmara Denizi'nde daha sık izleme yapılmalı</li>
                  <li>• Müdahale sürelerini kısaltmak için ekipman güncellemesi</li>
                  <li>• Personel eğitim programları düzenlenmeli</li>
                  <li>• Acil durum protokolleri gözden geçirilmeli</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
