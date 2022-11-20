import { type NextPage } from "next";
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import PickList from '../components/PickList';
import QuantityInput from '../components/QuantityInput';
import type { List, Person } from '../types';
import { getPeopleCount } from '../utils/lists';



const PickPage: NextPage = () => {

	// const [ignoreCompleted, setIgnoreCompleted] = useState(false)

	const [selectedList, setSelectedList] = useState<List | undefined>(undefined)


	const selectedListPeopleLength = useMemo(() => selectedList ? getPeopleCount(selectedList) : 0, [selectedList])



	const [quantity, setQuantity] = useState("")


	const isQuantityValid = useMemo(() => {
		if (quantity === ``) return false;
		const number = parseInt(quantity);

		return number > 0 && number <= selectedListPeopleLength

	}, [quantity, selectedListPeopleLength])


	return (
		<div className="w-full h-full">
			<div className='px-2 py-1 pt-2 w-full h-full min-w-[300px]'>
				<header className='flex justify-center items-center'>

					<PickList setSelectedList={setSelectedList} />
					<QuantityInput list={selectedList} onChange={setQuantity} onlyIncompleteList />
				</header>

				<RandomPicker isQuantityValid={isQuantityValid} quantity={quantity} list={selectedList} />

			</div>
		</div>
	);
};

const RandomPicker: FC<{ list?: List, quantity: string, isQuantityValid: boolean }> = ({ list, quantity, isQuantityValid }) => {
	const [extractedPeople, setExtractedPeople] = useState<Person[]>([])




	function onPickBtnClick() {
		const selectedPeople: Person[] = [];
		for (let i = 0; i < parseInt(quantity); i++) {

			const usableIndexes = [...Array(list?.people.length).keys()].filter(index => {
				const person = list?.people.at(index)
				if (!person) return false;
				return !selectedPeople.includes(person)
			})

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
			const randPerson = list?.people[usableIndexes[Math.floor(Math.random() * (usableIndexes.length))]!]!;

			selectedPeople.push(randPerson);
		}
		setExtractedPeople(selectedPeople)
	}


	return (
		<div className=''>
			<div className='py-1'></div>
			<div className='w-full flex flex-col justify-center items-center gap-2'>
				<button
					disabled={!isQuantityValid || !list}
					className='px-4 py-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed rounded text-xl font-mono'
					onClick={onPickBtnClick}
				>Pick</button>
			</div>

			<div className='py-1'></div>
			<div className='flex flex-col grow overflow-y-auto max-h-96 relative rounded border-zinc-900/40 border'>
				{extractedPeople.length > 0 && (
					<table className='border-b border-x border-emerald-900'>
						<thead className='sticky top-0 left-0'>
							<tr className='bg-emerald-700 text-center'>
								<td className='px-2 py-1'>N</td>
								<td className='px-2 py-1 '>Name</td>
							</tr>
						</thead>
						<tbody >
							{
								extractedPeople.map((person, index) => (
									<tr key={index} className="last:border-none border-b border-green-900/40">
										<td className='px-2 py-1 text-center border-r border-green-900/80'>{index + 1}</td>
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
