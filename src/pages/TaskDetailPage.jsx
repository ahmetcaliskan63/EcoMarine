import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  X,
  Plus,
  Upload,
  Download,
  Eye,
  Edit,
  MessageSquare,
  FileText,
  Camera,
  Paperclip
} from 'lucide-react'

const TaskDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState([])
  const [showMap, setShowMap] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [showUploadFile, setShowUploadFile] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  // Demo görev verisi
  useEffect(() => {
    const demoTasks = {
      '1234': {
        id: 1234,
        title: 'Marmara Denizi Ölü Balık İhbarı',
        description: 'Tuzla açıklarında ölü balık tespit edildi. Acil müdahale gerekiyor. Balık türleri: Levrek, Çupra, Lüfer. Tahmini ölü balık sayısı: 150-200 adet. Su sıcaklığı normal seviyede ancak oksijen seviyesi düşük.',
        location: 'Marmara Denizi - Tuzla',
        coordinates: { lat: 40.8563, lng: 29.3167 },
        priority: 'high',
        status: 'open',
        assignedTo: 'Ahmet Yılmaz',
        assignedBy: 'Dr. Mehmet Özkan',
        createdAt: '2024-03-14T09:00:00Z',
        dueDate: '2024-03-15T18:00:00Z',
        updatedAt: '2024-03-14T14:30:00Z',
        category: 'Kirlilik İhbarı',
        estimatedDuration: '4 saat',
        requiredEquipment: ['Su numunesi alma kiti', 'Fotoğraf makinesi', 'GPS cihazı'],
        safetyNotes: 'Dalgıç kıyafeti gerekli. Su sıcaklığı 12°C. Güvenlik önlemleri alınmalı.'
      }
    }

    const demoTask = demoTasks[id]
    if (demoTask) {
      setTask(demoTask)
      setNotes([
        {
          id: 1,
          content: 'Görev alındı. Tuzla limanından hareket edilecek.',
          author: 'Ahmet Yılmaz',
          createdAt: '2024-03-14T09:15:00Z'
        },
        {
          id: 2,
          content: 'Su numunesi alındı. Laboratuvara gönderildi.',
          author: 'Ahmet Yılmaz',
          createdAt: '2024-03-14T11:30:00Z'
        }
      ])
      setUploadedFiles([
        {
          id: 1,
          name: 'su_numesi_1.jpg',
          type: 'image',
          size: '2.3 MB',
          uploadedAt: '2024-03-14T11:45:00Z'
        },
        {
          id: 2,
          name: 'rapor_analiz.pdf',
          type: 'document',
          size: '1.8 MB',
          uploadedAt: '2024-03-14T12:00:00Z'
        }
      ])
    }
    setLoading(false)
  }, [id])

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Açık', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      in_progress: { label: 'Devam Ediyor', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      completed: { label: 'Tamamlandı', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <span className={`badge ${config.color} flex items-center space-x-1`}>
        <Icon size={12} />
        <span>{config.label}</span>
      </span>
    )
  }

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { label: 'Yüksek', color: 'bg-red-100 text-red-800' },
      medium: { label: 'Orta', color: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Düşük', color: 'bg-green-100 text-green-800' }
    }
    
    const config = priorityConfig[priority]
    return <span className={`badge ${config.color}`}>{config.label}</span>
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

  const getDaysUntilDue = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleStatusChange = (newStatus) => {
    setTask(prev => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }))
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote,
        author: 'Ahmet Yılmaz',
        createdAt: new Date().toISOString()
      }
      setNotes(prev => [note, ...prev])
      setNewNote('')
      setShowAddNote(false)
    }
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      uploadedAt: new Date().toISOString()
    }))
    setUploadedFiles(prev => [...newFiles, ...prev])
    setShowUploadFile(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Görev bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Görev Bulunamadı</h2>
          <p className="text-gray-600 mb-4">Aradığınız görev mevcut değil.</p>
          <Link to="/tasks" className="btn-primary">
            Görev Listesine Dön
          </Link>
        </div>
      </div>
    )
  }

  const daysUntilDue = getDaysUntilDue(task.dueDate)
  const isOverdue = daysUntilDue < 0
  const isDueSoon = daysUntilDue <= 1 && daysUntilDue >= 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Geri Dön Butonu */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span>Görev Listesine Dön</span>
          </button>
        </div>

        {/* Görev Başlığı ve Durum */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Görev #{task.id}: {task.title}
              </h1>
              <div className="flex items-center space-x-4">
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
                <span className="text-sm text-gray-500">
                  {task.category}
                </span>
              </div>
            </div>
            
            {/* Aksiyon Butonları */}
            <div className="flex flex-wrap gap-3 mt-4 lg:mt-0">
              {task.status === 'open' && (
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Play size={16} />
                  <span>Görevi Başlat</span>
                </button>
              )}
              
              {task.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="btn-primary flex items-center space-x-2"
                >
                  <CheckCircle size={16} />
                  <span>Görevi Tamamla</span>
                </button>
              )}
              
              {task.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="btn-danger flex items-center space-x-2"
                >
                  <X size={16} />
                  <span>Görevi İptal Et</span>
                </button>
              )}
            </div>
          </div>

          {/* Tarih Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Oluşturulma</p>
                <p className="font-medium">{formatDate(task.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Son Tarih</p>
                <p className={`font-medium ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-900'}`}>
                  {formatDate(task.dueDate)}
                  {isOverdue && <span className="ml-2 text-xs">({Math.abs(daysUntilDue)} gün gecikmiş)</span>}
                  {isDueSoon && !isOverdue && <span className="ml-2 text-xs">({daysUntilDue === 0 ? 'Bugün' : 'Yarın'} bitiyor)</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Atanan Kişi</p>
                <p className="font-medium">{task.assignedTo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Sütun - Görev Detayları */}
          <div className="lg:col-span-2 space-y-6">
            {/* Açıklama */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Görev Açıklaması</h3>
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </div>

            {/* Konum Bilgisi */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Konum Bilgisi</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="text-gray-400" size={20} />
                  <span className="text-gray-700">{task.location}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowMap(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <MapPin size={16} />
                    <span>Haritada Göster</span>
                  </button>
                  <button className="btn-secondary flex items-center space-x-2">
                    <Download size={16} />
                    <span>Koordinatları İndir</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Görev Detayları */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Görev Detayları</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tahmini Süre</p>
                  <p className="font-medium">{task.estimatedDuration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Atayan Kişi</p>
                  <p className="font-medium">{task.assignedBy}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-2">Gerekli Ekipmanlar</p>
                  <ul className="list-disc list-inside space-y-1">
                    {task.requiredEquipment.map((equipment, index) => (
                      <li key={index} className="text-gray-700">{equipment}</li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-2">Güvenlik Notları</p>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    {task.safetyNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Dosyalar */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Dosyalar</h3>
                <button
                  onClick={() => setShowUploadFile(true)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Upload size={16} />
                  <span>Dosya Yükle</span>
                </button>
              </div>
              
              {uploadedFiles.length > 0 ? (
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {file.type === 'image' ? (
                          <Camera className="text-gray-400" size={20} />
                        ) : (
                          <FileText className="text-gray-400" size={20} />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{file.size} • {formatDate(file.uploadedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Paperclip size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Henüz dosya yüklenmemiş</p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Sütun - Notlar ve Hızlı İşlemler */}
          <div className="space-y-6">
            {/* Notlar */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notlar</h3>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Not Ekle</span>
                </button>
              </div>

              {/* Not Ekleme Formu */}
              {showAddNote && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Notunuzu yazın..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => setShowAddNote(false)}
                      className="btn-secondary"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleAddNote}
                      className="btn-primary"
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              )}

              {/* Notlar Listesi */}
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{note.author}</p>
                      <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hızlı İşlemler */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Edit size={16} />
                  <span>Görevi Düzenle</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <User size={16} />
                  <span>Kişi Değiştir</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Calendar size={16} />
                  <span>Tarih Değiştir</span>
                </button>
                <button className="w-full btn-danger flex items-center justify-center space-x-2">
                  <X size={16} />
                  <span>Görevi Sil</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dosya Yükleme Modal */}
        {showUploadFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dosya Yükle</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-2">Dosyalarınızı buraya sürükleyin</p>
                  <p className="text-sm text-gray-500">veya</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                    Dosya Seç
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowUploadFile(false)}
                    className="btn-secondary"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Harita Modal */}
        {showMap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Harita Görünümü</h3>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin size={48} className="mx-auto mb-4" />
                  <p>Harita görünümü burada olacak</p>
                  <p className="text-sm">Koordinatlar: {task.coordinates.lat}, {task.coordinates.lng}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetailPage
