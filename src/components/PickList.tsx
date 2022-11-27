import { Autocomplete, TextField } from "@mui/material";
import type { FC } from "react";
import { useLists } from '../lib/ListsContext';
import type { List } from "../types";
import { getPeopleCount } from "../utils/lists";

type PickListProps = {
	onlyIncompletePeople?: boolean,
	setSelectedList: (list?: List) => void,
	fullWidth?: boolean,
}

const PickList: FC<PickListProps> = ({ setSelectedList, onlyIncompletePeople, fullWidth }) => {
	const { lists } = useLists();

	const options = lists.map((_list => {
		const list = { ..._list }
		const total = getPeopleCount(list, false)
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const firstLetter = list.title[0]!
		if (onlyIncompletePeople) {
			list.people = list.people.filter(p => !p.isCompleted)
		}
		return {
			firstLetter: /[0-9]/.test(firstLetter) ? `0-9` : firstLetter.toUpperCase(),
			title: list.title,
			id: list.id,
			total,
			incompleted: getPeopleCount(list),
			list
		}
	}))




	return (
		<Autocomplete
			key={`autocomplete-list`}
			className={` bg-[#021130] rounded text-white placeholder:text-white relative w-full min-w-[310px] ${fullWidth ? `` : `max-w-[700px]`}  border border-white/10`}
			isOptionEqualToValue={(option, value) => value.id === option.id}
			clearOnEscape
			openOnFocus
			autoComplete
			selectOnFocus
			handleHomeEndKeys
			autoSelect
			options={options.sort((a, b) => a.firstLetter.localeCompare(b.firstLetter))}
			groupBy={(option) => option.firstLetter}
			getOptionLabel={(option) => option.title}

			renderOption={(props, option) => (
				<li
					{...props}
					key={`opt-${option.id}`}
					className="relative border-b last:border-none border-white/30 "
				>
					<div key={`opt-${option.id}`} className="flex items-center justify-between gap-2 py-2 pl-3 pr-2 text-center cursor-pointer bg-zinc-800 hover:bg-zinc-700">
						<hr className='absolute w-1 left-1' />
						<h4 className="font-bold capitalize text-ellipsis max-w-[90%] overflow-hidden whitespace-nowrap" >{option.title}</h4>
						<div className='flex items-center justify-end text-sm gap-1'>
							<h5 className=" text-[greenyellow]">{option.total - option.incompleted}</h5>/<h5>{option.total}</h5>
						</div>
					</div>
				</li>
			)}
			renderGroup={(params) => (
				<div className='text-white ' key={`group-${params.group}`}>
					<div className='px-1 font-bold bg-zinc-900' key={`grp-${params.group}-g`}>{params.group}</div>
					<div className='bg-zinc-800 ' key={`grp-${params.group}-t`}>{params.children}</div>
				</div>

			)}
			id="select-list-input"

			onChange={(ev, option) => setSelectedList(option?.list)}

			renderInput={(params) => <TextField className='' key={`item-${params.id}`} {...params} color="info" label="List" />}
		/>
	)
}


export default PickList