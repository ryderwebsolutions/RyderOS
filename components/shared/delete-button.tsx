'use client'

export function DeleteButton({ label, confirm: message }: { label: string; confirm: string }) {
  return (
    <button
      type="submit"
      className="text-sm text-destructive hover:underline"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
    >
      {label}
    </button>
  )
}
