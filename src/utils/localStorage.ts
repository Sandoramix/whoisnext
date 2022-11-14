import { z } from "zod"
import { LS_NAMES } from "../pages/lists"
import type { ListItem } from "../types"

const listsValidator = z.array(z.object({
	title: z.string(),
	people: z.array(z.object({
		name: z.string(),
		isCompleted: z.boolean(),
	}))
}))


export const getListsFromLS = (): ListItem[] => {
	const parsed = JSON.parse(localStorage.getItem(LS_NAMES.lists) ?? '[]')
	return listsValidator.safeParse(parsed).success ? parsed : []
}