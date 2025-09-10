// Accessibility utilities

export const trapFocus = (element) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus()
          e.preventDefault()
        }
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)
  return () => element.removeEventListener('keydown', handleTabKey)
}

export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export const getContrastRatio = (color1, color2) => {
  const getLuminance = (color) => {
    const rgb = color.match(/\d+/g)
    if (!rgb) return 0
    
    const [r, g, b] = rgb.map(c => {
      c = parseInt(c) / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

export const isHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches
}

export const isReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const addKeyboardNavigation = (element, options = {}) => {
  const { onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight } = options
  
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        onEnter && onEnter(e)
        break
      case 'Escape':
        onEscape && onEscape(e)
        break
      case 'ArrowUp':
        onArrowUp && onArrowUp(e)
        break
      case 'ArrowDown':
        onArrowDown && onArrowDown(e)
        break
      case 'ArrowLeft':
        onArrowLeft && onArrowLeft(e)
        break
      case 'ArrowRight':
        onArrowRight && onArrowRight(e)
        break
    }
  }
  
  element.addEventListener('keydown', handleKeyDown)
  return () => element.removeEventListener('keydown', handleKeyDown)
}

export const generateId = (prefix = 'id') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

export const createAriaLabel = (element, label) => {
  const id = generateId('aria-label')
  element.setAttribute('aria-labelledby', id)
  
  const labelElement = document.createElement('span')
  labelElement.id = id
  labelElement.className = 'sr-only'
  labelElement.textContent = label
  
  element.parentNode.insertBefore(labelElement, element)
  return labelElement
}
