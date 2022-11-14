import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineEdit } from 'react-icons/ai';
import LayerOver from "../components/layerOver";
import ListDetails from "../components/ListDetails";
import type { Person } from '../types';
import { ListItem } from '../types';

export const LS_NAMES = {
	lists: `allLists`
}

const DUMMY_NAMES = [
	"Keelie Spindler",
	"Noemie Bono",
	"Yousif Wilbur",
	"Rosella Nissen",
	"Pierre Marlow",
	"Breckyn Said",
	"Joao Castano",
	"Talaya Stutz",
	"Kynlee Gregg",
	"Zebadiah Birdsall",
	"Elana Mai",
	"Brailee Crutcher",
	"Kevin Stevens",
	"Freddie Caceres",
	"Rosanna Gaskin",
	"Azrael Sarver",
	"Marlie London",
	"Haven Doughty",
	"Meya Stolz",
	"Murphy Hargis",
	"Kacee Blas",
	"Jelena Salvatore",
	"Chyna Pauley",
	"Aleister Stamey",
	"Vishnu Myatt",
	"Violeta Perdue",
	"Bridger Nunn",
	"Lexi Melton",
	"Robert Ortiz",
	"Hubert Coen",
]





export default function ListsPage() {

	const [lists, setLists] = useState<ListItem[]>([])
	const [openedListIndex, setOpenedListIndex] = useState<number | null>(null)



	const update_LS_Timeout = useRef<NodeJS.Timeout>()
	useEffect(() => {
		clearTimeout(update_LS_Timeout.current)
		update_LS_Timeout.current = setTimeout(() => localStorage.setItem(LS_NAMES.lists, JSON.stringify(lists)), 1000)
	}, [lists])


	useEffect(() => () => {
		const rndList: Person[] = [{ name: 'U', isCompleted: false }, { name: 'C', isCompleted: false }]


		const randomList = (quantity = 10, title = "Tmp") => {
			const list: ListItem = { title, people: [] }
			for (let index = 0; index < quantity; index++) {
				list.people.push({ name: DUMMY_NAMES[Math.ceil(Math.random() * (DUMMY_NAMES.length - 1))]!, isCompleted: Boolean(Math.random() >= .5) })
			}
			return list
		}




		const allLists: ListItem[] = [randomList(10, `Tmp1`), randomList(5, 'Tmp2')];
		localStorage.setItem(LS_NAMES.lists, JSON.stringify(allLists))
		setLists(allLists)

	}, [])

	const closeListDetails = () => {
		setOpenedListIndex(null)
	}










	return (
		<div className="w-full h-full items-center flex flex-col">
			<div className="pt-4" />
			<section className="w-full flex justify-center">
				<button className="px-6 py-2 bg-[#1f2e47] hover:bg-[#2c3f61]  rounded w-1/3">Add List</button>
			</section>
			<div className="pt-6" />
			<ul className="list-none w-10/12 max-h-[calc(100vh_-_90px_-_2.5rem)] overflow-auto py-6 flex flex-col gap-8">
				{lists.map((list, index) => <ListItem setOpenedListIndex={setOpenedListIndex} index={index} list={list} key={index} />)}
			</ul>

			{
				openedListIndex !== null && <LayerOver closeView={closeListDetails}>
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
			<h2 className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl">{list.title}</h2>
			<div className="flex justify-between min-h-[100px] items-center px-4 text-center">
				<div className="text-gray-300 text-base">{list.people.length} <br />People</div>
				<div className="text-emerald-400 text-base">{list.people.filter(p => p.isCompleted).length} <br />Completed</div>
				<div
					onClick={onEditClick}
					className="text-3xl flex flex-col justify-center items-center text-yellow-500 cursor-pointer hover:text-yellow-300"
				>
					<AiOutlineEdit />
					<h3>Edit</h3>
				</div>
			</div>

		</li>
	)
}
