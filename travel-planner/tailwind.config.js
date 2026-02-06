/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Frost Winter Theme
        'deep-night': {
          DEFAULT: '#0F1729',
          50: '#3A4A6B',
          100: '#2E3D5C',
          200: '#23324D',
          300: '#18273E',
          400: '#131E33',
          500: '#0F1729',
          600: '#0A101C',
          700: '#050910',
          800: '#010203',
          900: '#000000',
        },
        'evening-slate': {
          DEFAULT: '#1E293B',
          50: '#5F7A9F',
          100: '#536E91',
          200: '#475F7F',
          300: '#3B506D',
          400: '#2C3C54',
          500: '#1E293B',
          600: '#141B28',
          700: '#0A0D15',
          800: '#000002',
          900: '#000000',
        },
        'frost-white': {
          DEFAULT: '#F8FAFC',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#FFFFFF',
          400: '#FFFFFF',
          500: '#F8FAFC',
          600: '#CBD5E1',
          700: '#94A3B8',
          800: '#64748B',
          900: '#475569',
        },
        // Semantic colors (adapted for Frost Winter)
        primary: {
          DEFAULT: '#60A5FA', // Frost Blue
          foreground: '#0F1729',
        },
        secondary: {
          DEFAULT: '#A5B4FC', // Lavender
          foreground: '#0F1729',
        },
        success: {
          DEFAULT: '#34D399', // Emerald
          foreground: '#0F1729',
        },
        warning: {
          DEFAULT: '#FBBF24', // Amber
          foreground: '#0F1729',
        },
        destructive: {
          DEFAULT: '#F87171', // Red
          foreground: '#F8FAFC',
        },
        muted: {
          DEFAULT: '#1E293B',
          foreground: '#94A3B8',
        },
        accent: {
          DEFAULT: '#2563EB', // Blue
          foreground: '#F8FAFC',
        },
        background: '#0F1729',
        foreground: '#F8FAFC',
        card: {
          DEFAULT: '#1E293B',
          foreground: '#F8FAFC',
        },
        popover: {
          DEFAULT: '#1E293B',
          foreground: '#F8FAFC',
        },
        border: '#334155',
        input: '#334155',
        ring: '#60A5FA',
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      spacing: {
        // 8px scale enforced
        1: '4px',
        2: '8px',
        4: '16px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'frost': '0 4px 6px -1px rgba(96, 165, 250, 0.1), 0 2px 4px -1px rgba(96, 165, 250, 0.06)',
        'frost-lg': '0 10px 15px -3px rgba(96, 165, 250, 0.1), 0 4px 6px -2px rgba(96, 165, 250, 0.05)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
