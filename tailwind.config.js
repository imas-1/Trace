/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0d12',
        panel: '#12151c',
        panel2: '#181c26',
        line: 'rgba(255,255,255,0.08)',
        accent: '#3ee8b5',
        accentDim: '#1f6f57',
        warn: '#e8763e',
        text: '#e9edf3',
        sub: '#8a93a3'
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', 'Georgia', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'sans-serif']
      },
      borderRadius: {
        phone: '46px'
      }
    }
  },
  plugins: []
};
