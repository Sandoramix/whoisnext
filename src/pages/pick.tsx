import { Tooltip } from "@mui/material";
import { type NextPage } from "next";
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineCopy } from "react-icons/ai";
import { BiCopy } from "react-icons/bi";
import PickList from '../components/PickList';
import QuantityInput from '../components/QuantityInput';
import type { List, Person } from '../types';
import { getPeopleCount } from '../utils/lists';
import { MSG } from "../utils/messages";



const PickPage: NextPage = () => {

	// const [ignoreCompleted, setIgnoreCompleted] = useState(false)

	const [selectedList, setSelectedList] = useState<List | undefined>(undefined)


	const selectedListPeopleLength = useMemo(() => selectedList ? getPeopleCount(selectedList) : 0, [selectedList])

	const [extractedPeople, setExtractedPeople] = useState<Person[]>([])

	const [quantity, setQuantity] = useState("")

	const [isCopyClicked, setIsCopyClicked] = useState(false);



	const isQuantityValid = useMemo(() => {
		if (quantity === ``) return false;
		const number = parseInt(quantity);

		return number > 0 && number <= selectedListPeopleLength

	}, [quantity, selectedListPeopleLength])


	useEffect(() => {
		setExtractedPeople([])
	}, [selectedList])


	function updateSelectedList(list?: List) {
		setQuantity("")
		setSelectedList(list)
	}
	function onCopyClick() {
		if (!selectedList) return;

		let final = `${MSG.extractedPeople(selectedList.title)}`
		extractedPeople.forEach((person, index) => {
			final += `\n${index + 1}\t─\t${person.name}`
		})
		navigator.clipboard.writeText(final)

		setIsCopyClicked(true)
		setTimeout(() => {
			setIsCopyClicked(false)
		}, 4000);
	}

	function onPickBtnClick() {
		if (!selectedList) return;

		const selectedPeople: Person[] = [];
		for (let i = 0; i < parseInt(quantity); i++) {

			const usableIndexes = [...Array(selectedList.people.length).keys()].filter(index => {
				const person = selectedList.people.at(index)
				if (!person) return false;
				return !selectedPeople.includes(person)
			})

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
			const randPerson = selectedList.people[usableIndexes[Math.floor(Math.random() * (usableIndexes.length))]!]!;

			selectedPeople.push(randPerson);
		}
		setExtractedPeople(selectedPeople)
	}


	return (

		<div className='flex flex-col w-full h-full px-1 sm:px-4 py-4 '>
			<section className='flex flex-col  gap-2 justify-center  items-center'>

				<PickList setSelectedList={updateSelectedList} onlyIncompletePeople />

				<QuantityInput list={selectedList} setValue={setQuantity} onlyIncompletePeople  >
					<button
						disabled={!isQuantityValid || !selectedList}
						className='rounded-b w-full h-10 sm:h-12 px-4 py-1 font-mono text-xl block  bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed  disabled:text-gray-400 '
						onClick={onPickBtnClick}
					>
						Pick
					</button>
				</QuantityInput>
			</section>


			<div className="h-1/5 sm:h-full"></div>

			<div className="flex flex-col w-full items-center justify-self-end self-end">
				{extractedPeople.length > 0 && (
					<div className='relative flex flex-col w-full min-w-[315px] max-w-[800px] overflow-y-auto border rounded max-h-[calc(100vh_-_90px_-_250px)] grow border-zinc-900/40 justify-start items-center'>

						<table className='border-b border-x border-emerald-900'>
							<thead className='sticky -top-0 left-0 '>
								<tr className='text-center bg-emerald-700 '>
									<td className='' >
										<div className=" max-w-[80px] w-[80px] h-10 border-r border-black flex justify-center items-center">
											<h3>&nbsp;&nbsp;N°</h3>
										</div>
									</td>
									<td className='h-10 w-full relative'>
										<h3>Name</h3>
										<Tooltip
											arrow
											placeholder="top-start"
											title={isCopyClicked ? `Done!` : `Copy to clipboard`}
											className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl text-yellow-500"
											onClick={onCopyClick}
											onMouseEnter={() => setIsCopyClicked(false)}
										>
											<button>
												<AiOutlineCopy />
											</button>
										</Tooltip>
									</td>
								</tr>
							</thead>
							<tbody className="">
								{
									extractedPeople.map((person, index) => (
										<tr key={index} className="border-b last:border-none border-green-900/40">
											<td>
												<div className="px-2 py-1 text-center border-r border-green-900/80 max-w-[80px] w-[80px] ">
													{index + 1}
												</div>
											</td>
											<td className='px-2 py-1 text-center w-full'>{person.name}</td>
										</tr>)
									)
								}
							</tbody>
						</table>

					</div>
				)}
			</div>
		</div>

	);
};




export default PickPage;
