import React from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Ana içeriğe geç
      </a>
      
      {/* Header - Sabit üst */}
      <Header />
      
      {/* Main Content - Esnek orta */}
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>
      
      {/* Footer - Sabit alt */}
      <Footer />
    </div>
  )
}

export default Layout
