import type { ChangeEvent, Dispatch, FC, MouseEvent, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BiExport, BiImport } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';
import type { ListItem, Person } from '../types';


type ListDetailsProps = {
	lists: ListItem[],
	setLists: Dispatch<SetStateAction<ListItem[]>>
	currentListIndex: number,
	closeView: () => void,
}
const ListDetails: FC<ListDetailsProps> = ({ closeView, currentListIndex, lists, setLists }) => {
	const [currentList, setCurrentList] = useState(lists[currentListIndex])

	const newNameRef = useRef<HTMLInputElement>(null)
	const [newNameIsEmpty, setNewNameIsEmpty] = useState(false)


	useEffect(() => {
		setLists(prev => {
			if (!currentList) return prev;
			const newLists = prev;
			newLists[currentListIndex] = currentList;

			return newLists
		})
	}, [currentListIndex, setCurrentList, setLists, currentList, lists])

	if (!currentList) {
		closeView();
		return null;
	}



	const onTitleChange = (ev: ChangeEvent<HTMLInputElement>) => {
		const title = ev.target.value
		currentList.title = title
		setCurrentList({ ...currentList })
	}

	const addPersonToList = (person: Person) => {
		currentList.people.push(person)
		setCurrentList({ ...currentList })
	}
	const removePersonFromList = (i: number) => {
		currentList.people = currentList.people.filter((person, index) => index !== i);
		setCurrentList({ ...currentList })
	}

	const onAddUserClick = () => {
		if (!newNameRef.current) return

		const name = newNameRef.current.value.trim() ?? "";
		if (name == '') return;
		addPersonToList({
			name,
			isCompleted: false
		})
		newNameRef.current.value = ``
	}

	const togglePersonCompleteState = (personIndex: number) => {
		const newPerson = currentList.people[personIndex]
		if (!newPerson) return;
		newPerson.isCompleted = !newPerson.isCompleted
		currentList.people[personIndex] = newPerson
		setCurrentList({ ...currentList })
	}

	const onCloseClick = () => {
		closeView();
	}

	const onDeleteListClick = (ev: MouseEvent<SVGElement>) => {
		console.log(ev.target);

	}


	return (
		<div
			className="w-11/12 h-[90%]  overflow-auto relative py-4"
			onClick={(ev) => ev.stopPropagation()}
		>
			<div className="relative overflow-visible w-full h-full bg-[#020114]/90 flex flex-col justify-between px-3 py-4">
				<input
					className="[text-shadow:_2px_2px_10px_#00a] font-extrabold text-3xl absolute -top-5 left-1/2 -translate-x-1/2 bg-transparent outline-none focus:outline-none text-center w-10/12"
					value={currentList.title}
					maxLength={50}
					onChange={onTitleChange}
				/>
				<div className='absolute top-2 right-2 text-4xl'>
					<AiFillDelete className='cursor-pointer hover:text-red-500 text-red-700 ' onClick={onDeleteListClick} />
				</div>

				<header className="max-h-[80px] h-[80px] flex justify-center">

					<div className="flex justify-center items-center gap-2">
						<input
							onChange={(ev) => {
								const val = ev.target.value.trim();
								setNewNameIsEmpty(val === '')
							}}
							autoComplete="off"
							type="text"
							name="name"
							id="name"
							ref={newNameRef}
							className="px-2 text-black h-11 rounded placeholder:text-center placeholder:uppercase"
							placeholder='Name'
							onKeyUp={(ev) => {
								if (ev.key.toLowerCase() === "enter") {
									onAddUserClick();
								}
							}}
						/>
						<button
							onClick={onAddUserClick}
							className=' disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed bg-[#ff9900] hover:bg-[#e98904] px-2 py-2 rounded'
							disabled={newNameIsEmpty}
						>
							Add User
						</button>
					</div>

				</header>

				<div className='grow w-full flex flex-col bg-black max-h-[calc(100%_-_140px)] h-[calc(100%_-_140px)] overflow-y-auto rounded'>
					<table className='border-b border-green-900'>
						<thead>
							<tr className='bg-emerald-700'>
								<th className='border-r border-green-900 '>Name</th>
								<th className='border-r border-green-900'>Is completed</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{currentList.people.map(
								(person, i) =>
									<PersonRow key={i} index={i} person={person} removeFromList={removePersonFromList} toggleCompleteState={togglePersonCompleteState} />
							)}
						</tbody>
					</table>
				</div>

				<footer className="max-h-[50px] h-[50px] flex justify-between items-center">
					<div className='flex text-5xl gap-2'>
						<BiImport className='text-emerald-500 hover:text-emerald-600 cursor-pointer' />
						<BiExport className='text-cyan-600 hover:text-cyan-700 cursor-pointer' />
					</div>

					<div className='flex gap-4 justify-end'>
						{/* <button
							onClick={onCancelClick}
							className=' rounded px-4 py-2 bg-red-700 hover:bg-red-800 min-w-[90px]'
						>
							Cancel
						</button> */}

						<button
							className='rounded px-4 py-2 bg-green-800 hover:bg-green-900 min-w-[90px]'
							onClick={onCloseClick}
						>
							Close
						</button>

					</div>

				</footer>
			</div>
		</div>
	)
}


const PersonRow: FC<{ person: Person, index: number, removeFromList: (index: number) => void, toggleCompleteState: (index: number) => void }> = ({ person, index, removeFromList, toggleCompleteState }) => {


	return (
		<tr className="h-12 last:border-none border-b border-green-900/50">
			<td className='text-center border-r border-green-900'>
				{person.name}
			</td>
			<td className='text-center border-r border-green-900'>
				<input onChange={() => toggleCompleteState(index)} type="checkbox" name="isCompleted" checked={person.isCompleted} />
			</td>
			<td onClick={() => removeFromList(index)} className='flex h-12 justify-center items-center text-red-700 hover:text-red-500 cursor-pointer'>
				<FiDelete />
			</td>
		</tr>
	)
}


export default ListDetails