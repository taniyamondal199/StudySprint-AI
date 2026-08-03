/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          dark: '#5850EC',
          light: '#EEF2FF',
        },
        secondary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#EFF6FF',
        },
        accent: {
          DEFAULT: '#FFD700',
          dark: '#E6C200',
          light: '#FFFBE6',
        },
        darkBg: {
          DEFAULT: '#0F172A',
          card: '#1E293B',
          border: '#334155',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(108, 99, 255, 0.08)',
        'glass-hover': '0 8px 32px 0 rgba(108, 99, 255, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
}
