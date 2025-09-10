import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="mb-6">
              <AlertTriangle className="text-red-500 mx-auto mb-4" size={64} />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bir Hata Oluştu
              </h1>
              <p className="text-gray-600 mb-6">
                Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={this.handleReload}
                className="btn-primary flex items-center justify-center space-x-2 mx-auto"
              >
                <RefreshCw size={16} />
                <span>Sayfayı Yenile</span>
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="btn-secondary mx-auto block"
              >
                Geri Dön
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Hata Detayları (Geliştirici Modu)
                </summary>
                <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-4 rounded overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
