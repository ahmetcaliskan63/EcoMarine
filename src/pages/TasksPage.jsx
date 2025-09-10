import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Edit,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)

  // Demo veriler
  useEffect(() => {
    const demoTasks = [
      {
        id: 1234,
        title: 'Marmara Denizi Ölü Balık İhbarı',
        description: 'Tuzla açıklarında ölü balık tespit edildi. Acil müdahale gerekiyor.',
        location: 'Marmara Denizi - Tuzla',
        priority: 'high',
        status: 'open',
        assignedTo: 'Ahmet Yılmaz',
        createdAt: '2024-03-14T09:00:00Z',
        dueDate: '2024-03-15T18:00:00Z',
        updatedAt: '2024-03-14T14:30:00Z'
      },
      {
        id: 1235,
        title: 'İstanbul Boğazı Kirlilik Raporu',
        description: 'Boğazda petrol sızıntısı tespit edildi. Temizlik çalışması başlatılacak.',
        location: 'İstanbul Boğazı - Beşiktaş',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: 'Mehmet Kaya',
        createdAt: '2024-03-13T10:30:00Z',
        dueDate: '2024-03-16T12:00:00Z',
        updatedAt: '2024-03-14T16:45:00Z'
      },
      {
        id: 1236,
        title: 'Karadeniz Su Kalitesi Ölçümü',
        description: 'Şile açıklarında su kalitesi ölçümleri yapılacak.',
        location: 'Karadeniz - Şile',
        priority: 'low',
        status: 'completed',
        assignedTo: 'Ayşe Demir',
        createdAt: '2024-03-12T08:15:00Z',
        dueDate: '2024-03-14T17:00:00Z',
        updatedAt: '2024-03-14T15:20:00Z'
      },
      {
        id: 1237,
        title: 'Marmara Denizi Plastik Atık Temizliği',
        description: 'Kadıköy sahillerinde plastik atık temizlik çalışması.',
        location: 'Marmara Denizi - Kadıköy',
        priority: 'medium',
        status: 'open',
        assignedTo: 'Ahmet Yılmaz',
        createdAt: '2024-03-14T11:20:00Z',
        dueDate: '2024-03-17T14:00:00Z',
        updatedAt: '2024-03-14T11:20:00Z'
      },
      {
        id: 1238,
        title: 'Boğaz Köprüsü Altı İnceleme',
        description: 'Köprü altında olası kirlilik kaynaklarının incelenmesi.',
        location: 'Boğaz Köprüsü Altı',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'Mehmet Kaya',
        createdAt: '2024-03-13T14:00:00Z',
        dueDate: '2024-03-15T16:00:00Z',
        updatedAt: '2024-03-14T10:15:00Z'
      }
    ]
    setTasks(demoTasks)
    setFilteredTasks(demoTasks)
  }, [])

  // Filtreleme ve arama
  useEffect(() => {
    let filtered = tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.id.toString().includes(searchTerm) ||
                           task.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      
      let matchesDate = true
      if (dateFilter !== 'all') {
        const now = new Date()
        const taskDate = new Date(task.dueDate)
        const diffDays = Math.ceil((taskDate - now) / (1000 * 60 * 60 * 24))
        
        switch (dateFilter) {
          case 'today':
            matchesDate = diffDays === 0
            break
          case 'tomorrow':
            matchesDate = diffDays === 1
            break
          case 'this_week':
            matchesDate = diffDays >= 0 && diffDays <= 7
            break
          case 'overdue':
            matchesDate = diffDays < 0
            break
        }
      }
      
      return matchesSearch && matchesStatus && matchesPriority && matchesDate
    })

    // Sıralama
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      if (sortField === 'dueDate' || sortField === 'createdAt') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredTasks(filtered)
    setCurrentPage(1)
  }, [tasks, searchTerm, statusFilter, priorityFilter, dateFilter, sortField, sortDirection])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

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

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPriorityFilter('all')
    setDateFilter('all')
    setSortField('id')
    setSortDirection('asc')
  }

  // Sayfalandırma
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTasks = filteredTasks.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Yeni Görev Butonu */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Görevlerim</h1>
            <p className="text-gray-600">
              Toplam {filteredTasks.length} görev bulundu
            </p>
          </div>
          <Link to="/tasks/new" className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0">
            <Plus size={20} />
            <span>Yeni Görev Oluştur</span>
          </Link>
        </div>

        {/* Filtreler ve Arama */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Arama */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Görev ara (başlık, ID, konum)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Filtre Butonu */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter size={20} />
              <span>Filtreler</span>
              <ChevronDown className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} size={16} />
            </button>
          </div>

          {/* Filtre Seçenekleri */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Durum Filtresi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">Tümü</option>
                    <option value="open">Açık</option>
                    <option value="in_progress">Devam Ediyor</option>
                    <option value="completed">Tamamlandı</option>
                  </select>
                </div>

                {/* Öncelik Filtresi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">Tümü</option>
                    <option value="high">Yüksek</option>
                    <option value="medium">Orta</option>
                    <option value="low">Düşük</option>
                  </select>
                </div>

                {/* Tarih Filtresi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">Tümü</option>
                    <option value="today">Bugün</option>
                    <option value="tomorrow">Yarın</option>
                    <option value="this_week">Bu Hafta</option>
                    <option value="overdue">Gecikmiş</option>
                  </select>
                </div>

                {/* Filtreleri Temizle */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <X size={16} />
                    <span>Temizle</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Görev Tablosu */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ID</span>
                      {sortField === 'id' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Görev
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konum
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Öncelik</span>
                      {sortField === 'priority' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Durum</span>
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Son Tarih</span>
                      {sortField === 'dueDate' && (
                        sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTasks.map((task) => {
                  const daysUntilDue = getDaysUntilDue(task.dueDate)
                  const isOverdue = daysUntilDue < 0
                  const isDueSoon = daysUntilDue <= 1 && daysUntilDue >= 0
                  
                  return (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{task.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin size={16} className="mr-1 text-gray-400" />
                          <span className="truncate max-w-32">{task.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(task.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(task.dueDate)}
                        </div>
                        {isOverdue && (
                          <div className="text-xs text-red-600 font-medium">
                            {Math.abs(daysUntilDue)} gün gecikmiş
                          </div>
                        )}
                        {isDueSoon && !isOverdue && (
                          <div className="text-xs text-yellow-600 font-medium">
                            {daysUntilDue === 0 ? 'Bugün' : 'Yarın'} bitiyor
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/tasks/${task.id}`}
                            className="text-primary-500 hover:text-primary-600 flex items-center space-x-1"
                          >
                            <Eye size={16} />
                            <span>Detay</span>
                          </Link>
                          <button className="text-gray-500 hover:text-gray-600">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Boş Durum */}
          {currentTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Görev bulunamadı</h3>
              <p className="text-gray-500 mb-4">
                Arama kriterlerinize uygun görev bulunamadı.
              </p>
              <button onClick={clearFilters} className="btn-primary">
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>

        {/* Sayfalandırma */}
        {filteredTasks.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-sm text-gray-700">
                Sayfa başına göster:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="input-field w-20"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === page
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TasksPage
