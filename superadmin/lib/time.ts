export function formatRelativeTime(dateInput: Date | string | null): string {
  if (!dateInput) return 'No activity yet'

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (isNaN(diffInSeconds) || diffInSeconds < 0) return 'Just now'
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60)
    return `${mins}m ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  }
  if (diffInSeconds < 172800) {
    return 'Yesterday'
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
