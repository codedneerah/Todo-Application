module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand colors (blue)
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
        // Success colors (green)
        success: {
          50: '#f0fdf4',
          600: '#16a34a',
          700: '#15803d',
        },
        // Warning colors (amber)
        warning: {
          50: '#fffbeb',
          600: '#d97706',
        },
        // Danger colors (red)
        danger: {
          50: '#fef2f2',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.sr-only': {
          'position': 'absolute',
          'width': '1px',
          'height': '1px',
          'padding': '0',
          'margin': '-1px',
          'overflow': 'hidden',
          'clip': 'rect(0, 0, 0, 0)',
          'white-space': 'nowrap',
          'border-width': '0',
        },
        '.skip-link': {
          'position': 'absolute',
          'top': '-40px',
          'left': '0',
          'background': '#000',
          'color': '#fff',
          'padding': '8px',
          'text-decoration': 'none',
          'z-index': '100',
          '&:focus': { 'top': '0' },
        },
      });
    },
  ],
}
