
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { type List } from '../types';
import { getPeopleCount } from '../utils/lists';

type QuantityInputProps = {
	selectedList: List | null,
	onlyIncompletePeople?: boolean,
	setValue: (val: string) => void,
	fullWidth?: boolean,
	children: JSX.Element | JSX.Element[]
}


const QuantityInput: FC<QuantityInputProps> = ({ setValue, onlyIncompletePeople, fullWidth, children, selectedList }) => {

	const inputRef = useRef<HTMLInputElement>(null)


	const peopleCount = useMemo(() => !selectedList ? -1 : getPeopleCount(selectedList, onlyIncompletePeople), [selectedList, onlyIncompletePeople])


	useEffect(() => {
		if (!inputRef.current) return
		inputRef.current.value = ``
	}, [selectedList])

	function fixQuantity(value: string) {
		const quantity = parseInt(value);
		if (!selectedList || peopleCount === 0 || value.trim() === ``) return "";
		return String((quantity > peopleCount) ? peopleCount : (quantity < 1) ? 1 : quantity)
	}

	function handleQuantity(value: string, element: HTMLInputElement) {
		const finalValue = fixQuantity(value)
		setValue(finalValue)
		element.value = finalValue
	}

	function onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
		const value = ev.currentTarget.value.trim();
		handleQuantity(value, ev.currentTarget)
	}

	function incrementQuantity(n: number) {
		if (!inputRef.current) return;

		const value = inputRef.current.value.trim();
		const number = value === `` ? 0 : parseInt(value) + n;
		handleQuantity(number.toString(), inputRef.current)
	}


	return (
		<div className={`${!selectedList ? `opacity-0` : ``} w-full min-w-[280px] ${fullWidth ? `` : `max-w-[550px]`} flex flex-col text-xl bg-white/10 rounded focus-within:outline-white border border-white/10 `}>

			<div id="quantity-input" className='flex grow justify-center items-center relative h-12 sm:h-16 transition-all duration-200 w-full px-[2ch]'>
				<button className='absolute left-0 p-1 text-4xl font-bold text-red-600 -translate-y-1/2 top-1/2 hover:text-red-500 disabled:text-gray-500'
					onClick={() => incrementQuantity(-1)}
					disabled={!selectedList || peopleCount === 0}
				>-</button>
				<input
					disabled={!selectedList || peopleCount === 0}
					onChange={onInputChange}
					onInput={onInputChange}
					autoComplete="off"
					type="number"
					name="name"
					id="name"
					ref={inputRef}
					className="w-full h-full font-mono text-base text-center text-white bg-transparent placeholder:text-center placeholder:uppercase focus:outline-none disabled:line-through"
					placeholder='Quantity'
				/>
				<button className='absolute right-0 p-1 text-4xl font-bold text-green-600 -translate-y-1/2 top-1/2 hover:text-green-500 disabled:text-gray-500'
					onClick={() => incrementQuantity(1)}
					disabled={!selectedList || peopleCount === 0}
				>+</button>
			</div>
			<hr className='border-white/20' />
			<div id="quantity-input" className='flex grow justify-center items-center w-full'>
				{children}
			</div>

		</div>
	)
}

export default QuantityInput;