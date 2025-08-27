/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gpt5-beam': 'gpt5-beam 8s ease-in-out infinite',
      },
      colors: {
        'gpt5': {
          'amber-start': '#f59e0b',
          'orange': '#f97316', 
          'pink': '#ec4899',
          'purple': '#8b5cf6',
          'purple-end': '#a855f7',
          'zinc-900': '#18181b',
          'zinc-800': '#27272a',
          'zinc-700': '#3f3f46',
          'black': '#000000',
          'slate-950': '#020617',
          'slate-900': '#0f172a',
        }
      },
      backgroundImage: {
        'gpt5-beam-gradient': 'linear-gradient(135deg, #f59e0b 0%, #f97316 25%, #ec4899 50%, #8b5cf6 75%, #a855f7 100%)',
        'gpt5-beam-radial': 'radial-gradient(circle at center, #f59e0b 0%, #f97316 30%, #ec4899 60%, #8b5cf6 100%)',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};