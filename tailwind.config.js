/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        vide: '#05060B',
        galaxie: '#0B0A1A',
        profond: '#0E0B08',
        lumiere: '#ECE8DF',
        brume: '#8A8FA3',
        regulus: '#9CC9FF',
        ambre: '#FFC46B',
      },
      fontFamily: {
        display: ['"Unbounded Variable"', 'system-ui', 'sans-serif'],
        sans: ['"Inter Tight Variable"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
