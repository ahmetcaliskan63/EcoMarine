import React, { useState, useRef, useEffect } from 'react'

const LazyImage = ({ 
  src, 
  alt, 
  className = "", 
  placeholder = null,
  onLoad = null,
  onError = null 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad && onLoad()
  }

  const handleError = () => {
    setHasError(true)
    onError && onError()
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {!isInView && placeholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded">
          {placeholder}
        </div>
      )}
      
      {isInView && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center">
          <div className="text-gray-400 text-sm">Yükleniyor...</div>
        </div>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading="lazy"
        />
      )}
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 rounded flex items-center justify-center">
          <div className="text-gray-400 text-sm">Resim yüklenemedi</div>
        </div>
      )}
    </div>
  )
}

export default LazyImage
