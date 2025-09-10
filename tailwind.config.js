/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Birincil Renkler (Kurumsal Mavi)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#1E5A7D', // Ana renk
          600: '#154A63',
          700: '#0c4a6e',
          800: '#075985',
          900: '#0c4a6e',
        },
        // İkincil Renkler (Petrol Yeşili)
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#3A847C', // Ana renk
          600: '#2D6B61',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Vurgu Renkleri
        accent: {
          orange: '#E67E22',
          red: '#E74C3C',
        },
        // Durum Renkleri
        success: '#28a745',
        warning: '#FFC107',
        error: '#DC3545',
        // Nötr Renkler
        background: '#F9F9F9',
        text: {
          dark: '#333333',
          light: '#666666',
        },
        border: '#E0E0E0',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4': '4px',
        '8': '8px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
