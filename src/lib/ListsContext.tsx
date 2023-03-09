import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { List } from "../types";
import { deleteLSList, getListsFromLS, updateLSList } from '../utils/lists';


export type ListsContextProps = {
	lists: Map<string, List>,
	setListTitle: (listId: string, title: string) => void,
	addList: (title: string, peopleNames: string[]) => void,
	deleteList: (listId: string) => void,
	addListItemToList: (listId: string, listItemName: string, isCompleted?: boolean) => void,
	deleteListItemFromList: (listId: string, listItemId: number) => void,
	toggleListItemState: (listId: string, listItemId: number) => void,
}

export const ListsContext = createContext<ListsContextProps>({
	lists: new Map(),
	setListTitle: () => null,
	addList: () => null,
	deleteList: () => null,
	addListItemToList: () => null,
	deleteListItemFromList: () => null,
	toggleListItemState: () => null,
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
			items: [],
			autoIncrement: -1
		}

		peopleNames.forEach(name => {
			newList.autoIncrement++
			newList.items.push({ id: newList.autoIncrement, name, isCompleted: false })
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

	function addListItemToList(listId: string, listItemName: string, isCompleted = false) {
		setLists(_prev => {
			const prev = new Map([..._prev])

			const list = prev.get(listId);
			if (!list) return prev;
			list.autoIncrement++;
			list.items.push({ id: list.autoIncrement, name: listItemName, isCompleted })
			updateLSList(list);
			prev.set(listId, list)
			return prev

		})
	}

	function deleteListItemFromList(listId: string, listItemId: number) {
		setLists(_prev => {
			const prev = new Map([..._prev])

			const list = prev.get(listId);
			if (!list) return prev;
			list.items = list.items.filter(listItem => listItemId !== listItem.id);
			list.autoIncrement--;

			updateLSList(list);
			prev.set(listId, list)
			return prev

		})
	}

	function toggleListItemState(listId: string, listItemId: number) {
		setLists(_prev => {
			const prev = new Map([..._prev])

			const list = prev.get(listId);
			if (!list) return prev;
			list.items = list.items.map(p => {
				if (p.id !== listItemId) return p;
				p.isCompleted = !p.isCompleted;
				return p;
			})
			updateLSList(list);
			prev.set(listId, list)
			return prev
		})
	}




	return (
		<ListsContext.Provider value={{ lists, setListTitle, addList, addListItemToList, deleteList, deleteListItemFromList, toggleListItemState, }}>{children}</ListsContext.Provider>
	)
}