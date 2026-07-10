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
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
