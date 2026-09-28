const ACTION_LABELS: Record<string, string> = {
  'event.created': 'posted event',
  'event.updated': 'updated event',
  'event.deleted': 'deleted event',
  'achievement.created': 'posted achievement',
  'achievement.updated': 'updated achievement',
  'achievement.deleted': 'deleted achievement',
  'organization.updated': 'updated organization info',
  'organization.logo_updated': 'updated brand logo',
  'organization.logo_reset': 'reset brand logo to default',
  'message.deleted': 'deleted contact message',
}

export function describeAction(action: string, details: string | null) {
  const label = ACTION_LABELS[action] ?? action
  return details ? `${label}: ${details}` : label
}
