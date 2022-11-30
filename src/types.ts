import { z } from "zod"

export const personValidator = z.object({
	id: z.number(),
	name: z.string(),
	isCompleted: z.boolean(),
})

export const listValidator = z.object({
	id: z.string().uuid(),
	title: z.string(),
	peopleIndex: z.number(),
	people: z.array(personValidator)
})

export const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

export const dayValidator = z.enum(weekDays)

export type Day = z.infer<typeof dayValidator>
export type List = z.infer<typeof listValidator>
export type Person = z.infer<typeof personValidator>