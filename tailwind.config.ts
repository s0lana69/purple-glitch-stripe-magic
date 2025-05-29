import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        dark: 'hsl(var(--background))',
        darkAccent: 'hsl(var(--card))',
        darkLight: 'hsl(var(--secondary))',

        neonTeal: {
          DEFAULT: "hsl(var(--primary))",
          500: "hsl(var(--primary))",
          400: "hsl(var(--primary) / 0.8)",
          300: "hsl(var(--primary) / 0.6)",
        },
        neonBlue: {
          DEFAULT: 'hsl(var(--gradient-blue))',
          500: 'hsl(var(--gradient-blue))',
          400: 'hsl(var(--gradient-blue) / 0.8)',
          300: 'hsl(var(--gradient-blue) / 0.6)',
        },
        neonMagenta: { // Used for violet end of gradient
          DEFAULT: 'hsl(var(--gradient-violet))',
          500: 'hsl(var(--gradient-violet))',
          400: 'hsl(var(--gradient-violet) / 0.8)',
          300: 'hsl(var(--gradient-violet) / 0.6)',
        },
        neonGreen: {
          DEFAULT: 'hsl(145, 100%, 45%)',
          500: 'hsl(145, 100%, 45%)',
          400: 'hsl(145, 100%, 45% / 0.8)',
          300: 'hsl(145, 100%, 45% / 0.6)',
        },
        success: {
          DEFAULT: 'hsl(145, 63%, 42%)',
          500: 'hsl(145, 63%, 42%)',
          400: 'hsl(145, 63%, 42% / 0.8)',
        },
        warning: {
          DEFAULT: 'hsl(39, 92%, 50%)',
          500: 'hsl(39, 92%, 50%)',
          400: 'hsl(39, 92%, 50% / 0.8)',
        },
        error: {
          DEFAULT: "hsl(var(--destructive))",
          500: "hsl(var(--destructive))",
          400: "hsl(var(--destructive) / 0.8)",
        },
        gray: {
          100: 'hsl(210, 20%, 95%)',
          200: 'hsl(210, 20%, 85%)',
          300: 'hsl(210, 17%, 75%)',
          400: 'hsl(210, 15%, 65%)',
          500: 'hsl(210, 14%, 55%)',
          600: 'hsl(210, 12%, 45%)',
          700: 'hsl(210, 10%, 35%)',
          800: 'hsl(210, 10%, 25%)',
          900: 'hsl(210, 10%, 15%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px hsl(var(--primary) / 0.4)',
        'glow-blue': '0 0 15px hsl(var(--gradient-blue) / 0.4)',
        'glow-magenta': '0 0 15px hsl(var(--gradient-violet) / 0.4)',
        'glow-green': '0 0 15px hsl(145, 100%, 45% / 0.4)',
        'glow-dark-blue': '0 0 15px hsl(var(--dark-blue-glow) / 0.7)', // Added dark blue glow
      },
      backgroundImage: {
        'cyberpunk-hero': "url('/images/cyberpunk-hero.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
