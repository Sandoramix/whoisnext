import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { List } from "../types";
import { listValidator } from "../types";


export const DB = {
	lists: `lists`
}

export type ListsContextProps = {
	lists: Map<string, List>,
	setListTitle: (listId: string, title: string) => void,
	addList: (title: string, peopleNames: string[]) => void,
	deleteList: (listId: string) => void,
	addPersonToList: (listId: string, personName: string, isCompleted?: boolean) => void,
	deletePersonFromList: (listId: string, personId: number) => void,
	togglePersonState: (listId: string, personId: number) => void,
	selectedList: List | null,
	setSelectedList: (list: List | null) => void,
	selectedDetailsListId: string,
	setSelectedDetailsListId: (list: string) => void
}

export const ListsContext = createContext<ListsContextProps>({
	lists: new Map(),
	setListTitle: () => null,
	addList: () => null,
	deleteList: () => null,
	addPersonToList: () => null,
	deletePersonFromList: () => null,
	togglePersonState: () => null,
	selectedList: null,
	setSelectedList: () => null,
	selectedDetailsListId: "",
	setSelectedDetailsListId: () => null
})

export const useLists = () => useContext(ListsContext);


export const ListsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
	const [lists, setLists] = useState<Map<string, List>>(new Map())

	const [selectedDetailsListId, setSelectedDetailsListId] = useState<string>("")
	const [selectedList, setSelectedList] = useState<List | null>(null)


	useEffect(() => {
		setLists(getListsFromLS())
	}, [])


	const update_LS_Timeout = useRef<NodeJS.Timeout>()
	useEffect(() => {
		if (!selectedList) return
		clearTimeout(update_LS_Timeout.current)
		update_LS_Timeout.current = setTimeout(() => localStorage.setItem(`list-${selectedList?.id}`, JSON.stringify(selectedList)), 500)
	}, [selectedList])


	function getListsFromLS() {
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

	function updateLSList(list?: List) {
		if (!list) return;
		localStorage.setItem(`list-${list.id}`, JSON.stringify(list))
	}
	function deleteLSList(list: List | string) {
		localStorage.removeItem(`list-${typeof list == "string" ? list : list.id}`)
	}



	const setListTitle = (listId: string, title: string) => {
		setLists(prev => {
			const list = prev.get(listId)
			if (!list) return prev;
			list.title = title;
			updateLSList(list);
			prev.set(listId, list)
			return prev;
		})

	}
	function addList(title: string, peopleNames: string[]) {
		const newList: List = {
			id: uuidv4(),
			title,
			people: [],
			peopleIndex: -1
		}

		peopleNames.forEach(name => {
			newList.peopleIndex++
			newList.people.push({ id: newList.peopleIndex, name, isCompleted: false })
		})
		updateLSList(newList);
		setLists(prev => new Map([...prev, [newList.id, newList]]))
	}

	function deleteList(listId: string) {

		setLists(_prev => {
			const prev = new Map([..._prev])
			prev.delete(listId)
			deleteLSList(listId)
			return prev
		})

	}

	function addPersonToList(listId: string, personName: string, isCompleted = false) {
		setLists(_prev => {
			const prev = new Map([..._prev])

			const list = prev.get(listId);
			if (!list) return prev;
			list.peopleIndex++;
			list.people.push({ id: list.peopleIndex, name: personName, isCompleted })
			updateLSList(list);
			prev.set(listId, list)
			return prev

		})
	}

	function deletePersonFromList(listId: string, personId: number) {
		setLists(_prev => {
			const prev = new Map([..._prev])

			const list = prev.get(listId);
			if (!list) return prev;
			list.people = list.people.filter(person => personId !== person.id)
			updateLSList(list);
			prev.set(listId, list)
			return prev

		})
	}

	function togglePersonState(listId: string, personId: number) {
		setLists(_prev => {
			const prev = new Map([..._prev])

			const list = prev.get(listId);
			if (!list) return prev;
			list.people = list.people.map(p => {
				if (p.id !== personId) return p;
				p.isCompleted = !p.isCompleted;
				return p;
			})
			updateLSList(list);
			prev.set(listId, list)
			return prev
		})
	}




	return (
		<ListsContext.Provider value={{ lists, setListTitle, addList, addPersonToList, deleteList, deletePersonFromList, togglePersonState, selectedList, setSelectedList, selectedDetailsListId, setSelectedDetailsListId }}>{children}</ListsContext.Provider>
	)
}