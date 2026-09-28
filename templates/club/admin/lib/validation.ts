import { z } from 'zod'

const emptyToNull = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? null : v

export const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Use a 6-digit hex color like #E10600')

const isoDate = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Enter a valid date')
  .transform((v) => new Date(v))

const safeUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .max(500)
    .refine((v) => {
      try {
        const u = new URL(v)
        return u.protocol === 'http:' || u.protocol === 'https:'
      } catch {
        return v.startsWith('/') && !v.startsWith('//')
      }
    }, 'Use an http(s) link or a site-relative path')
    .nullable()
)

const optionalText = (max: number) =>
  z.preprocess(emptyToNull, z.string().trim().max(max).nullable()).optional()

export const eventCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: optionalText(5000),
  eventDate: isoDate,
  status: z.enum(['upcoming', 'past']).optional(),
  imageUrl: safeUrl.optional(),
})
export const eventUpdateSchema = eventCreateSchema.partial()

export const achievementCreateSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: optionalText(5000),
  achievementDate: isoDate,
  imageUrl: safeUrl.optional(),
})
export const achievementUpdateSchema = achievementCreateSchema.partial()

export const organizationUpdateSchema = z.object({
  description: optionalText(5000),
  contactEmail: z.preprocess(
    emptyToNull,
    z.string().trim().email().max(200).nullable()
  ).optional(),
  showFacultyContact: z.boolean().optional(),
  facultyContactEmail: z.preprocess(
    emptyToNull,
    z.string().trim().email().max(200).nullable()
  ).optional(),
  primaryColor: hexColor.optional(),
  secondaryColor: hexColor.optional(),
})
