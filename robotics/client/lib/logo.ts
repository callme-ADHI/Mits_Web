export function getLogoSrc(org?: { logoUpdatedAt?: Date | string | null; logoUrl?: string | null } | null): string {
  if (org?.logoUpdatedAt) {
    const epoch = new Date(org.logoUpdatedAt).getTime()
    return `/logo?v=${epoch}`
  }
  if (org?.logoUrl) {
    return org.logoUrl
  }
  return '/default-logo.svg'
}
