import { type NextPage } from "next";
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
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


	function updateSelectedList(list?: List) {
		setQuantity("")
		setSelectedList(list)
	}


	return (
		<div className="w-full full ">
			<div className='flex flex-col w-full h-full gap-2 px-2 pt-2'>
				<header className='flex items-center justify-center gap-1 px-1'>

					<PickList setSelectedList={updateSelectedList} onlyIncompletePeople />
					<QuantityInput list={selectedList} setValue={setQuantity} onlyIncompletePeople />
				</header>

				<RandomPicker isQuantityValid={isQuantityValid} quantity={quantity} list={selectedList} onlyIncompletePeople />

			</div>
		</div>
	);
};

const RandomPicker: FC<{ list?: List, quantity: string, isQuantityValid: boolean, onlyIncompletePeople?: boolean }> = ({ list, quantity, isQuantityValid }) => {
	const [extractedPeople, setExtractedPeople] = useState<Person[]>([])



	useEffect(() => {
		setExtractedPeople([])
	}, [list])


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
		<div className='flex flex-col gap-2'>
			<div className='flex flex-col items-center justify-center w-full'>
				<button
					disabled={!isQuantityValid || !list}
					className='px-4 py-1 font-mono text-xl rounded bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-700 disabled:cursor-not-allowed'
					onClick={onPickBtnClick}
				>Pick</button>
			</div>


			<div>
				{extractedPeople.length > 0 && (
					<div className='relative flex flex-col overflow-y-auto border rounded max-h-96 grow border-zinc-900/40'>

						<table className='border-b border-x border-emerald-900'>
							<thead className='sticky top-0 left-0'>
								<tr className='text-center bg-emerald-700'>
									<td className='' >
										<div className=" max-w-[80px] px-2 py-1 border-r border-black">
											&nbsp;&nbsp;N°
										</div>
									</td>
									<td className='px-2 py-1 '>Name</td>
								</tr>
							</thead>
							<tbody >
								{
									extractedPeople.map((person, index) => (
										<tr key={index} className="border-b last:border-none border-green-900/40">
											<td>
												<div className="px-2 py-1 text-center border-r border-green-900/80 max-w-[80px]">
													{index + 1}
												</div>
											</td>
											<td className='px-2 py-1 text-center'>{person.name}</td>
										</tr>)
									)
								}
							</tbody>
						</table>

					</div>
				)}
			</div>
		</div>
	)
}






export default PickPage;
