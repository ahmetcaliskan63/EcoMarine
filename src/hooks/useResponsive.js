import { useState, useEffect } from 'react'

const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const breakpoints = {
    xs: screenSize.width < 320,
    sm: screenSize.width < 640,
    md: screenSize.width < 768,
    lg: screenSize.width < 1024,
    xl: screenSize.width < 1280,
    '2xl': screenSize.width >= 1280
  }

  const isMobile = screenSize.width < 768
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024
  const isDesktop = screenSize.width >= 1024

  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'

  return {
    ...screenSize,
    ...breakpoints,
    isMobile,
    isTablet,
    isDesktop,
    deviceType
  }
}

export default useResponsive
