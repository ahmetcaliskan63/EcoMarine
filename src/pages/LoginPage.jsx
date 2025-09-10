import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react'

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    setLoginError('')
  }

  const validateForm = () => {
    const newErrors = {}

    // Kullanıcı adı kontrolü
    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı gereklidir'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır'
    }

    // Şifre kontrolü
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setLoginError('')

    try {
      // Simüle edilmiş API çağrısı
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Demo için basit kontrol
      if (formData.username === 'admin' && formData.password === '123456') {
        // Başarılı giriş
        localStorage.setItem('user', JSON.stringify({
          username: formData.username,
          name: 'Ahmet Yılmaz',
          role: 'Saha Personeli',
          loginTime: new Date().toISOString()
        }))
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
        }
        
        navigate('/dashboard')
      } else {
        setLoginError('Kullanıcı adı veya şifre hatalı')
      }
    } catch (error) {
      setLoginError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    // Şifre sıfırlama sayfasına yönlendirme
    alert('Şifre sıfırlama özelliği yakında eklenecek!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mb-6">
            <span className="text-white font-bold text-3xl">E</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            EcoMarineAI
          </h1>
          <h2 className="text-xl text-gray-600 mb-2">
            Saha Personeli Yönetim Sistemi
          </h2>
          <p className="text-gray-500 text-sm">
            Hoş geldiniz! Lütfen giriş yapın
          </p>
        </div>

        {/* Giriş Formu */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Genel Hata Mesajı */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-3">
                <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                <span className="text-red-700 text-sm">{loginError}</span>
              </div>
            )}

            {/* Kullanıcı Adı */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className={`input-field ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Kullanıcı adınızı girin"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.username}</span>
                </p>
              )}
            </div>

            {/* Şifre */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input-field pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Şifrenizi girin"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle size={14} />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Beni Hatırla ve Şifremi Unuttum */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Beni hatırla
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                disabled={isLoading}
              >
                Şifremi unuttum
              </button>
            </div>

            {/* Giriş Butonu */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Giriş yapılıyor...</span>
                </>
              ) : (
                <span>Giriş Yap</span>
              )}
            </button>
          </form>
        </div>

        {/* Alt Bilgi */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Sorun yaşıyorsanız{' '}
            <a href="mailto:support@ecomarineai.com" className="text-primary-500 hover:text-primary-600">
              destek ekibimizle
            </a>{' '}
            iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
