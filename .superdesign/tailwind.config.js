module.exports = {
  content: [
    './resources/js/**/*.js',
    './resources/js/**/*.jsx',
    './resources/js/**/*.ts',
    './resources/js/**/*.tsx',
    './resources/js/**/*.vue',
    './resources/views/**/*.blade.php',
    './resources/views/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // Bali Tropical Luxury Theme Colors
        'ocean-blue': {
          DEFAULT: '#0c4a6e',
          light: '#075985',
          dark: '#083344',
        },
        'sunset-gold': {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        'jungle-green': {
          DEFAULT: '#059669',
          light: '#10b981',
          dark: '#047857',
        },
        'sand': {
          DEFAULT: '#fef3c7',
          light: '#fef9c3',
          dark: '#fde68a',
        },
        'coral': {
          DEFAULT: '#f43f5e',
          light: '#fb7185',
          dark: '#e11d48',
        },
      },
      fontFamily: {
        'sans': ['Figtree', 'Inter', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}