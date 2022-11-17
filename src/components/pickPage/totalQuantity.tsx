
import type { Dispatch, FC, SetStateAction } from 'react';
import { useRef } from 'react';

type QuantityInputProps = {
	quantity: string,
	setQuantity:
	Dispatch<SetStateAction<string>>,
	incrementQuantity: (n: number) => void
}
const QuantityInput: FC<QuantityInputProps> = ({ quantity, setQuantity, incrementQuantity }) => {
	const quantityRef = useRef<HTMLInputElement>(null);



	function onQuantityChange() {
		const value = quantityRef.current?.value

		setQuantity(value ?? "")
	}

	return (
		<div id="quantity-input" className='relative w-3/4 max-w-xs h-12  min-w-[200px]  text-xl bg-white/10 px-[2ch] rounded focus-within:outline-white'>
			<button className='absolute top-1/2 left-0 -translate-y-1/2 text-6xl font-bold text-red-600 p-1'
				onClick={() => incrementQuantity(-1)}>-</button>
			<input
				onChange={onQuantityChange}
				onInput={onQuantityChange}
				autoComplete="off"
				type="number"
				name="name"
				id="name"
				value={quantity}

				ref={quantityRef}
				className="bg-transparent text-center h-full w-full text-white placeholder:text-center placeholder:uppercase focus:outline-none "
				placeholder='Quantity'
			/>
			<button className='absolute top-1/2 right-0 -translate-y-1/2 text-6xl font-bold text-green-600 p-1'
				onClick={() => incrementQuantity(1)}>+</button>
		</div>
	)
}

export default QuantityInput;