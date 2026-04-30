/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors:{
        primary: {
          DEFAULT: '#0f766e',
          light: '#14b8a6',
          dark: '#0d5c56',
          muted: '#ccfbf1',
        },
        ink: '#0f172a',
        muted: '#64748b',
        surface: '#f1f5f9',
        card: '#ffffff',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)',
        'nav': '0 1px 0 rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
}