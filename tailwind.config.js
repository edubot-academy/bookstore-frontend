export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        edubot: {
          dark: '#122144',
          orange: '#f17e22',
          green: '#0ea78b',
          soft: '#f39647',
          teal: '#1e605e',
          ink: '#0f172a',
          surface: '#fffaf5',
          surfaceAlt: '#f8fafc',
          line: '#e2e8f0',
          muted: '#64748b',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        neutral: 'rgb(var(--color-neutral) / <alpha-value>)',
        dark: 'rgb(var(--color-dark) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        text: {
          main: 'rgb(var(--color-text-main) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
      },
      boxShadow: {
        'edubot-card': '0 18px 45px -26px rgba(18, 33, 68, 0.32)',
        'edubot-soft': '0 14px 32px -24px rgba(241, 126, 34, 0.35)',
        'edubot-glow': '0 0 0 1px rgba(241, 126, 34, 0.08), 0 24px 48px -28px rgba(241, 126, 34, 0.45)',
        'edubot-hover': '0 28px 64px -30px rgba(18, 33, 68, 0.42)',
        'edubot-hover-soft': '0 24px 56px -32px rgba(241, 126, 34, 0.45), 0 10px 24px -18px rgba(18, 33, 68, 0.22)',
      },
      borderRadius: {
        panel: '1.75rem',
      },
      backgroundImage: {
        'edubot-hero': 'linear-gradient(135deg, rgba(18,33,68,1) 0%, rgba(30,96,94,0.96) 55%, rgba(241,126,34,0.88) 100%)',
        'edubot-surface': 'radial-gradient(circle at top left, rgba(241,126,34,0.14), transparent 34%), radial-gradient(circle at bottom right, rgba(30,96,94,0.12), transparent 28%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '475px',
        touch: '640px',
      },
    },
  },
  plugins: [],
};
