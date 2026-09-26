const ACTION_LABELS: Record<string, string> = {
  'event.created': 'posted event',
  'event.updated': 'updated event',
  'event.deleted': 'deleted event',
  'achievement.created': 'posted achievement',
  'achievement.updated': 'updated achievement',
  'achievement.deleted': 'deleted achievement',
  'organization.updated': 'updated organization info',
}

export function describeAction(action: string, details: string | null) {
  const label = ACTION_LABELS[action] ?? action
  return details ? `${label}: ${details}` : label
}
