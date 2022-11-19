
import type { Dispatch, FC, SetStateAction } from 'react';
import { useRef } from 'react';
import { type List } from '../../types';

type QuantityInputProps = {
	quantity: string,
	list?: List,
	setQuantity:
	Dispatch<SetStateAction<string>>,
	incrementQuantity: (n: number) => void
}
const QuantityInput: FC<QuantityInputProps> = ({ quantity, setQuantity, incrementQuantity, list }) => {
	const quantityRef = useRef<HTMLInputElement>(null);



	function onQuantityChange() {
		const value = quantityRef.current?.value

		setQuantity(value ?? "")
	}

	return (
		<div id="quantity-input" className='relative w-3/4 max-w-xs h-14  min-w-[150px]  text-xl bg-white/10 px-[2ch] rounded focus-within:outline-white border border-white/20'>
			<button className='absolute top-1/2 left-0 -translate-y-1/2 text-4xl font-bold text-red-600 hover:text-red-500 p-1'
				onClick={() => incrementQuantity(-1)}
				disabled={!list}
			>-</button>
			<input
				disabled={!list}
				onChange={onQuantityChange}
				onInput={onQuantityChange}
				autoComplete="off"
				type="number"
				name="name"
				id="name"
				value={quantity}

				ref={quantityRef}
				className="bg-transparent text-center text-base h-full w-full text-white placeholder:text-center placeholder:uppercase focus:outline-none "
				placeholder='Quantity'
			/>
			<button className='absolute top-1/2 right-0 -translate-y-1/2 text-4xl font-bold text-green-600 hover:text-green-500 p-1'
				onClick={() => incrementQuantity(1)}
				disabled={!list}
			>+</button>
		</div>
	)
}

export default QuantityInput;