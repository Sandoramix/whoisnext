import { useState } from "react"
import { AiOutlineEdit } from 'react-icons/ai'

type ListItem = {
	title: string,
	people: Person[]
}
type Person = {
	name: string,
	isCompleted: boolean
}


export default function ListsPage() {
	const [lists, setLists] = useState<ListItem[]>([
		{
			title: 'Math',
			people: [
				{
					name: 'Bacci',
					isCompleted: false
				},
				{
					name: 'Franco S.',
					isCompleted: true
				},
			]
		},
		{
			title: 'Storia',
			people: [
				{
					name: 'Bacci',
					isCompleted: false
				},
				{
					name: 'Franco Samuele',
					isCompleted: true
				},
			]
		}
	])

	return (
		<div className="w-full h-full items-center flex flex-col">
			<div className="pt-4" />
			<section className="w-full flex justify-center">
				<button className="px-6 py-2 bg-[#1f2e47] hover:bg-[#2c3f61]  rounded w-1/3">Add List</button>
			</section>
			<div className="pt-6" />
			<ul className="list-none w-10/12 max-h-[calc(100vh_-_90px_-_2.5rem)] overflow-auto py-6 flex flex-col gap-8">
				{lists.map((list, index) => <ListItem list={list} key={index} />)}
			</ul>
		</div>
	)
}

const ListItem = ({ list }: { list: ListItem }) => {


	return (
		<li className="relative bg-[#000d22] overflow-visible rounded select-none">
			<h2 className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl">{list.title}</h2>
			<div className="flex justify-between min-h-[100px] items-center px-4 text-center">
				<div className="text-gray-300 text-base">{list.people.length} <br />People</div>
				<div className="text-emerald-400 text-base">{list.people.filter(p => p.isCompleted).length} <br />Completed</div>
				<div className="text-3xl flex flex-col justify-center items-center text-[#f7ff58] cursor-pointer hover:text-[#ffca58]">
					<AiOutlineEdit />
					<h3>Edit</h3>
				</div>
			</div>
		</li>
	)
}