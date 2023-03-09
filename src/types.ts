import { z } from "zod"

export const itemsValidator = z.object({
	id: z.number(),
	name: z.string(),
	isCompleted: z.boolean(),
})

export const listValidator = z.object({
	id: z.string().uuid(),
	title: z.string(),
	autoIncrement: z.number(),
	items: z.array(itemsValidator)
})

export const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

export const dayValidator = z.enum(weekDays)

export type Day = z.infer<typeof dayValidator>
export type List = z.infer<typeof listValidator>
export type ListItem = z.infer<typeof itemsValidator>