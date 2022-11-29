import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { List } from "../types";
import { deleteLSList, getListsFromLS, updateLSList } from '../utils/lists';


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
}

export const ListsContext = createContext<ListsContextProps>({
	lists: new Map(),
	setListTitle: () => null,
	addList: () => null,
	deleteList: () => null,
	addPersonToList: () => null,
	deletePersonFromList: () => null,
	togglePersonState: () => null,
})

export const useLists = () => useContext(ListsContext);


export const ListsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
	const [lists, setLists] = useState<Map<string, List>>(new Map())



	useEffect(() => {
		setLists(getListsFromLS())
	}, [])




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
			list.people = list.people.filter(person => personId !== person.id);
			list.peopleIndex--;

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
		<ListsContext.Provider value={{ lists, setListTitle, addList, addPersonToList, deleteList, deletePersonFromList, togglePersonState, }}>{children}</ListsContext.Provider>
	)
}