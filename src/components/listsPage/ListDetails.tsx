import type { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import { useMemo, useRef, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BiExport } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';
import { useLists } from '../../lib/ListsContext';
import type { Person } from '../../types';
import LayerOver from '../layerOver';


type ListDetailsProps = {
	closeView: () => void,
}
const ListDetails: FC<ListDetailsProps> = ({ closeView, }) => {
	const { lists, addPersonToList, deleteList, setListTitle, deletePersonFromList, togglePersonState, selectedDetailsListId, setSelectedDetailsListId } = useLists();


	const newNameRef = useRef<HTMLInputElement>(null)
	const [newNameIsEmpty, setNewNameIsEmpty] = useState(true)
	const [deletePopupShowing, setDeletePopupShowing] = useState(false)

	const selectedList = useMemo(() => lists.get(selectedDetailsListId) ?? null, [selectedDetailsListId, lists])

	if (!selectedList) {
		closeView();
		return null;
	}

	// --------------EVENTS---------------------

	function onAddUserClick() {
		if (!newNameRef.current) return

		const name = newNameRef.current.value.trim() ?? "";
		if (name === '') return;
		addPerson(name)
		newNameRef.current.value = ``
	}

	function onTitleInput(ev: ChangeEvent<HTMLInputElement>) {
		if (!selectedList) return;
		setListTitle(selectedList.id, ev.target.value)
	}
	function addPerson(name: string) {
		if (!selectedList) return;
		addPersonToList(selectedList.id, name)
	}
	function onListDeleteConfirm() {
		if (!selectedList) return;
		deleteList(selectedList.id)
		onCloseClick();
	}

	// -----------------------------------------

	function onCloseClick() {
		closeView();
	}



	return (
		<div className='w-full h-full flex flex-col justify-between items-center'>
			<DeletePopup visible={deletePopupShowing} setVisible={setDeletePopupShowing} onDeleteConfirm={onListDeleteConfirm} />

			<input
				className=" focus:text-yellow-500 border-b border-white/10 focus:border-yellow-400/20 focus:[text-shadow:none] focus:bg-black/20 font-serif whitespace-nowrap font-bold 
				text-[#43ff7c]  [text-shadow:_2px_2px_5px_#080] text-3xl absolute -top-5 left-1/2 -translate-x-1/2 bg-transparent outline-none focus:outline-none text-center w-3/4"
				value={selectedList.title}
				maxLength={50}
				onInput={onTitleInput}
			/>
			<div className='absolute flex text-4xl top-2 right-1'>
				{/* <BiImport className='cursor-not-allowed text-emerald-500 hover:text-emerald-600' /> */}
				<BiExport className='cursor-not-allowed text-cyan-600 hover:text-cyan-700' />
			</div>

			<div className="max-h-[80px] h-[80px] flex justify-center text-sm pt-10">

				<div className="flex items-center justify-center min-w-[80px] h-10 gap-2 bg-white rounded focus-within:outline-double outline-white">
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
						className="w-full h-10 px-2 text-black bg-transparent rounded placeholder:text-center placeholder:uppercase ring-0 focus:outline-none "
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
						className=' h-full disabled:bg-zinc-700 disabled:text-slate-400 disabled:cursor-not-allowed whitespace-nowrap bg-[#ff9900] hover:bg-[#e98904] px-3 py-2 w-fit rounded rounded-l-none'
						disabled={newNameIsEmpty}
					>
						Add User
					</button>
				</div>

			</div>


			<div className='grow flex flex-col bg-black max-h-[calc(100%_-_140px)] h-[calc(100%_-_140px)] min-w-[290px] w-[99%] overflow-y-auto rounded border border-gray-900'>

				<table className='text-sm sm:text-base'>
					<thead className='sticky top-0 left-0 select-none'>
						<tr className=' h-8'>
							<th className='bg-cyan-700 px-1 py-0 capitalize border-r border-cyan-900'>Name</th>
							<th className='bg-cyan-700 px-1 py-0 capitalize border-r border-cyan-900'>Is&nbsp;completed</th>
							<th className='bg-black text-sm text-red-500'>Delete</th>
						</tr>
					</thead>
					<tbody className=''>
						{selectedList.people.sort((a, b) => a.name.localeCompare(b.name)).map(
							(person, i) =>
								<PersonRow key={i} person={person} removeFromList={() => deletePersonFromList(selectedList.id, person.id)} toggleCompleteState={() => togglePersonState(selectedList.id, person.id)} />
						)}
					</tbody>
				</table>
			</div>




			<footer className="max-h-[50px] h-[50px] flex justify-between items-center text-base w-full">

				<div className='flex gap-2 text-4xl '>
					<AiFillDelete className='text-red-700 cursor-pointer hover:text-red-500 ' onClick={() => setDeletePopupShowing(true)} />

				</div>

				<div className='flex justify-end gap-4'>

					<button
						className='rounded px-4 py-3 bg-green-800 hover:bg-green-900 min-w-[90px]'
						onClick={onCloseClick}
					>
						Close
					</button>

				</div>

			</footer>
		</div>

	)
}






const PersonRow: FC<{ person: Person, removeFromList: () => void, toggleCompleteState: () => void }> = ({ person, removeFromList, toggleCompleteState }) => {


	return (
		<tr className="h-12 border-b last:border-none border-indigo-900/40">
			<td className='px-2 text-center capitalize border-r border-indigo-900'>
				{person.name}
			</td>
			<td className='text-center border-r border-indigo-900'>
				<input onChange={toggleCompleteState} type="checkbox" name="isCompleted" className='h-6 aspect-square' checked={person.isCompleted} />
			</td>
			<td onClick={removeFromList} className='flex items-center justify-center h-12 px-2 text-3xl text-red-700 border-r border-indigo-900 cursor-pointer hover:text-red-500'>
				<FiDelete />
			</td>
		</tr>
	)
}



const DeletePopup: FC<{ visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, onDeleteConfirm: () => void }> = ({ visible, setVisible, onDeleteConfirm }) => {

	if (!visible) return null;

	return <LayerOver customInnerDiv noBackdrop closeView={() => setVisible(false)}>
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
						onClick={() => setVisible(false)}
						className='px-2 py-1 text-xl bg-green-800 rounded hover:bg-green-900'
					>
						Cancel
					</button>

					<button
						className='px-2 py-1 text-xl bg-red-700 rounded hover:bg-red-800'
						onClick={onDeleteConfirm}
					>
						Remove
					</button>
				</div>

			</div>
		</div >
	</LayerOver>
}


export default ListDetails