import type { Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ListItem, Person } from "../types";
import { getListsFromLS } from '../utils/localStorage';


export const DB = {
	lists: `lists`
}

export type ListsContextProps = {
	lists: ListItem[],
	setLists: Dispatch<SetStateAction<ListItem[]>>,
}

export const ListsContext = createContext<ListsContextProps>({
	lists: [],
	setLists: () => null,
})

export const useLists = () => useContext(ListsContext);


export const ListsProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
	const [lists, setLists] = useState<ListItem[]>([])

	useEffect(() => {
		setLists(getListsFromLS())
	}, [])

	const update_LS_Timeout = useRef<NodeJS.Timeout>()
	useEffect(() => {
		clearTimeout(update_LS_Timeout.current)
		update_LS_Timeout.current = setTimeout(() => localStorage.setItem(DB.lists, JSON.stringify(lists)), 500)
	}, [lists])






	return (
		<ListsContext.Provider value={{ lists, setLists }}>{children}</ListsContext.Provider>
	)
}