
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiImport } from 'react-icons/bi';

import type { ListItem } from '../types';

type CreateListProps = {
	setLists: Dispatch<SetStateAction<ListItem[]>>
	closeView: () => void,
}
const CreateList: FC<CreateListProps> = ({ closeView, setLists }) => {

	const titleInputRef = useRef<HTMLInputElement>(null);
	const peopleTextareaRef = useRef<HTMLTextAreaElement>(null);
	const usersFileRef = useRef<HTMLInputElement>(null)


	const [title, setTitle] = useState("");
	const isTitleValid = useMemo(() => title.trim() !== `` && title.length <= 20, [title])
	const [peopleNames, setPeopleNames] = useState<string[]>([])
	const isPeopleNamesValid = useMemo(() => peopleNames.length !== 0, [peopleNames])

	useEffect(() => {
		setTitle("")
		setPeopleNames([])
	}, [])


	const onTitleInput = () => {
		const title = titleInputRef.current?.value?.trim();
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
		//TODO file size limit, check if it is an txt or not.


		const rawData = await file.arrayBuffer();
		const plaintext = new TextDecoder().decode(rawData)
		//TODO VALIDATE text
		const people = plaintext.trim()
		if (people.length === 0) return;

		if (!peopleTextareaRef.current) return
		peopleTextareaRef.current.textContent = plaintext;

		onPeopleInput();
	}
	const onPeopleInput = () => {
		const people = peopleTextareaRef.current?.textContent?.trim()?.split(`\n`);
		console.log(peopleTextareaRef.current?.textContent?.trim());
		console.log(people);

		setPeopleNames(people ?? [])
	}


	const onCancelClick = () => {
		closeView();
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onFormSubmit = (ev: any) => {
		ev?.preventDefault();

		if (!isPeopleNamesValid || !isTitleValid) return;

		setLists(prev => {
			return [
				...prev,
				{
					title, people: peopleNames.map((name) => {
						return { name, isCompleted: false }
					})
				}]
		})
		closeView();
	}

	return (
		<>
			<h2
				className='absolute -top-5 left-1/2 -translate-x-1/2 font-serif whitespace-nowrap font-bold text-[#00ffee] [text-shadow:_2px_2px_5px_#080] text-3xl'
			>
				Create new List
			</h2>


			<form
				noValidate
				onSubmit={onFormSubmit}

				className='flex flex-col gap-4 justify-center items-center'>
				<div className='mt-6' />
				<div className='w-full flex flex-col justify-center items-center'>
					<label htmlFor="title" className='text-2xl font-bold uppercase text-gray-200'>Title </label>
					<span className='text-gray-300 text-sm'>(max 20 chars)</span>
					<input
						type="text"
						name="title"
						id="title"
						onInput={onTitleInput}
						ref={titleInputRef}
						autoComplete="off"
						maxLength={20}
						className={`w-full h-14 text-2xl text-center text-black rounded ${isTitleValid ? `` : `border border-red-500`}`}
						placeholder='E.g. Math 5A'
					/>
					<p className='min-h-[2ch] text-red-600 font-mono'>{isTitleValid ? `` : <span>Title cannot be empty <br className='block' />(and max 20 characters)</span>}</p>
				</div>


				<div className='w-full flex flex-col justify-center items-center'>
					<div className='w-full flex flex-col'>
						<label htmlFor="users" className='text-2xl font-bold uppercase text-gray-200'>Users </label>
						<span className='text-gray-300 text-sm'>(one per line)</span>
						<textarea
							name="users"
							id="users"
							autoComplete="off"
							rows={5}
							onInput={onPeopleInput}
							onChange={onPeopleInput}
							ref={peopleTextareaRef}
							className={`text-black w-full ${isPeopleNamesValid ? `` : `border border-red-500`}`}
							placeholder={`E.g.
Marco
Sophie
							`}
						/>
						<p className='min-h-[2ch] text-red-600 font-mono'>{isPeopleNamesValid ? `` : `Users list cannot be empty`}</p>
					</div>

					<p className='py-2 '>or</p>


					<div className='w-full '>
						<label htmlFor="usersFile" className='flex relative min-w-fit bg-cyan-900 hover:bg-cyan-800 cursor-pointer rounded-sm whitespace-nowrap w-1/3 mx-auto px-2 py-1 gap-2 justify-center items-center'>
							<BiImport className='text-slate-200 hover:text-slate-300' />
							<span>Import from file</span>
						</label>
						<input ref={usersFileRef} type="file" name="text" id="usersFile" className='sr-only' onInput={onUsersFileUpload} />
					</div>
				</div>

			</form>


			<footer className="max-h-[50px] h-[50px] flex justify-between gap-4  items-center  text-xl">


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
					disabled={!isPeopleNamesValid || !isTitleValid}
				>
					Create
				</button>
			</footer>
		</>

	)
}


export default CreateList