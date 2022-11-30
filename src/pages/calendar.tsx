import { type NextPage } from "next";
import { useMemo, useState } from 'react';
import LayerOver from "../components/layerOver";
import PickDay from "../components/PickDay";
import PickList from "../components/PickList";
import type { Day, List, Person } from '../types';
import { getPeopleCount } from '../utils/lists';
import { MSG } from "../utils/messages";



const CalendarPage: NextPage = () => {

	// const [ignoreCompleted, setIgnoreCompleted] = useState(false)
	const [selectedList, setSelectedList] = useState<List | null>(null)

	const selectedListPeopleLength = useMemo(() => selectedList ? getPeopleCount(selectedList) : 0, [selectedList])

	const [selectedDays, setSelectedDays] = useState<Day[]>([])

	const [extractedPeople, setExtractedPeople] = useState<Person[]>([])


	const [isCopyClicked, setIsCopyClicked] = useState(false);



	function updateSelectedDays(days: Day[]) {
		setSelectedDays(days)
	}

	function updateSelectedList(list: List | null) {
		setSelectedList(list)
	}
	function onCopyClick() {
		if (!selectedList) return;

		let final = `${MSG.extractedPeople(selectedList.title)}`
		extractedPeople.forEach((person, index) => {
			const n = index + 1
			final += `\n${n}\t─ ${person.name}`
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

	}


	return (

		<div className='flex flex-col w-full h-full px-1 sm:px-4 py-4 relative overflow-hidden'>
			<LayerOver customInnerDiv>
				<h1 className="text-3xl font-sub text-center uppercase">I&apos;m being implemented</h1>
			</LayerOver>

			<section className='flex flex-col  gap-2 justify-center  items-center'>
				<PickList setSelectedList={updateSelectedList} onlyIncompletePeople />
				<PickDay setSelectedDays={updateSelectedDays} />


				<button
					disabled={!selectedList}
					className='rounded-b w-full h-10 sm:h-12 px-4 py-1 font-mono text-xl block  bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed  disabled:text-gray-400 '
					onClick={onPickBtnClick}
				>
					Pick
				</button>
			</section>


			<div className="h-1/5 sm:h-full"></div>

			<div className="flex flex-col w-full grow self-end max-h-[calc(100vh_-_90px_-_250px)] min-h-[calc(100vh_-_90px_-_250px)] justify-start items-center">



				{/* {extractedPeople.length > 0 && (
					<div className=' pointer-events-auto  my-auto relative flex flex-col w-full min-w-[315px] min-h-[250px]  max-w-[800px] overflow-y-auto h-full rounded max-h-[calc(100vh_-_90px_-_250px)] grow justify-start items-start'>

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
				)} */}

			</div>

		</div>

	);
};




export default CalendarPage;
