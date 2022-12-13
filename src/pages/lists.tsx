import { useMemo, useRef, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BiSearchAlt, BiSearchAlt2 } from 'react-icons/bi';
import LayerOver from "../components/layerOver";
import CreateList from "../components/listsPage/CreateList";
import ListDetails from "../components/listsPage/ListDetails";

import { useLists } from '../lib/ListsContext';
import { List } from '../types';


export default function ListsPage() {


	const { lists } = useLists();
	const [createListPanelOpened, setCreateListPanelOpened] = useState(false);

	const [searchedListName, setSearchedListName] = useState("");
	const filteredList = useMemo(() => [...lists.values()].filter(list => list.title.includes(searchedListName)), [lists, searchedListName]);

	const addBtnRef = useRef<HTMLButtonElement>(null);
	const searchInputCntRef = useRef<HTMLDivElement>(null);

	const [selectedList, setSelectedList] = useState<List | null>(null)
	const closeListDetails = () => {

		setSelectedList(null)
	}

	function openList(list: List) {
		setSelectedList(list)

	}

	function toggleSearchBtn() {

		if (!addBtnRef.current) return;
		const isActive = addBtnRef.current.className.includes('grow');

		addBtnRef.current.textContent = !isActive ? `Add List` : `+`
		addBtnRef.current.classList.toggle(`grow`, !isActive)
		addBtnRef.current.classList.toggle(`!text-3xl`, isActive)
		addBtnRef.current.classList.toggle(`!rounded-full`, isActive)

		if (!searchInputCntRef.current) return;
		searchInputCntRef.current.classList.toggle('!w-full', isActive)




	}


	return (
		<div className="flex flex-col items-center w-full h-full bg-gradient-to-b to-[#0f0c4c] from-[#06001a]">
			<div className="flex flex-col items-center justify-start w-full overflow-auto max-h-main h-full ">
				<nav className='flex gap-2 w-full justify-center items-center px-2 py-16 sticky top-0 left-0 z-10 bg-[#060018] h-28 drop-shadow-xl shadow-md'>

					<button
						// bg-[#002569] hover:bg-[#002b71]
						ref={addBtnRef}
						className="text-xl font-sub px-6 py-2 bg-indigo-900 hover:bg-indigo-800 grow rounded max-w-[400px] w-unknown aspect-square h-unknown max-h-90px whitespace-nowrap"
						onClick={() => setCreateListPanelOpened(true)}>
						Add List
					</button>

					<div className='flex justify-center items-center h-unknown max-h-90px'>
						<div ref={searchInputCntRef} className='overflow-hidden w-0 h-unknown flex items-center  max-h-90px '>
							<input value={searchedListName} onInput={(ev) => setSearchedListName(ev.currentTarget.value ?? "")} type="text" className='bg-transparent border-2 border-white h-full w-full px-2 py-1' />
						</div>
						<BiSearchAlt onClick={toggleSearchBtn} className=' text-4xl sm:text-5xl cursor-pointer grow min-w-min max-w-90px max-h-90px h-full rounded aspect-square p-2  bg-cyan-800 hover:bg-cyan-700' />
					</div>

				</nav>
				<ul className="flex flex-col w-[95%] min-w-[310px] max-w-[950px] gap-8 py-6 list-none">
					{filteredList.map((list, index) => <List openThisList={() => openList(list)} list={list} key={index} />)}
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
		<li className="relative  bg-gradient-to-r to-blue-900  from-cyan-900  overflow-visible rounded select-none">
			<h2 className="absolute font-serif text-2xl  font-bold -translate-x-1/2 -top-4 left-1/2 whitespace-nowrap">{list.title}</h2>
			<div className="w-full grid justify-between h-[calc(100vw_*_.05_+_80px)] max-h-[120px] grid-flow-row grid-cols-3 auto-cols-min items-center  px-4 text-center font-medium font-sans">
				<div className="text-base sm:text-xl lg:text-2xl  text-gray-200 transition-[font-size] duration-200 items-start flex">{list.people.length} <br />{list.people.length == 1 ? `Person` : `People`}</div>
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
