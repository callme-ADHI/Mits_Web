function requireEnv(name: string, minLength = 1): string {
  const value = process.env[name]
  if (!value || value.trim().length < minLength) {
    throw new Error(
      `Missing or invalid environment variable ${name}. Check this project's .env file.`
    )
  }
  return value
}

export const ORG_ID = requireEnv('ORGANIZATION_ID')
export const JWT_SECRET = requireEnv('JWT_SECRET', 32)
