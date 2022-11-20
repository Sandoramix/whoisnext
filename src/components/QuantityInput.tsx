
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { type List } from '../types';
import { getPeopleCount } from '../utils/lists';

type QuantityInputProps = {

	list?: List,
	onlyIncompleteList?: boolean,
	onChange: (val: string) => void,
}


const QuantityInput: FC<QuantityInputProps> = ({ onChange, list, onlyIncompleteList }) => {
	const inputRef = useRef<HTMLInputElement>(null)


	useEffect(() => {
		if (!inputRef.current) return
		inputRef.current.value = ``
	}, [list])

	function fixNumber(value: string) {
		const quantity = parseInt(value);
		if (!list || value.trim() === ``) return "";
		return String((quantity < 1) ? 1 : (quantity > getPeopleCount(list, onlyIncompleteList)) ? getPeopleCount(list, onlyIncompleteList) : quantity)
	}

	function onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
		const value = ev.currentTarget.value;
		const finalValue = fixNumber(value)
		onChange(finalValue)
		ev.currentTarget.value = finalValue
	}

	function incrementQuantity(n: number) {
		if (!inputRef.current) return;

		const value = inputRef.current.value.trim();
		const number = value === `` ? 0 : parseInt(value) + n;

		const finalValue = fixNumber(number.toString())
		onChange(finalValue)
		inputRef.current.value = finalValue
	}


	return (
		<div id="quantity-input" className='relative w-3/4 max-w-xs h-14  min-w-[150px]  text-xl bg-white/10 px-[2ch] rounded focus-within:outline-white border border-white/10'>
			<button className='absolute top-1/2 left-0 -translate-y-1/2 text-4xl font-bold text-red-600 hover:text-red-500 p-1 disabled:text-gray-500'
				onClick={() => incrementQuantity(-1)}
				disabled={!list}
			>-</button>
			<input
				disabled={!list}
				onChange={onInputChange}
				onInput={onInputChange}
				autoComplete="off"
				type="number"
				name="name"
				id="name"
				ref={inputRef}
				className="bg-transparent text-center text-base h-full w-full text-white placeholder:text-center placeholder:uppercase focus:outline-none disabled:line-through"
				placeholder='Quantity'
			/>
			<button className='absolute top-1/2 right-0 -translate-y-1/2 text-4xl font-bold text-green-600 hover:text-green-500 p-1 disabled:text-gray-500'
				onClick={() => incrementQuantity(1)}
				disabled={!list}
			>+</button>
		</div>
	)
}

export default QuantityInput;