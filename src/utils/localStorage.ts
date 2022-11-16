import { z } from "zod"
import { DB } from "../lib/ListsContext"
import type { List } from "../types"

const listsValidator = z.array(z.object({
	id: z.string().uuid(),
	title: z.string(),
	peopleIndex: z.number(),
	people: z.array(z.object({
		id: z.number(),
		name: z.string(),
		isCompleted: z.boolean(),
	}))
}))


export const getListsFromLS = (): List[] => {
	const parsed = JSON.parse(localStorage.getItem(DB.lists) ?? '[]')
	return listsValidator.safeParse(parsed).success ? parsed : []
}