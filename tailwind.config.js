/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./public/**/*.html",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        'surface-soft': 'var(--surface-soft)',
        stroke: 'var(--stroke)',
        'stroke-strong': 'var(--stroke-strong)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-muted': 'var(--ink-muted)',
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        'accent-soft': 'var(--accent-soft)',
        'accent-contrast': 'var(--accent-contrast)',
        warning: 'var(--warning)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Playfair Display', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
      spacing: {
        'header': 'var(--header-height)',
      },
      maxWidth: {
        'content': 'var(--content-width)',
      },
      animation: {
        'scroll': 'scroll linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
