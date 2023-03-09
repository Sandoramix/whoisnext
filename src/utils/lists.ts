import { listValidator, type List } from "../types";

export const maxTitleLength = 25;
export const maxListItemsCount = 200;

export function getListItemsFromList(list: List, onlyIncomplete = true) {
	return !onlyIncomplete ? list.items : list.items.filter(listItem => !listItem.isCompleted)
}

export function getListItemsCount(list: List, onlyIncomplete = true) {
	return !onlyIncomplete ? list.items.length : list.items.filter(listItem => !listItem.isCompleted).length;
}


export function getListsFromLS() {
	const allLSKeys = Object.keys(localStorage).filter(k => k.startsWith('list-'))

	const finalLists: Map<string, List> = new Map<string, List>([])
	allLSKeys.forEach(key => {
		try {
			const listString = localStorage.getItem(key)
			if (!listString) throw 'LS key not exists'
			const list = JSON.parse(listString)
			const parse = listValidator.safeParse(list)
			if (!parse.success) throw 'List is not valid'

			finalLists.set(list.id, list as List)

		} catch (error) {

		}

	})
	return finalLists
}

export function updateLSList(list?: List) {
	if (!list) return;
	localStorage.setItem(`list-${list.id}`, JSON.stringify(list))
}
export function deleteLSList(list: List | string) {
	localStorage.removeItem(`list-${typeof list == "string" ? list : list.id}`)
}
