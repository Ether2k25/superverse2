import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ice-black': '#0f0f0f',
        'ice-yellow': '#FFC300',
        'ice-gold': '#FFD700',
        'ice-white': '#ffffff',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'yellow-gradient': 'linear-gradient(135deg, #FFC300 0%, #FFD700 100%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spotlight': 'spotlight 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #FFC300, 0 0 10px #FFC300, 0 0 15px #FFC300' },
          '100%': { boxShadow: '0 0 10px #FFC300, 0 0 20px #FFC300, 0 0 30px #FFC300' },
        },
        spotlight: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
export default config
