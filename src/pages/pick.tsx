import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { type NextPage } from "next";
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import QuantityInput from '../components/pickPage/totalQuantity';
import { useLists } from '../lib/ListsContext';
import { type List } from '../types';




const PickPage: NextPage = () => {
	const { lists } = useLists();
	const [selectedListId, setSelectedListId] = useState("")

	const selectedList = useMemo(() => lists.find(list => list.id === selectedListId), [lists, selectedListId])






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
			<div className='px-2 py-1 pt-2 w-full h-full min-w-[300px]'>
				<header className='flex justify-center items-center'>

					<Autocomplete
						key={`autocomplete-list`}
						{...AutoCompleteProps}
						className="bg-[#000d29] rounded text-white placeholder:text-white w-10/12 max-w-md min-w-[300px]"
						isOptionEqualToValue={(option, value) => value.id === option.id}
						clearOnEscape
						autoComplete
						selectOnFocus
						handleHomeEndKeys
						options={options.sort((a, b) => a.firstLetter.localeCompare(b.firstLetter))}
						groupBy={(option) => option.firstLetter}
						getOptionLabel={(option) => option.title}
						renderGroup={(params) => (

							<div key={`group-${params.group}`}>
								<div>{params.group}</div>
								<div>{params.children}</div>
							</div>

						)}
						id="select-list-input"

						onChange={(ev, option) => setSelectedListId(option?.id ?? "")}
						sx={{ width: 300 }}

						renderInput={(params) => <TextField key={`item-${params.id}`} {...params} color="info" label="List" />}
					/>
				</header>

				{selectedList && <RandomPicker list={selectedList} />}





			</div>
		</div>
	);
};

const RandomPicker: FC<{ list: List }> = ({ list }) => {
	const [ignoreCompleted, setIgnoreCompleted] = useState(true)
	const [quantity, setQuantity] = useState("")


	const filteredList = useMemo(() => {
		const filtered = list;
		if (!ignoreCompleted) return filtered;

		filtered.people = filtered.people.filter(person => !person.isCompleted)
		return filtered;
	}, [list, ignoreCompleted])

	const isQuantityValid = useMemo(() => {
		if (quantity === ``) return false;
		const number = parseInt(quantity);
		return number > 0 && number < filteredList.people.length

	}, [filteredList, quantity])


	useEffect(() => {

		if (quantity.trim() === ``) return
		if (isQuantityValid) return;

		setQuantity(prev => {
			if (prev.trim() === ``) return prev;
			let number = parseInt(prev);
			number = (number < 1) ? 1 : (number > filteredList.people.length) ? filteredList.people.length : number
			return number.toString();
		})
	}, [quantity, filteredList.people.length, isQuantityValid])

	function incrementQuantity(n: number) {
		setQuantity(prev => {
			if (prev.trim() === ``) return "1";
			const number = parseInt(prev);
			if (number + n >= 1 && number + n <= filteredList.people.length)
				return (number + n).toString();
			return number.toString()
		})
	}

	return (
		<div className='flex flex-col items-center py-3'>
			<div className='w-full flex flex-col justify-center items-center gap-2'>
				<QuantityInput quantity={quantity} setQuantity={setQuantity} incrementQuantity={incrementQuantity} />
				<button disabled={!isQuantityValid} className='px-4 py-1 bg-emerald-900 hover:bg-emerald-800 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-xl font-mono'>Pick</button>
			</div>

		</div>
	)
}






export default PickPage;
