import { Autocomplete, TextField } from "@mui/material";
import type { FC } from "react";
import type { Day } from "../types";
import { weekDays } from '../types';

type PickDayProps = {
	setSelectedDays: (days: Day[]) => void,
	fullWidth?: boolean,
}

const PickDay: FC<PickDayProps> = ({ setSelectedDays, fullWidth }) => {

	const options = weekDays.map(day => day)


	return (
		<Autocomplete
			key={`autocomplete-list`}
			className={` rounded relative w-full min-w-[310px] ${fullWidth ? `` : `max-w-[700px]`}  outline outline-white/20`}
			isOptionEqualToValue={(option, value) => value === option}
			clearOnEscape
			openOnFocus
			autoComplete
			selectOnFocus
			handleHomeEndKeys
			autoSelect
			multiple
			options={options}
			getOptionLabel={(option) => option}

			renderOption={(props, option) => (
				<li
					{...props}
					key={`opt-${option}`}
					className="relative border-b last:border-none border-white/30 "
				>
					<div key={`opt-${option}`} className="flex items-center justify-between gap-2 py-2 pl-3 pr-2 text-center cursor-pointer bg-zinc-800 hover:bg-zinc-700">
						<h4 className="font-bold capitalize text-ellipsis max-w-[90%] overflow-hidden whitespace-nowrap text-white" >{option}</h4>
					</div>
				</li>
			)}

			id="select-day"

			onChange={(ev, options) => setSelectedDays(options)}


			renderInput={(params) => <TextField className='' key={`item-${params.id}`} {...params} label="Days" />}
		/>
	)
}


export default PickDay