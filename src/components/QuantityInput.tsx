
import type { FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import { type List } from '../types';
import { getPeopleCount } from '../utils/lists';

type QuantityInputProps = {

	list?: List,
	onlyIncompletePeople?: boolean,
	setValue: (val: string) => void,
	fullWidth?: boolean
}


const QuantityInput: FC<QuantityInputProps> = ({ setValue, list, onlyIncompletePeople, fullWidth }) => {
	const inputRef = useRef<HTMLInputElement>(null)


	const peopleCount = useMemo(() => !list ? -1 : getPeopleCount(list, onlyIncompletePeople), [list, onlyIncompletePeople])


	useEffect(() => {
		if (!inputRef.current) return
		inputRef.current.value = ``
	}, [list])

	function fixQuantity(value: string) {
		const quantity = parseInt(value);
		if (!list || peopleCount === 0 || value.trim() === ``) return "";
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
		<div id="quantity-input" className={`relative ${fullWidth ? `w-full` : `w-1/2`} grow h-14  text-xl bg-white/10 px-[2ch] rounded focus-within:outline-white border border-white/10`}>
			<button className='absolute left-0 p-1 text-4xl font-bold text-red-600 -translate-y-1/2 top-1/2 hover:text-red-500 disabled:text-gray-500'
				onClick={() => incrementQuantity(-1)}
				disabled={!list || peopleCount === 0}
			>-</button>
			<input
				disabled={!list || peopleCount === 0}
				onChange={onInputChange}
				onInput={onInputChange}
				autoComplete="off"
				type="number"
				name="name"
				id="name"
				ref={inputRef}
				className="w-full h-full text-base text-center text-white bg-transparent placeholder:text-center placeholder:uppercase focus:outline-none disabled:line-through"
				placeholder='Quantity'
			/>
			<button className='absolute right-0 p-1 text-4xl font-bold text-green-600 -translate-y-1/2 top-1/2 hover:text-green-500 disabled:text-gray-500'
				onClick={() => incrementQuantity(1)}
				disabled={!list || peopleCount === 0}
			>+</button>
		</div>
	)
}

export default QuantityInput;