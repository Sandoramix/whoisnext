import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { List } from "../types";
import { getListsFromLS } from '../utils/localStorage';


export const DB = {
	lists: `lists`
}

export type ListsContextProps = {
	lists: List[],
	setLists: Dispatch<SetStateAction<List[]>>,
	setListTitle: (listId: string, title: string) => void,
	addList: (title: string, peopleNames: string[]) => void,
	deleteList: (listId: string) => void,
	addPersonToList: (listId: string, personName: string, isCompleted?: boolean) => void,
	deletePersonFromList: (listId: string, personId: number) => void,
	togglePersonState: (listId: string, personId: number) => void
}

export const ListsContext = createContext<ListsContextProps>({
	lists: [],
	setLists: () => null,
	setListTitle: () => null,
	addList: () => null,
	deleteList: () => null,
	addPersonToList: () => null,
	deletePersonFromList: () => null,
	togglePersonState: () => null,
})

export const useLists = () => useContext(ListsContext);


export const ListsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
	const [lists, setLists] = useState<List[]>([])

	useEffect(() => {
		setLists(getListsFromLS())
	}, [])

	const update_LS_Timeout = useRef<NodeJS.Timeout>()
	useEffect(() => {
		clearTimeout(update_LS_Timeout.current)
		update_LS_Timeout.current = setTimeout(() => localStorage.setItem(DB.lists, JSON.stringify(lists)), 500)
	}, [lists])




	const setListTitle = (listId: string, title: string) => {
		setLists(prev => prev.map(list => {
			if (list.id !== listId) return list;
			list.title = title;
			return list;

		}))
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
		setLists(prev => [...prev, newList])
	}

	function deleteList(listId: string) {
		setLists(prev => prev.filter(list => list.id !== listId))
	}

	function addPersonToList(listId: string, personName: string, isCompleted = false) {
		setLists(prev => prev.map(list => {
			if (list.id !== listId) return list;
			list.peopleIndex++;
			list.people.push({ id: list.peopleIndex, name: personName, isCompleted })
			return list;
		}))
	}

	function deletePersonFromList(listId: string, personId: number) {
		setLists(prev => prev.map(list => {
			if (list.id !== listId) return list;
			list.people = list.people.filter(person => personId !== person.id)
			return list;
		}))
	}

	function togglePersonState(listId: string, personId: number) {
		setLists(prev => prev.map(list => {
			if (list.id !== listId) return list;
			list.people = list.people.map(p => {
				if (p.id !== personId) return p;
				p.isCompleted = !p.isCompleted;
				return p;
			})
			return list;
		}))
	}




	return (
		<ListsContext.Provider value={{ lists, setLists, setListTitle, addList, addPersonToList, deleteList, deletePersonFromList, togglePersonState }}>{children}</ListsContext.Provider>
	)
}