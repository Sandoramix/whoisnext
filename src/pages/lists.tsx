import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import LayerOver from "../components/layerOver";
import CreateList from "../components/listsPage/CreateList";
import ListDetails from "../components/listsPage/ListDetails";

import { useLists } from '../lib/ListsContext';
import { List } from '../types';



export default function ListsPage() {

	const { lists } = useLists();
	const [createListPanelOpened, setCreateListPanelOpened] = useState(false)

	const [selectedList, setSelectedList] = useState<List | null>(null)
	const closeListDetails = () => {

		setSelectedList(null)
	}

	function openList(list: List) {
		setSelectedList(list)

	}


	return (
		<div className="flex flex-col items-center w-full h-full">
			<div className="pt-4" />

			<div className="flex flex-col items-center justify-start w-full overflow-auto max-h-main h-full ">
				<nav className='flex w-full justify-center px-2 pb-4 py-1 sticky top-0 left-0 z-10 bg-main h-24'>
					<div className="pt-4" />
					<button
						className="text-xl font-flat px-6 py-2 bg-[#002569] hover:bg-[#002b71]  rounded w-full min-w-[300px] max-w-[400px] h-[calc(100vw_*_.05_+_40px)] max-h-[90px] whitespace-nowrap"
						onClick={() => setCreateListPanelOpened(true)}>
						Add List
					</button>
				</nav>
				<ul className="flex flex-col w-[95%] min-w-[310px] max-w-[950px] gap-8 py-6 list-none">
					{[...lists.values()].map((list, index) => <List openThisList={() => openList(list)} list={list} key={index} />)}
				</ul>

			</div>


			{
				createListPanelOpened
				&&
				<LayerOver closeView={() => setCreateListPanelOpened(false)} >
					<CreateList closeView={() => setCreateListPanelOpened(false)} />
				</LayerOver>
			}

			{
				selectedList &&
				<LayerOver closeView={closeListDetails}>
					<ListDetails
						selectedList={selectedList}
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
		<li className="relative  bg-gradient-to-r from-[#0b0031] to-blue-900  overflow-visible rounded select-none">
			<h2 className="absolute font-serif text-2xl  font-bold -translate-x-1/2 -top-4 left-1/2 whitespace-nowrap">{list.title}</h2>
			<div className="w-full grid justify-between h-[calc(100vw_*_.05_+_80px)] max-h-[120px] grid-flow-row grid-cols-3 auto-cols-min items-center  px-4 text-center font-medium font-sans">
				<div className="text-base sm:text-xl lg:text-2xl  text-gray-200 transition-[font-size] duration-200 items-start flex">{list.people.length} <br />People</div>
				<div className="text-base sm:text-xl lg:text-2xl  text-emerald-300 transition-[font-size] duration-200">{list.people.filter(p => p.isCompleted).length} <br />Completed</div>
				<div

					className=" flex flex-col items-end justify-center text-xl sm:text-2xl lg:text-3xl font-extrabold"
				>
					<div onClick={onEditClick} className="flex flex-col justify-center items-center px-4 py-2  text-yellow-500 cursor-pointer hover:text-yellow-300">
						<AiOutlineEdit className="text-3xl sm:text-4xl lg:text-5xl  transition-[font-size] duration-200" />
						<h3>Edit</h3>
					</div>
				</div>
			</div>

		</li>
	)
}
