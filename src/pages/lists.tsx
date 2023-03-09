import { useMemo, useRef, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BiSearchAlt } from 'react-icons/bi';
import LayerOver from "../components/layerOver";
import CreateList from "../components/listsPage/CreateList";
import ListDetails from "../components/listsPage/ListDetails";

import { useLists } from '../lib/ListsContext';
import { List } from '../types';


export default function ListsPage() {
	const { lists } = useLists();
	const [createListPanelOpened, setCreateListPanelOpened] = useState(false);

	const [searchedListName, setSearchedListName] = useState("");
	const filteredList = useMemo(() => [...lists.values()].filter(list => list.title.toLowerCase().includes(searchedListName.toLowerCase())), [lists, searchedListName]);

	const addBtnRef = useRef<HTMLButtonElement>(null);
	const searchInputCnt = useRef<HTMLDivElement>(null);
	const outerInputCnt = useRef<HTMLDivElement>(null);

	const [selectedList, setSelectedList] = useState<List | null>(null)
	const closeListDetails = () => {

		setSelectedList(null)
	}

	function openList(list: List) {
		setSelectedList(list)

	}

	function toggleSearchBtn() {
		if (!addBtnRef.current) return;
		const isSearchActive = addBtnRef.current.className.includes('w-full');

		addBtnRef.current.textContent = isSearchActive ? `+` : `Add List`
		addBtnRef.current.classList.toggle(`w-full`, !isSearchActive);

		addBtnRef.current.classList.toggle(`!text-3xl`, isSearchActive)

		searchInputCnt.current?.classList.toggle('!w-full', isSearchActive)
		outerInputCnt.current?.classList.toggle(`grow`, isSearchActive);
		setSearchedListName("")
	}


	return (
		<div className="flex flex-col items-center w-full h-full bg-gradient-to-b to-[#0f0c4c] from-[#06001a]">

			<div className="relative flex flex-col items-center justify-start w-full h-full px-2 overflow-auto max-h-main">

				<nav className='flex gap-2  w-full justify-center items-center py-16 sticky top-0 left-0 z-10 bg-[#060018] h-28  drop-shadow-xl shadow-md'>

					<button
						id='addBtn'
						ref={addBtnRef}
						className="text-xl font-sub px-4 py-2 bg-indigo-900 hover:bg-indigo-800 w-full aspect-square  rounded max-w-[400px]  h-unknown max-h-90px whitespace-nowrap"
						onClick={() => setCreateListPanelOpened(true)}>
						Add List
					</button>

					<div ref={outerInputCnt} id='searchCnt' className={`${lists.size === 0 ? `hidden` : `flex`} items-center justify-center transition-all duration-300 max-h-90px`}>

						<div ref={searchInputCnt} id='searchCnt_inputCnt' className='flex items-center w-0 overflow-hidden h-unknown max-h-90px'>
							<input
								value={searchedListName}
								onInput={(ev) => setSearchedListName(ev.currentTarget.value ?? "")}
								type="text"
								className='w-full h-full px-2 py-1 mr-2 text-2xl text-center align-bottom bg-transparent border-b-2 border-white sm:text-4xl placeholder:text-gray-400 focus:outline-none'
								placeholder='Title'
							/>
						</div>
						<input type="checkbox" name="search" id="searchToggler" className='sr-only' />
						<label onClick={toggleSearchBtn} htmlFor="searchToggler" className='items-center justify-center p-2 transition-all duration-300 rounded cursor-pointer not-red-label grow bg-emerald-800 hover:bg-emerald-700 min-w-min max-w-90px max-h-90px h-unknown aspect-square'>
							<BiSearchAlt

								className='w-full h-full text-4xl sm:text-5xl aspect-square'
							/>
						</label>
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
		<li className="relative overflow-visible rounded select-none bg-gradient-to-r to-blue-900 from-cyan-900">
			<h2 className="absolute font-serif text-2xl font-bold -translate-x-1/2 -top-4 left-1/2 whitespace-nowrap">{list.title}</h2>
			<div className="w-full grid justify-between h-[calc(100vw_*_.05_+_80px)] max-h-[120px] grid-flow-row grid-cols-3 auto-cols-min items-center  px-4 text-center font-medium font-sans">
				<div className="text-base sm:text-xl lg:text-2xl  text-gray-200 transition-[font-size] duration-200 items-start flex">{list.items.length} <br />{list.items.length == 1 ? `element` : `elements`}</div>
				<div className="text-base sm:text-xl lg:text-2xl  text-emerald-300 transition-[font-size] duration-200">{list.items.filter(p => p.isCompleted).length} <br />Completed</div>
				<div

					className="flex flex-col items-end justify-center text-xl font-extrabold sm:text-2xl lg:text-3xl"
				>
					<div onClick={onEditClick} className="flex flex-col items-center justify-center px-4 py-2 text-yellow-500 cursor-pointer hover:text-yellow-300">
						<AiOutlineEdit className="text-3xl sm:text-4xl lg:text-5xl  transition-[font-size] duration-200" />
						<h3>Edit</h3>
					</div>
				</div>
			</div>

		</li>
	)
}
