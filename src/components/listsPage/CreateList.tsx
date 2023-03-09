import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { BiImport } from 'react-icons/bi';
import { useLists } from '../../lib/ListsContext';
import { maxListItemsCount } from '../../utils/lists';

type CreateListProps = {
	closeView: () => void,
}

const CreateList: FC<CreateListProps> = ({ closeView }) => {

	const { addList, maxTitleLength } = useLists();
	const titleInputRef = useRef<HTMLInputElement>(null);
	const listItemsTextareaRef = useRef<HTMLTextAreaElement>(null);
	const listItemsRef = useRef<HTMLInputElement>(null)


	const [title, setTitle] = useState("");
	const isTitleValid = useMemo(() => title.trim() !== `` && title.length <= maxTitleLength, [title, maxTitleLength])
	const titleLeftChars = useMemo(() => maxTitleLength - title.trim().length, [title, maxTitleLength])

	const [listItemsTextareaValue, setListItemsTextareaValue] = useState("")
	const listItemsLeftCount = useMemo(() => maxListItemsCount - getListItemsFromTextArea(listItemsTextareaValue).length, [listItemsTextareaValue])


	useEffect(() => {
		setTitle("")
		setListItemsTextareaValue("")
	}, [])


	const onTitleInput = () => {
		const title = titleInputRef.current?.value.trim().substring(0, maxTitleLength);
		setTitle(title ?? "")
	}


	const onListFileUpload = async () => {
		const files = listItemsRef.current?.files;
		if (!files) {
			console.error(`This browser doesn't seem to support the "files" property of file inputs.`);
			return;
		}
		const file = files[0]
		if (!file) {
			console.warn(`Please select a file before clicking 'Load'`);
			return
		}
		//TODO file size limit.
		//file.size 1024 / 1024 + "MiB"

		const rawData = await file.arrayBuffer();
		const plaintext = new TextDecoder().decode(rawData)

		//TODO VALIDATE text
		const items = plaintext.trim()

		listItemsRef.current.value = ``
		setListItemsTextareaValue("")

		onListItemsInput(items);
	}
	function getListItemsFromTextArea(plaintext: string) {
		const items = plaintext
		if (items?.trim() === `` || !items) return [];
		return items.split(`\n`).filter(name => name.trim() !== ``);
	}



	const onListItemsInput = (plaintext: string) => {
		setListItemsTextareaValue(plaintext)
	}


	const onCancelClick = () => {
		closeView();
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onFormSubmit = (ev: any) => {
		ev?.preventDefault();

		if (listItemsLeftCount < 0 || !isTitleValid) return;

		addList(title, getListItemsFromTextArea(listItemsTextareaValue))

		closeView();
	}

	return (
		<div className='flex flex-col gap-2 justify-start h-full max-h-full overflow-y-auto'>
			<div>
				<h2
					className=' font-serif whitespace-nowrap font-bold text-cyemerald [text-shadow:_2px_2px_5px_#080] text-3xl'
				>
					Create new List
				</h2>
			</div>


			<form
				noValidate
				onSubmit={onFormSubmit}

				className='flex flex-col items-center justify-center gap-4'>

				<div className='flex flex-col items-center justify-center w-full'>
					<label htmlFor="title" className='grid items-center w-full grid-flow-row grid-cols-3 auto-cols-fr'>
						<span></span>
						<span className='text-3xl text-gray-200 uppercase font-flat '>Title</span>
						<span className='self-end font-mono text-sm text-gray-400 text-end'></span>
					</label>

					<div className={`relative w-full h-14 text-2xl text-center text-black rounded ${isTitleValid ? `` : `outline outline-red-500`} relative`}>
						<input
							type="text"
							name="title"
							id="title"
							onInput={onTitleInput}
							ref={titleInputRef}
							autoComplete="off"
							maxLength={maxTitleLength}
							className={`w-full h-full px-3 py-1`}
							placeholder='E.g. Pizzas'
						/>
						<p className={`pointer-events-none select-none absolute right-1 bottom-1 font-serif text-xl ${titleLeftChars < 0 ? `text-red-600` : `text-gray-600`}`}>{titleLeftChars}</p>
					</div>

				</div>


				<div className='flex flex-col items-center justify-center w-full'>
					<div className='flex flex-col w-full'>
						<label htmlFor="list" className='grid items-center w-full grid-flow-row grid-cols-3 auto-cols-fr'>
							<span></span>
							<span className='text-3xl text-gray-200 uppercase font-flat'>List</span>
							<span className='self-end font-mono text-sm text-gray-400 text-end'>one<br className='sm:hidden' /><span className='hidden sm:visible'>&nbsp;</span> per line</span>
						</label>


						<div className={`flex flex-col relative text-black w-full  h-full max-h-[40vh] rounded ${listItemsLeftCount < 0 ? `outline outline-red-500` : ``}`}>
							<textarea
								name="list"
								id="list"
								autoComplete="off"
								rows={5}
								onInput={(ev) => onListItemsInput(ev.currentTarget.value)}
								draggable={false}
								value={listItemsTextareaValue}
								ref={listItemsTextareaRef}
								className={`px-2 py-1 h-full min-h-[40vh] max-h-[40vh] w-full custom-scrollbar`}
								placeholder={`E.g.
Marco
Sophie
							`}
							/>
							<p className={`pointer-events-none select-none absolute right-2 bottom-1 font-serif text-xl  ${listItemsLeftCount < 0 ? `text-red-600` : `text-gray-600`}`}>{listItemsLeftCount}</p>
						</div>
					</div>

					{
						!isMobile && (
							<>
								<p className='py-2 '>or</p>

								<div className='w-full '>
									<label htmlFor="listFile" className='relative flex items-center justify-center gap-2 px-3 py-2 mx-auto bg-indigo-700 rounded-sm cursor-pointer w-min min-w-fit hover:bg-indigo-600 whitespace-nowrap'>
										<BiImport className='text-xl text-slate-200 hover:text-slate-300' />
										<span>Import from file</span>
									</label>
									<input ref={listItemsRef} type="file" name="text" id="listFile" className='sr-only' accept='.txt' size={1024} onInput={onListFileUpload} />
								</div>
							</>
						)
					}
				</div>

			</form>


			<span className='grow'></span>
			<footer className="max-h-[50px] h-[50px] mt-2 flex justify-between gap-4  items-center  text-2xl px-4 pb-2">


				<button
					type='button'
					onClick={onCancelClick}
					className=' rounded px-4 py-2 bg-red-700 hover:bg-red-800 min-w-[90px]'
				>
					Cancel
				</button>

				<button
					onClick={onFormSubmit}
					className='rounded px-4 py-2 bg-green-800 hover:bg-green-900 min-w-[90px] disabled:bg-zinc-800 disabled:cursor-not-allowed'
					disabled={listItemsLeftCount < 0 || !isTitleValid}
				>
					Create
				</button>
			</footer>
		</div>

	)
}


export default CreateList