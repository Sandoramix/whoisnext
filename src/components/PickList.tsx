import { Autocomplete, TextField } from "@mui/material";
import type { FC } from "react";
import { useLists } from '../lib/ListsContext';
import type { List } from "../types";
import { getPeopleCount } from "../utils/lists";

type PickListProps = {

	setSelectedList: (list?: List) => void,

}

const PickList: FC<PickListProps> = ({
	setSelectedList
}) => {
	const { lists } = useLists();
	const options = lists.map((list => {
		const firstLetter = list.title[0]!
		return {
			firstLetter: /[0-9]/.test(firstLetter) ? `0-9` : firstLetter.toUpperCase(),
			title: list.title,
			id: list.id,
			total: getPeopleCount(list, false),
			incomplete: getPeopleCount(list),
			list
		}
	}))




	return (
		<Autocomplete
			key={`autocomplete-list`}
			className="bg-[#021130] rounded text-white placeholder:text-white w-full max-w-md border border-white/10"
			isOptionEqualToValue={(option, value) => value.id === option.id}
			clearOnEscape
			autoComplete
			selectOnFocus
			handleHomeEndKeys
			options={options.sort((a, b) => a.firstLetter.localeCompare(b.firstLetter))}
			groupBy={(option) => option.firstLetter}
			getOptionLabel={(option) => option.title}

			renderOption={(props, option) => (
				<li
					{...props}
					key={`opt-${option.id}`}
					className="pl-3 pr-2 last:border-none border-b border-white/30 relative py-2"
				>
					<div key={`opt-${option.id}`} className="flex gap-2 justify-between items-center text-center bg-zinc-800 ">
						<hr className='absolute left-1 w-1' />
						<h4 className="font-bold capitalize text-ellipsis max-w-[90%] overflow-hidden whitespace-nowrap" >{option.title}</h4>
						<div className=' '>
							<h5 className="text-xs text-[greenyellow]">{option.incomplete}</h5>
						</div>
					</div>
				</li>
			)}
			renderGroup={(params) => (
				<div className='text-white ' key={`group-${params.group}`}>
					<div className='bg-zinc-900 px-2 font-bold' key={`grp-${params.group}-g`}>{params.group}</div>
					<div className='bg-zinc-800 ' key={`grp-${params.group}-t`}>{params.children}</div>
				</div>

			)}
			id="select-list-input"

			onChange={(ev, option) => setSelectedList(option?.list)}
			sx={{ width: 300 }}

			renderInput={(params) => <TextField className='' key={`item-${params.id}`} {...params} color="info" label="List" />}
		/>
	)
}


export default PickList