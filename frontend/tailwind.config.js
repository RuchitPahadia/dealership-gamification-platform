/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#2563EB',
        'brand-primary-dark': '#1E40AF',
        'xp-gold': '#F59E0B',
        'xp-gold-glow': '#FCD34D',
        'relay-teal': '#14B8A6',
        'cap-red': '#EF4444',
        'success-green': '#22C55E',
        'bg-canvas': '#0F172A',
        'bg-surface': '#F8FAFC',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        numeric: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
