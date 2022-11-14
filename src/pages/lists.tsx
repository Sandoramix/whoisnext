import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineEdit } from 'react-icons/ai';
import CreateList from "../components/CreateList";
import LayerOver from "../components/layerOver";
import ListDetails from "../components/ListDetails";

import { ListItem } from '../types';
import { getListsFromLS } from '../utils/localStorage';

export const LS_NAMES = {
	lists: `allLists`
}


export default function ListsPage() {

	const [lists, setLists] = useState<ListItem[]>([])
	const [openedListIndex, setOpenedListIndex] = useState<number | null>(null)
	const [createListPanelOpened, setCreateListPanelOpened] = useState(false)


	const update_LS_Timeout = useRef<NodeJS.Timeout>()
	useEffect(() => {
		clearTimeout(update_LS_Timeout.current)
		update_LS_Timeout.current = setTimeout(() => localStorage.setItem(LS_NAMES.lists, JSON.stringify(lists)), 1000)
	}, [lists])


	useEffect(() => {
		setLists(getListsFromLS())
	}, [])

	const closeListDetails = () => {
		setOpenedListIndex(null)
	}










	return (
		<div className="w-full h-full items-center flex flex-col">
			<div className="pt-4" />

			<section className="w-full flex justify-center">
				<button
					className="px-6 py-2 bg-[#1f2e47] hover:bg-[#2c3f61]  rounded w-1/3 whitespace-nowrap"
					onClick={() => setCreateListPanelOpened(true)}
				>Add List</button>
			</section>

			<div className="pt-6" />

			<div className="max-h-[calc(100vh_-_90px_-_2.5rem)] overflow-auto w-full flex flex-col justify-center items-center">
				<ul className="list-none w-10/12 py-6 flex flex-col gap-8">
					{lists?.map((list, index) => <ListItem setOpenedListIndex={setOpenedListIndex} index={index} list={list} key={index} />)}
				</ul>
			</div>

			{
				createListPanelOpened ? <LayerOver closeView={() => setCreateListPanelOpened(false)}>
					<CreateList closeView={() => setCreateListPanelOpened(false)} setLists={setLists} />
				</LayerOver>
					: openedListIndex !== null && <LayerOver closeView={closeListDetails}>
						<ListDetails
							lists={lists} setLists={setLists} currentListIndex={openedListIndex}
							closeView={closeListDetails}
						/>
					</LayerOver>
			}

		</div>
	)
}

const ListItem = ({ list, setOpenedListIndex, index }: { list: ListItem, index: number, setOpenedListIndex: Dispatch<SetStateAction<number | null>> }) => {

	const onEditClick = () => {
		setOpenedListIndex(index)
	}

	return (
		<li className="relative bg-[#000d22] overflow-visible rounded select-none">
			<h2 className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl font-serif font-bold">{list.title}</h2>
			<div className="flex justify-between min-h-[100px] items-center px-4 text-center">
				<div className="text-gray-300 text-sm">{list.people.length} <br />People</div>
				<div className="text-emerald-400 text-sm">{list.people.filter(p => p.isCompleted).length} <br />Completed</div>
				<div
					onClick={onEditClick}
					className="text-xl font-bold flex flex-col justify-center items-center text-yellow-500 cursor-pointer hover:text-yellow-300"
				>
					<AiOutlineEdit className="text-3xl" />
					<h3>Edit</h3>
				</div>
			</div>

		</li>
	)
}
