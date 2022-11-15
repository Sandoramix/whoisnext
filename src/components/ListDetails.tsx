import { randomBytes } from 'crypto';
import type { ChangeEvent, FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BiExport, BiImport } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';
import { useLists } from '../lib/ListsContext';
import type { ListItem, Person } from '../types';
import LayerOver from './layerOver';


type ListDetailsProps = {
	currentListIndex: number,
	closeView: () => void,
}
const ListDetails: FC<ListDetailsProps> = ({ closeView, currentListIndex, }) => {
	const { lists, setLists, } = useLists();

	const [currentList, setCurrentList] = useState(lists[currentListIndex])

	const newNameRef = useRef<HTMLInputElement>(null)
	const [newNameIsEmpty, setNewNameIsEmpty] = useState(true)
	const [deletePopupShowing, setDeletePopupShowing] = useState(false)


	useEffect(() => {
		setLists(prev => {
			if (!prev) return prev;
			const newLists = prev;
			if (!currentList) return prev;

			newLists[currentListIndex] = currentList;

			return [...newLists]
		})
	}, [currentListIndex, setLists, currentList])

	if (!currentList) {
		closeView();
		return null;
	}



	const onTitleChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setCurrentList(prev => {
			if (!prev) return prev;
			const newList = prev
			newList.title = ev.target.value;

			return { ...newList }
		})
	}

	const addPersonToList = (name: string) => {
		setCurrentList(prev => {
			if (!prev) return prev;
			const newList = { ...prev };

			const personExists = newList.people.find(p => p.name === name)
			if (personExists) return prev;
			newList.peopleIndex++;

			newList.people = [...newList.people, { id: newList.peopleIndex, name, isCompleted: false }]
			return { ...newList }
		})

	}
	const removeFromList = (person: Person) => {
		setCurrentList(prev => {
			if (!prev) return prev;
			const newList = { ...prev };
			newList.people = newList.people.filter(p => p.id !== person.id);

			return { ...newList };
		})

	}

	const onAddUserClick = () => {
		if (!newNameRef.current) return

		const name = newNameRef.current.value.trim() ?? "";
		if (name === '') return;
		addPersonToList(name)
		newNameRef.current.value = ``
	}

	const togglePersonCompleteState = (person: Person) => {

		setCurrentList(prev => {
			if (!prev) return prev;
			const newList = { ...prev };

			newList.people = newList.people.map(p => {
				if (p.id === person.id) p.isCompleted = !p.isCompleted;

				return p;
			})


			return { ...newList }

		})

	}

	const onCloseClick = () => {
		closeView();
	}

	const deleteThisList = () => {
		setLists(prev => prev.filter((list, index) => index !== currentListIndex))
		onCloseClick();
	}


	return (
		<>
			{deletePopupShowing && <LayerOver customInnerDiv noBackdrop closeView={() => setDeletePopupShowing(false)}>
				<div
					className="w-1/2 h-1/2 aspect-square min-w-[200px] min-h-[200px]  overflow-auto relative py-4"
					onClick={(ev) => ev.stopPropagation()}
				>
					<div className="relative overflow-visible w-full h-full bg-[#000d29] flex flex-col justify-around items-center gap-2 px-2 py-1 text-center rounded-xl">
						<div>
							<h4 className='text-2xl whitespace-nowrap font-sub'>Are you sure?</h4>
							<h5 className='text-sm text-gray-400'>Do you really want to delete this list?</h5>
						</div>
						<div className='flex gap-2'>
							<button
								onClick={() => setDeletePopupShowing(false)}
								className=' rounded px-2 py-1 bg-green-800 hover:bg-green-900 text-xl'
							>
								Cancel
							</button>

							<button
								className='rounded px-2 py-1 bg-red-700 hover:bg-red-800 text-xl'
								onClick={deleteThisList}
							>
								Remove
							</button>
						</div>

					</div>
				</div >
			</LayerOver>
			}
			<input
				className="focus:animate-none animate-semipulse font-serif whitespace-nowrap font-bold text-[#00ffee] [text-shadow:_2px_2px_5px_#080] text-3xl absolute -top-5 left-1/2 -translate-x-1/2 bg-transparent outline-none focus:outline-none text-center w-10/12"
				value={currentList.title}
				maxLength={50}
				onInput={onTitleChange}
			/>
			<div className='absolute top-2 right-2 text-4xl'>
				<AiFillDelete className='cursor-pointer hover:text-red-500 text-red-700 ' onClick={() => setDeletePopupShowing(true)} />
			</div>

			<header className="max-h-[80px] h-[80px] flex justify-center text-sm">

				<div className="flex justify-center items-center gap-2 w-3/4">
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
						className="px-2 text-black h-10 w-10/12 rounded placeholder:text-center placeholder:uppercase"
						placeholder='Name'
						onKeyUp={(ev) => {
							if (ev.key.toLowerCase() === "enter") {
								onAddUserClick();
							}
						}}
					/>
					<button
						type='button'
						onClick={onAddUserClick}
						className=' disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed whitespace-nowrap bg-[#ff9900] hover:bg-[#e98904] px-3 py-2 w-fit rounded'
						disabled={newNameIsEmpty}
					>
						Add User
					</button>
				</div>

			</header>

			<div className='grow w-full flex flex-col bg-black max-h-[calc(100%_-_140px)] h-[calc(100%_-_140px)] overflow-y-auto rounded'>
				<table className='border-b border-green-900'>
					<thead>
						<tr className='bg-emerald-700 px-2 py-1'>
							<th className='border-r border-green-900  px-2 py-1 capitalize'>Name</th>
							<th className='border-r border-green-900 px-2 py-1 capitalize'>Is completed</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{currentList.people.sort((a, b) => a.name.localeCompare(b.name)).map(
							(person, i) =>
								<PersonRow key={i} person={person} removeFromList={() => removeFromList(person)} toggleCompleteState={() => togglePersonCompleteState(person)} />
						)}
					</tbody>
				</table>
			</div>

			<footer className="max-h-[50px] h-[50px] flex justify-between items-center">
				<div className='flex text-5xl gap-2 '>
					<BiImport className='text-emerald-500 hover:text-emerald-600 cursor-not-allowed' />
					<BiExport className='text-cyan-600 hover:text-cyan-700 cursor-not-allowed' />
				</div>

				<div className='flex gap-4 justify-end'>

					<button
						className='rounded px-4 py-3 bg-green-800 hover:bg-green-900 min-w-[90px] text-xl'
						onClick={onCloseClick}
					>
						Close
					</button>

				</div>

			</footer>
		</>

	)
}


const PersonRow: FC<{ person: Person, removeFromList: () => void, toggleCompleteState: () => void }> = ({ person, removeFromList, toggleCompleteState }) => {


	return (
		<tr className="h-12 last:border-none border-b border-green-900/50">
			<td className='text-center border-r border-green-900 px-2  capitalize'>
				{person.name}
			</td>
			<td className='text-center border-r border-green-900'>
				<input onChange={toggleCompleteState} type="checkbox" name="isCompleted" className='aspect-square h-6' checked={person.isCompleted} />
			</td>
			<td onClick={removeFromList} className='text-3xl px-2 flex h-12 justify-center items-center text-red-700 hover:text-red-500 cursor-pointer'>
				<FiDelete />
			</td>
		</tr>
	)
}


export default ListDetails