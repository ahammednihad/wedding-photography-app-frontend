/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        admin: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        client: {
          50: '#fdf2f8', // Pastel pink tint
          100: '#fce7f3',
          200: '#fbcfe8',
          500: '#ec4899', // Pink
          600: '#db2777',
          700: '#be185d',
          accent: '#f3e8ff', // Lavender
        },
        photographer: {
          50: '#fafaf9', // Warm beige tint
          100: '#f5f5f4',
          200: '#e7e5e4',
          500: '#d4af37', // Muted Gold
          600: '#b8962e',
          700: '#9c7f27',
          accent: '#44403c', // Soft brown
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
