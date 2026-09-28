import { CliError } from './errors'

export async function askUntilValid(
  ask: (prompt: string) => Promise<string | null>,
  label: string,
  validate: (value: string) => string | null,
  tries = 3,
): Promise<string> {
  for (let i = 0; i < tries; i++) {
    const raw = await ask(label)
    if (raw === null) throw new CliError('Input ended before all answers were given.')
    const value = raw.trim()
    const problem = validate(value)
    if (!problem) return value
    console.log(`  ${problem}`)
  }
  throw new CliError(`Too many invalid answers for: ${label.trim()}`)
}
