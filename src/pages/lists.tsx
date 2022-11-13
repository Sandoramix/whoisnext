import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { z } from "zod";
import LayerOver from "../components/layerOver";
import ListDetails from "../components/ListDetails";
import type { Person } from "../types";
import { ListItem } from "../types";

const LS_NAMES = {
	lists: `allLists`
}

const listsValidator = z.array(z.object({
	title: z.string(),
	people: z.array(z.object({
		name: z.string(),
		isCompleted: z.boolean(),
	}))
}))

export default function ListsPage() {

	const [lists, setLists] = useState<ListItem[]>([])
	const [openedListIndex, setOpenedListIndex] = useState<number | null>(null)

	const getLocalStorageLists = (): ListItem[] => {
		const parsed = JSON.parse(localStorage.getItem(LS_NAMES.lists) ?? '[]')
		return listsValidator.safeParse(parsed).success ? parsed : []
	}
	const updateLocalStorage = () => {
		localStorage.setItem(LS_NAMES.lists, JSON.stringify(lists))
	}



	const listHandlers = {
		addPerson: (listIndex: number, person: Person) => {
			setLists(prev => {
				const list = prev[listIndex];
				if (!list) return prev;

				list.people.push(person);
				const newLists = prev;
				newLists[listIndex] = list;
				return newLists
			})

			updateLocalStorage()
		},
		removePerson: (listIndex: number, personIndex: number) => {
			setLists(prev => {
				const list = prev[listIndex];
				if (!list) return prev;

				list.people = list.people.filter((p, index) => index !== personIndex);

				const newLists = prev;
				newLists[listIndex] = list;
				return newLists
			})

			updateLocalStorage()
		},
		togglePersonState: (listIndex: number, personIndex: number) => {
			setLists(prev => {
				const list = prev[listIndex];
				if (!list) return prev;

				const person = list.people[personIndex];
				if (!person) return prev;
				person.isCompleted = !person.isCompleted;
				list.people[personIndex] = person;

				const newLists = prev;
				newLists[listIndex] = list;
				return newLists
			})

			updateLocalStorage()
		},
		updateTitle: (listIndex: number, title: string) => {
			setLists(prev => {
				const list = prev[listIndex];
				if (!list) return prev;
				list.title = title;

				const newLists = prev;
				newLists[listIndex] = list;
				return newLists
			})

			updateLocalStorage()
		}
	}


	useEffect(() => () => {
		setLists(getLocalStorageLists())
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
						list={lists[openedListIndex]} listIndex={openedListIndex}
						closeView={closeListDetails}
						addPerson={listHandlers.addPerson} updateTitle={listHandlers.updateTitle} removePerson={listHandlers.removePerson} togglePersonState={listHandlers.togglePersonState}
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