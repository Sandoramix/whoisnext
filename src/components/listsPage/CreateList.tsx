import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { BiImport } from 'react-icons/bi';
import { useLists } from '../../lib/ListsContext';
import { maxPeopleCount, maxTitleLength } from "../../utils/lists";

type CreateListProps = {
	closeView: () => void,
}

const CreateList: FC<CreateListProps> = ({ closeView }) => {

	const { addList } = useLists();
	const titleInputRef = useRef<HTMLInputElement>(null);
	const peopleTextareaRef = useRef<HTMLTextAreaElement>(null);
	const usersFileRef = useRef<HTMLInputElement>(null)


	const [title, setTitle] = useState("");
	const isTitleValid = useMemo(() => title.trim() !== `` && title.length <= 20, [title])
	const titleLeftChars = useMemo(() => 20 - title.trim().length, [title])

	const [peopleTextareaValue, setPeopleTextareaValue] = useState("")
	const peopleLeftCount = useMemo(() => maxPeopleCount - getPeopleFromTextArea(peopleTextareaValue).length, [peopleTextareaValue])


	useEffect(() => {
		setTitle("")
		setPeopleTextareaValue("")
	}, [])


	const onTitleInput = () => {
		const title = titleInputRef.current?.value.trim();
		setTitle(title ?? "")
	}


	const onUsersFileUpload = async () => {
		const files = usersFileRef.current?.files;
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
		const people = plaintext.trim()

		usersFileRef.current.value = ``
		setPeopleTextareaValue("")

		onPeopleInput(people);
	}
	function getPeopleFromTextArea(plaintext: string) {
		const people = plaintext
		if (people?.trim() === `` || !people) return [];
		return people.split(`\n`).filter(name => name.trim() !== ``);
	}



	const onPeopleInput = (plaintext: string) => {
		setPeopleTextareaValue(plaintext)
	}


	const onCancelClick = () => {
		closeView();
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onFormSubmit = (ev: any) => {
		ev?.preventDefault();

		if (peopleLeftCount < 0 || !isTitleValid) return;

		addList(title, getPeopleFromTextArea(peopleTextareaValue))

		closeView();
	}

	return (
		<>
			<h2
				className='absolute -top-5 left-1/2 -translate-x-1/2 font-serif whitespace-nowrap font-bold text-cyemerald [text-shadow:_2px_2px_5px_#080] text-3xl'
			>
				Create new List
			</h2>


			<form
				noValidate
				onSubmit={onFormSubmit}

				className='flex flex-col items-center justify-center gap-4'>
				<div className='mt-6' />
				<div className='flex flex-col items-center justify-center w-full'>
					<label htmlFor="title" className='grid grid-flow-row auto-cols-fr grid-cols-3 w-full items-center'>
						<span></span>
						<span className='text-3xl text-gray-200 uppercase font-flat '>Title</span>
						<span className='text-sm text-gray-400 font-mono text-end self-end'></span>
					</label>

					<div className={`relative w-full h-14 text-2xl text-center text-black rounded ${isTitleValid ? `` : `outline outline-red-500`} relative`}>
						<input
							type="text"
							name="title"
							id="title"
							onInput={onTitleInput}
							ref={titleInputRef}
							autoComplete="off"
							maxLength={20}
							className={`w-full h-full px-3 py-1`}
							placeholder='E.g. Math 5A'
						/>
						<p className={`pointer-events-none select-none absolute right-1 bottom-1 font-serif text-xl ${titleLeftChars < 0 ? `text-red-600` : `text-gray-600`}`}>{titleLeftChars}</p>
					</div>

				</div>


				<div className='flex flex-col items-center justify-center w-full'>
					<div className='flex flex-col w-full'>
						<label htmlFor="users" className='grid grid-flow-row auto-cols-fr grid-cols-3 w-full items-center'>
							<span></span>
							<span className='text-3xl text-gray-200 uppercase font-flat'>Users</span>
							<span className='text-sm text-gray-400 font-mono text-end self-end'>one per line</span>
						</label>


						<div className={`flex flex-col relative text-black w-full  h-full max-h-[40vh] rounded ${peopleLeftCount < 0 ? `outline outline-red-500` : ``}`}>
							<textarea
								name="users"
								id="users"
								autoComplete="off"
								rows={5}
								onInput={(ev) => onPeopleInput(ev.currentTarget.value)}
								draggable={false}
								value={peopleTextareaValue}
								ref={peopleTextareaRef}
								className={`px-2 py-1 h-full min-h-[40vh] max-h-[40vh] w-full`}
								placeholder={`E.g.
Marco
Sophie
							`}
							/>
							<p className={`pointer-events-none select-none absolute right-2 bottom-1 font-serif text-xl  ${peopleLeftCount < 0 ? `text-red-600` : `text-gray-600`}`}>{peopleLeftCount}</p>
						</div>
					</div>

					{
						!isMobile && (
							<>
								<p className='py-2 '>or</p>

								<div className='w-full '>
									<label htmlFor="usersFile" className='relative flex items-center justify-center gap-2 px-4 py-3 w-min mx-auto rounded-sm cursor-pointer min-w-fit bg-indigo-700 hover:bg-indigo-600 whitespace-nowrap'>
										<BiImport className='text-slate-200 hover:text-slate-300 text-xl' />
										<span>Import from file</span>
									</label>
									<input ref={usersFileRef} type="file" name="text" id="usersFile" className='sr-only' accept='.txt' size={1024} onInput={onUsersFileUpload} />
								</div>
							</>
						)
					}
				</div>

			</form>


			<footer className="max-h-[50px] h-[50px] flex justify-between gap-4  items-center  text-2xl px-4 pb-2">


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
					disabled={peopleLeftCount < 0 || !isTitleValid}
				>
					Create
				</button>
			</footer>
		</>

	)
}


export default CreateList