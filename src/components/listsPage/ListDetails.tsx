import type { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import React, { useMemo, useRef, useState } from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { BiExport } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';
import { useLists } from '../../lib/ListsContext';
import type { List, ListItem } from '../../types';
import { maxListItemsCount } from '../../utils/lists';
import LayerOver from '../layerOver';


type ListDetailsProps = {
	closeView: () => void,
	selectedList: List | null,
}
const ListDetails: FC<ListDetailsProps> = ({ closeView, selectedList }) => {
	const { addListItemToList, deleteList, setListTitle, deleteListItemFromList, toggleListItemState, maxTitleLength } = useLists();

	const newNameRef = useRef<HTMLInputElement>(null)
	const [deletePopupShowing, setDeletePopupShowing] = useState(false)

	const newNameIsEmpty = useMemo(() => newNameRef.current?.value.trim() === ``, [newNameRef])

	const [titleInputValue, setTitleInputValue] = useState(selectedList?.title ?? "")
	if (!selectedList) {
		closeView();
		return null;
	}


	// --------------EVENTS---------------------

	function onAddUserClick() {
		if (!newNameRef.current) return

		const name = newNameRef.current.value.trim() ?? "";
		if (name === '') return;
		addListItem(name)
		newNameRef.current.value = ``
	}

	function onTitleInput(ev: ChangeEvent<HTMLInputElement>) {
		if (!selectedList) return;
		const value = ev.target.value.substring(0, maxTitleLength);



		setTitleInputValue(value)
		setListTitle(selectedList.id, value)
	}
	function addListItem(name: string) {
		if (!selectedList) return;
		addListItemToList(selectedList.id, name)
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
		<div className='flex flex-col justify-start h-full w-full gap-1 sm:gap-2'>
			<DeletePopup visible={deletePopupShowing} setVisible={setDeletePopupShowing} onDeleteConfirm={onListDeleteConfirm} />


			<header>
				<input
					className=" focus:text-yellow-500 border-b border-white/10 focus:border-yellow-400/20 focus:[text-shadow:none] focus:bg-black/20 font-serif whitespace-nowrap font-bold 
				text-[#43ff7c]  [text-shadow:_2px_2px_5px_#080] text-3xl bg-transparent outline-none focus:outline-none text-center w-full px-2 py-1"
					value={titleInputValue}
					maxLength={maxTitleLength}
					onInput={onTitleInput}
					onBlur={() => setTitleInputValue(prev => prev.trim())}
				/>
			</header>

			<div className="max-h-[80px] h-[80px] flex justify-center text-sm items-center">

				{
					(selectedList.items.length < maxListItemsCount) && (
						<div className="flex items-center justify-center min-w-[80px] h-10 gap-2 bg-white rounded focus-within:outline-double outline-white">
							<input
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
					)}
				<button className='cursor-not-allowed disabled:text-gray-500 text-cyan-600 hover:text-cyan-700 text-4xl p-1' disabled>
					<BiExport />
				</button>
			</div>


			<div className='grow bg-black min-w-[290px] w-[99%] basis-full overflow-y-auto max-h-full rounded outline outline-gray-900/50 border-b border-indigo-900'>

				<table className='text-sm  sm:text-base w-full'>
					<thead className='sticky top-0 left-0 select-none'>
						<tr className='h-8 '>
							<th className='px-1 py-0 capitalize border-r bg-cyan-700 border-cyan-900'>Name</th>
							<th className='px-1 py-0 capitalize border-r bg-cyan-700 border-cyan-900'>Is&nbsp;completed</th>
							<th className='text-sm bg-cyan-700 text-rose-200'>Delete</th>
						</tr>
					</thead>
					<tbody className='w-full'>
						{selectedList.items.sort((a, b) => a.name.localeCompare(b.name)).map(
							(listItem, i) =>
								<ListRow key={i} listItem={listItem} removeFromList={() => deleteListItemFromList(selectedList.id, listItem.id)} toggleCompleteState={() => toggleListItemState(selectedList.id, listItem.id)} />
						)}
					</tbody>
				</table>
			</div>


			<footer className="max-h-[50px] h-[50px] shrink-0 flex justify-between items-center text-base w-full">

				<div className='flex gap-2 text-4xl '>
					<AiFillDelete className='text-red-800 cursor-pointer hover:text-red-700 ' onClick={() => setDeletePopupShowing(true)} />

				</div>

				<div className='flex justify-end gap-4'>

					<button
						className='rounded px-4 py-3 bg-green-800 hover:bg-green-700 min-w-[90px]'
						onClick={onCloseClick}
					>
						Close
					</button>

				</div>

			</footer>
		</div>

	)
}






const ListRow: FC<{ listItem: ListItem, removeFromList: () => void, toggleCompleteState: () => void }> = ({ listItem, removeFromList, toggleCompleteState }) => {


	return (
		<tr className="h-12 border-b border-indigo-900/40">
			<td className='px-2 text-center capitalize border-r border-indigo-900  border-opacity-75'>
				{listItem.name}
			</td>
			<td className='text-center border-r border-indigo-900 border-opacity-75 cursor-pointer' onClick={toggleCompleteState}>
				<input type="checkbox" name="isCompleted" className='h-6 aspect-square cursor-pointer' checked={listItem.isCompleted} />
			</td>
			<td onClick={removeFromList} className='flex items-center justify-center h-12 px-2 text-3xl text-red-700 cursor-pointer hover:text-red-500'>
				<FiDelete />
			</td>
		</tr>
	)
}



const DeletePopup: FC<{ visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, onDeleteConfirm: () => void }> = ({ visible, setVisible, onDeleteConfirm }) => {

	if (!visible) return null;

	return <LayerOver customInnerDiv noBackdrop closeView={() => setVisible(false)}>
		<div
			className="w-1/2 h-1/2 max-w-md max-h-[100px] aspect-square min-w-[200px] min-h-[200px]  overflow-auto relative py-4"
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
						className='px-3 py-2 text-xl bg-green-800 rounded hover:bg-green-700'
					>
						Cancel
					</button>

					<button
						className='px-3 py-2 text-xl bg-red-800 rounded hover:bg-red-700'
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