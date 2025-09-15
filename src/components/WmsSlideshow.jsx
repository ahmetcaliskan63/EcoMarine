import React, { useEffect, useMemo, useRef, useState } from 'react'

const WmsSlideshow = ({ urls = [], intervalMs = 3000, visible = true, title = 'WMS Slideshow' }) => {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  const safeUrls = useMemo(() => urls.filter(Boolean), [urls])

  useEffect(() => {
    if (!visible || safeUrls.length === 0) return

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeUrls.length)
    }, Math.max(1000, intervalMs))

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [visible, safeUrls, intervalMs])

  if (!visible || safeUrls.length === 0) return null

  const currentUrl = safeUrls[index]

  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden w-[320px]">
      <div className="px-3 py-2 border-b flex items-center justify-between">
        <div className="text-sm font-medium text-gray-800">{title}</div>
        <div className="text-xs text-gray-500">{index + 1}/{safeUrls.length}</div>
      </div>
      <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={index}
          src={currentUrl}
          alt={`WMS frame ${index + 1}`}
          className="max-w-full max-h-full object-contain"
          crossOrigin="anonymous"
        />
      </div>
      <div className="px-3 py-2 bg-white text-[10px] text-gray-500 break-all max-h-16 overflow-auto">
        {currentUrl}
      </div>
      <div className="px-3 py-2 flex items-center justify-between bg-white border-t">
        <button
          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => setIndex((prev) => (prev - 1 + safeUrls.length) % safeUrls.length)}
        >Önceki</button>
        <button
          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
          onClick={() => setIndex((prev) => (prev + 1) % safeUrls.length)}
        >Sonraki</button>
      </div>
    </div>
  )
}

export default WmsSlideshow



