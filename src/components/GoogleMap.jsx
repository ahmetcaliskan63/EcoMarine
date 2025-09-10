import React, { useEffect, useRef } from 'react'

const GoogleMap = ({ center, zoom, events, onMapClick }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    // Google Maps API'nin yüklendiğini kontrol et
    if (!window.google || !window.google.maps) {
      console.error('Google Maps API yüklenmedi!')
      return
    }

    if (mapRef.current && !mapInstanceRef.current) {
      try {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: center[0], lng: center[1] },
          zoom: zoom,
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#1E5A7D' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#F5F5F5' }]
            }
          ]
        })

        // Map click event
        if (onMapClick) {
          mapInstanceRef.current.addListener('click', onMapClick)
        }
      } catch (error) {
        console.error('Google Maps oluşturulurken hata:', error)
      }
    }
  }, [center, zoom, onMapClick])

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: center[0], lng: center[1] })
      mapInstanceRef.current.setZoom(zoom)
    }
  }, [center, zoom])

  useEffect(() => {
    if (mapInstanceRef.current && events) {
      // Clear existing markers
      const markers = mapInstanceRef.current.markers || []
      markers.forEach(marker => marker.setMap(null))

      // Add new markers
      const newMarkers = events.map(event => {
        const marker = new window.google.maps.Marker({
          position: { lat: event.location[0], lng: event.location[1] },
          map: mapInstanceRef.current,
          title: event.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getEventColor(event.type, event.priority),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        })

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">${event.title}</h3>
              <div style="margin-bottom: 4px;">
                <strong>Tür:</strong> ${getEventTypeLabel(event.type)}
              </div>
              <div style="margin-bottom: 4px;">
                <strong>Durum:</strong> ${getStatusLabel(event.status)}
              </div>
              <div style="margin-bottom: 4px;">
                <strong>Personel:</strong> ${event.personnel}
              </div>
              <div style="margin-bottom: 8px;">
                <strong>Tarih:</strong> ${event.date}
              </div>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">${event.description}</p>
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker)
        })

        return marker
      })

      mapInstanceRef.current.markers = newMarkers
    }
  }, [events])


  const getEventColor = (type, priority) => {
    const colors = {
      pollution: priority === 'high' ? '#E74C3C' : '#FFC107',
      water_quality: '#1E5A7D',
      wildlife: '#28a745',
      emergency: '#E67E22'
    }
    return colors[type] || '#6c757d'
  }

  const getEventTypeLabel = (type) => {
    const labels = {
      pollution: 'Kirlilik',
      water_quality: 'Su Kalitesi',
      wildlife: 'Deniz Yaşamı',
      emergency: 'Acil Durum'
    }
    return labels[type] || type
  }

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Aktif',
      completed: 'Tamamlandı',
      pending: 'Beklemede'
    }
    return labels[status] || status
  }


  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}

export default GoogleMap
