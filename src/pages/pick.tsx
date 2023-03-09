import { Tooltip } from "@mui/material";
import { type NextPage } from "next";
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineCopy } from "react-icons/ai";
import PickList from '../components/PickList';
import QuantityInput from '../components/QuantityInput';
import type { List, Person } from '../types';
import { getPeopleCount } from '../utils/lists';
import { MSG } from "../utils/messages";



const PickPage: NextPage = () => {

	// const [ignoreCompleted, setIgnoreCompleted] = useState(false)
	const [selectedList, setSelectedList] = useState<List | null>(null)

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


	function updateSelectedList(list: List | null) {
		setQuantity("")
		setSelectedList(list)
	}
	function onCopyClick() {
		if (!selectedList) return;

		let final = `${MSG.extractedPeople(selectedList.title)}`
		extractedPeople.forEach((person, index) => {
			const n = index + 1
			final += `\n${n} - ${person.name}`
		})
		navigator.clipboard.writeText(final)

		setIsCopyClicked(true)
		setTimeout(() => {
			setIsCopyClicked(false)
		}, 4000);
	}

	function onPickBtnClick() {
		if (!selectedList) return;


		const shuffledPeopleList = [...selectedList.people].sort(() => 0.5 - Math.random())
		const extracted = shuffledPeopleList.slice(0, parseInt(quantity));


		setExtractedPeople(extracted)
	}


	return (

		<div className='flex flex-col w-full h-full  bg-gradient-to-b to-[#0f0c4c] from-[#06001a]'>

			<section className='bg-[#060018] flex flex-col py-2 px-4  gap-2 justify-center  items-center sticky top-0 left-0 w-full'>

				<PickList setSelectedList={updateSelectedList} onlyIncompletePeople />

				<QuantityInput selectedList={selectedList} setValue={setQuantity} onlyIncompletePeople  >
					<button
						disabled={!isQuantityValid || !selectedList}
						className='block w-full h-10 px-4 py-1 font-mono text-xl rounded-b sm:h-12 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 '
						onClick={onPickBtnClick}
					>
						Pick
					</button>
				</QuantityInput>
			</section>


			<div className="h-1/5 sm:h-full"></div>

			<div className="px-1 sm:px-4 py-4 flex flex-col w-full grow self-end max-h-[calc(100vh_-_90px_-_250px)] min-h-[calc(100vh_-_90px_-_250px)] justify-start items-center">



				{extractedPeople.length > 0 && (
					<div className=' pointer-events-auto  my-auto relative flex flex-col w-full min-w-[315px] min-h-[250px]  max-w-[800px] overflow-y-auto h-full  max-h-[calc(100vh_-_90px_-_250px)] grow justify-start items-start'>

						<table className='border-b border-x border-emerald-900 bg-zinc-900'>
							<thead className='sticky left-0 -top-0'>
								<tr className='text-center bg-emerald-700 '>
									<td className='' >
										<div className=" max-w-[80px] w-[80px] h-10 border-r border-black flex justify-center items-center">
											<h3>&nbsp;&nbsp;N°</h3>
										</div>
									</td>
									<td className='relative w-full h-10'>
										<h3>Name</h3>
										<Tooltip
											arrow
											placeholder="top-start"
											title={isCopyClicked ? `Done!` : `Copy to clipboard`}
											className="absolute text-3xl text-yellow-500 -translate-y-1/2 right-2 top-1/2"
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
											<td className='w-full px-2 py-1 text-center'>{person.name}</td>
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
