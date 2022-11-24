import { useState } from "react";
import { AiOutlineEdit } from 'react-icons/ai';
import LayerOver from "../components/layerOver";
import CreateList from "../components/listsPage/CreateList";
import ListDetails from "../components/listsPage/ListDetails";

import { useLists } from '../lib/ListsContext';
import { List } from '../types';



export default function ListsPage() {

	const { lists } = useLists();
	const [openedListId, setOpenedListId] = useState<string | null>(null)
	const [createListPanelOpened, setCreateListPanelOpened] = useState(false)


	const closeListDetails = () => {
		setOpenedListId(null)
	}


	return (
		<div className="flex flex-col items-center w-full h-full">
			<div className="pt-4" />

			<section className="flex justify-center w-full">
				<button
					className="px-6 py-2 bg-[#1d3155] hover:bg-[#2c3f61]  rounded w-1/3 whitespace-nowrap"
					onClick={() => setCreateListPanelOpened(true)}>
					Add List
				</button>
			</section>

			<div className="pt-6" />

			<div className="flex flex-col items-center justify-start w-full overflow-auto max-h-main">
				<ul className="flex flex-col w-10/12 gap-8 py-6 list-none">
					{lists?.map((list, index) => <List openThisList={() => setOpenedListId(list.id)} list={list} key={index} />)}
				</ul>
			</div>

			{
				createListPanelOpened
				&& <LayerOver closeView={() => setCreateListPanelOpened(false)}>
					<CreateList closeView={() => setCreateListPanelOpened(false)} />
				</LayerOver>
			}

			{
				openedListId !== null
				&& <LayerOver closeView={closeListDetails}>
					<ListDetails
						currentListId={openedListId}
						closeView={closeListDetails}
					/>
				</LayerOver>
			}

		</div>
	)
}

const List = ({ list, openThisList }: { list: List, openThisList: () => void }) => {

	const onEditClick = () => {
		openThisList()
	}

	return (
		<li className="relative bg-[#0b0031] overflow-visible rounded select-none">
			<h2 className="absolute font-serif text-xl font-bold -translate-x-1/2 -top-4 left-1/2">{list.title}</h2>
			<div className="flex justify-between min-h-[100px] items-center px-4 text-center">
				<div className="text-sm text-gray-300">{list.people.length} <br />People</div>
				<div className="text-sm text-emerald-400">{list.people.filter(p => p.isCompleted).length} <br />Completed</div>
				<div
					onClick={onEditClick}
					className="flex flex-col items-center justify-center text-xl font-bold text-yellow-500 cursor-pointer hover:text-yellow-300"
				>
					<AiOutlineEdit className="text-3xl" />
					<h3>Edit</h3>
				</div>
			</div>

		</li>
	)
}
