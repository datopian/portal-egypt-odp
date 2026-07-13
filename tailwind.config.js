/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Egypt Open Data Portal palette — Egyptian flag red/white/black + a soft
      // gold accent. Deep pomegranate red as primary reads government-credible;
      // flag red for CTAs. Key `green` is kept (class usages) but is the gold accent.
      colors: {
        brand: {
          DEFAULT: '#9e1b32', // deep pomegranate red — primary (nav, headings)
          dark: '#6b1020', // darker red — hovers, dark sections
          green: '#c6a15b', // soft gold — accent (was green)
          red: '#ce1126', // Egyptian flag red — CTAs, highlights
        },
        // Accent scale (tints of brand red) used by the ported responsiveGrid table.
        accent: {
          DEFAULT: '#9e1b32',
          50: '#faf4f5',
          100: '#f5e8ea',
        },
        // Warm sand/beige — hero and light section backgrounds (Egyptian desert tone).
        sand: {
          50: '#f7f3ec',
          100: '#f0ebe0',
          200: '#e7ddcc',
          300: '#ddd0b9',
        },
        // Near-black ink — top utility strip, footer, and high-contrast dark panels.
        ink: {
          DEFAULT: '#1c1c1c',
          light: '#2c2c2c',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
