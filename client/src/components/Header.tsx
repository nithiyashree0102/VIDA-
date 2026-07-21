import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'vida-theme'

export function Header() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

    return savedTheme
      ? savedTheme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  const nextThemeLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex min-h-20 max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <div>
          <p className="font-display text-3xl font-semibold leading-none tracking-tight text-[var(--color-text)]">
            VIDA
          </p>
          <p className="mt-1 text-xs font-medium tracking-wide text-[var(--color-muted)] sm:text-sm">
            Connect your thoughts. Understand your journey.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDark((currentTheme) => !currentTheme)}
          className="inline-flex size-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-soft)] transition-colors duration-200 hover:border-[var(--color-secondary)] hover:text-[var(--color-primary)]"
          aria-label={nextThemeLabel}
          title={nextThemeLabel}
        >
          {isDark ? <Sun size={18} strokeWidth={1.8} /> : <Moon size={18} strokeWidth={1.8} />}
        </button>
      </div>
    </header>
  )
}
