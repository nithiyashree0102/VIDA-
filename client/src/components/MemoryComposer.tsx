import { type FormEvent, useRef, useState } from 'react'

const MAX_CHARACTERS = 1000

type MemoryComposerProps = {
  onCapture?: (memory: string) => Promise<void> | void
}

export function MemoryComposer({ onCapture }: MemoryComposerProps) {
  const [memory, setMemory] = useState('')
  const [isCapturing, setIsCapturing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const resizeTextarea = () => {
    const textarea = textareaRef.current

    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  const handleChange = (value: string) => {
    setMemory(value)
    requestAnimationFrame(resizeTextarea)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedMemory = memory.trim()
    if (!trimmedMemory || isCapturing) return

    setIsCapturing(true)

    try {
      await onCapture?.(trimmedMemory)
      setMemory('')

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } finally {
      setIsCapturing(false)
    }
  }

  const isEmpty = !memory.trim()

  return (
    <section className="w-full" aria-labelledby="composer-heading">
      <div className="mb-5">
        <h1
          id="composer-heading"
          className="font-display text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-5xl"
        >
          A place to begin.
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)] sm:text-base">
          Keep a thought close. VIDA will help you see where it leads.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-200 focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_3px_rgb(199_217_183_/_0.55)] sm:p-6"
      >
        <textarea
          ref={textareaRef}
          value={memory}
          onChange={(event) => handleChange(event.target.value)}
          rows={7}
          maxLength={MAX_CHARACTERS}
          placeholder="Tell me something you'd like me to remember..."
          className="min-h-44 w-full resize-none border-0 bg-transparent p-0 text-base leading-7 text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
          aria-describedby="memory-character-count"
        />

        <div className="mt-5 flex flex-col gap-4 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p id="memory-character-count" className="text-sm tabular-nums text-[var(--color-muted)]">
            {memory.length} / {MAX_CHARACTERS}
          </p>

          <button
            type="submit"
            disabled={isEmpty || isCapturing}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-white shadow-sm transition-[background-color,box-shadow,transform] duration-200 hover:bg-[var(--color-secondary)] hover:shadow-[0_8px_20px_rgb(78_122_82_/_0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-[var(--color-primary)] disabled:hover:shadow-sm"
          >
            {isCapturing ? 'Capturing…' : 'Capture Thought'}
          </button>
        </div>
      </form>
    </section>
  )
}
