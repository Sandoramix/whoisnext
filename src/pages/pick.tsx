import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { type NextPage } from "next";
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import QuantityInput from '../components/pickPage/QuantityInput';
import { useLists } from '../lib/ListsContext';
import type { Person } from '../types';
import { type List } from '../types';




const PickPage: NextPage = () => {
	const { lists } = useLists();
	const [selectedListId, setSelectedListId] = useState("")
	const [ignoreCompleted, setIgnoreCompleted] = useState(false)

	const selectedList = useMemo(() => lists.find(list => {
		list.people = ignoreCompleted ? list.people : list.people.filter(p => !p.isCompleted)
		return list.id === selectedListId
	}), [lists, selectedListId])
	const selectedListPeopleLength = useMemo(() => selectedList?.people.length ?? 0, [selectedList])



	const [quantity, setQuantity] = useState("")


	const isQuantityValid = useMemo(() => {
		if (quantity === ``) return false;
		const number = parseInt(quantity);
		console.log(quantity, number, selectedListPeopleLength);

		return number > 0 && number <= selectedListPeopleLength

	}, [quantity, selectedListPeopleLength])

	useEffect(() => {

		if (quantity.trim() === ``) return
		if (isQuantityValid) return;

		setQuantity(prev => {
			if (prev.trim() === ``) return prev;
			let number = parseInt(prev);
			number = (number < 1) ? 1 : (number > selectedListPeopleLength) ? selectedListPeopleLength : number
			return number.toString();
		})
	}, [quantity, selectedListPeopleLength, isQuantityValid])



	function incrementQuantity(n: number) {
		setQuantity(prev => {
			if (prev.trim() === ``) return "1";
			const number = parseInt(prev);
			if (number + n >= 1 && number + n <= selectedListPeopleLength)
				return (number + n).toString();
			return number.toString()
		})
	}


	// MUI PART
	const options = lists.map((list => {
		const firstLetter = list.title[0]!
		return {
			firstLetter: /[0-9]/.test(firstLetter) ? `0-9` : firstLetter,
			title: list.title,
			id: list.id
		}
	}))
	const AutoCompleteProps = {
		options: lists,
		getOptionLabel: (option: List) => option.title,
	};



	return (

		<div className="w-full h-full">
			<div className='px-2 py-1 pt-2 w-full h-full'>
				<header className='flex justify-center items-center gap-2'>

					<Autocomplete

						key={`autocomplete-list`}
						{...AutoCompleteProps}
						className="bg-[#021130] rounded text-white placeholder:text-white w-full max-w-md border border-white/20"
						isOptionEqualToValue={(option, value) => value.id === option.id}
						clearOnEscape
						autoComplete
						selectOnFocus
						handleHomeEndKeys
						options={options.sort((a, b) => a.firstLetter.localeCompare(b.firstLetter))}
						groupBy={(option) => option.firstLetter}
						getOptionLabel={(option) => option.title}
						renderGroup={(params) => (

							<div className='text-white bg-black' key={`group-${params.group}`}>
								<div className='bg-zinc-900 px-2 font-bold'>{params.group}</div>
								<div className='bg-zinc-800'>{params.children}</div>
							</div>

						)}
						id="select-list-input"

						onChange={(ev, option) => setSelectedListId(option?.id ?? "")}
						sx={{ width: 300 }}

						renderInput={(params) => <TextField className='' key={`item-${params.id}`} {...params} color="info" label="List" />}
					/>
					<QuantityInput list={selectedList} quantity={quantity} setQuantity={setQuantity} incrementQuantity={incrementQuantity} />

				</header>

				{selectedList && <RandomPicker isQuantityValid={isQuantityValid} quantity={quantity} list={selectedList} />}





			</div>
		</div>
	);
};

const RandomPicker: FC<{ list: List, quantity: string, isQuantityValid: boolean }> = ({ list, quantity, isQuantityValid }) => {
	const [extractedPeople, setExtractedPeople] = useState<Person[]>([])




	function onPickBtnClick() {
		const selectedPeople: Person[] = [];
		for (let i = 0; i < parseInt(quantity); i++) {

			const usableIndexes = [...Array(list.people.length).keys()].filter(index => {
				const person = list.people.at(index)
				if (!person) return false;
				return !selectedPeople.includes(person)
			})

			const randPerson = list.people[usableIndexes[Math.floor(Math.random() * (usableIndexes.length))]!]!;

			selectedPeople.push(randPerson);
		}
		setExtractedPeople(selectedPeople)
	}


	return (
		<div className=''>
			<div className='w-full flex flex-col justify-center items-center gap-2'>
				<button
					disabled={!isQuantityValid}
					className='px-4 py-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-xl font-mono'
					onClick={onPickBtnClick}
				>Pick</button>
			</div>

			<div className='py-1'></div>
			<div className='flex flex-col grow overflow-y-auto max-h-96 relative rounded border-zinc-900/40 border'>
				{extractedPeople.length > 0 && (
					<table className=''>
						<thead className='sticky top-0 left-0'>
							<tr className='bg-emerald-700 text-center'>
								<td className='px-2 py-1 border-r'>N</td>
								<td className='px-2 py-1 '>Name</td>
							</tr>
						</thead>
						<tbody>
							{
								extractedPeople.map((person, index) => (
									<tr key={index}>
										<td className='px-2 py-1 text-center border-r border-white/80'>{index + 1}</td>
										<td className='px-2 py-1 text-center'>{person.name}</td>
									</tr>)
								)
							}
						</tbody>
					</table>
				)}
			</div>

		</div>
	)
}






export default PickPage;
