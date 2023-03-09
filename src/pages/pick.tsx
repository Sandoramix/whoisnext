import { Tooltip } from "@mui/material";
import { type NextPage } from "next";
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { AiOutlineCopy, AiOutlineDownload } from "react-icons/ai";
import type { IconType } from "react-icons/lib";
import PickList from '../components/PickList';
import QuantityInput from '../components/QuantityInput';
import type { List, ListItem } from '../types';
import { getISODateString } from "../utils/dates";
import { getListItemsCount } from '../utils/lists';
import { MSG } from "../utils/messages";



const PickPage: NextPage = () => {

	// const [ignoreCompleted, setIgnoreCompleted] = useState(false)
	const [selectedList, setSelectedList] = useState<List | null>(null)

	const selectedListListItemsLength = useMemo(() => selectedList ? getListItemsCount(selectedList) : 0, [selectedList])

	const [extractedListItems, setExtractedListItems] = useState<ListItem[]>([])

	const [quantity, setQuantity] = useState("")



	const isQuantityValid = useMemo(() => {
		if (quantity === ``) return false;
		const number = parseInt(quantity);

		return number > 0 && number <= selectedListListItemsLength

	}, [quantity, selectedListListItemsLength])


	useEffect(() => {
		setExtractedListItems([])
	}, [selectedList])


	function updateSelectedList(list: List | null) {
		setQuantity("")
		setSelectedList(list)
	}

	const selectedListToString = () => {
		if (!selectedList) return "";
		let final = `${MSG.extractedListItems(selectedList.title)}`
		extractedListItems.forEach((listItem, index) => {
			const n = index + 1
			final += `\n${n} - ${listItem.name}`
		})
		return final;
	}

	const onDownloadClick = () => {
		if (!selectedList) return;
		const textToSave = selectedListToString();
		const textToSaveAsBlob = new Blob([textToSave], { type: "text/plain" });
		const fileNameToSaveAs = `${selectedList.title}_${getISODateString()}`;

		const downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		downloadLink.href = window.URL.createObjectURL(textToSaveAsBlob);
		downloadLink.addEventListener('click', (ev) => {
			if (!ev.currentTarget) return;
			document.body.removeChild(ev.target as Node);
		});
		downloadLink.style.display = "none";

		document.body.appendChild(downloadLink);
		downloadLink.click();
	}

	const onCopyClick = () => {
		if (!selectedList) return;

		navigator.clipboard.writeText(selectedListToString())
	}

	function onPickBtnClick() {
		if (!selectedList) return;


		const shuffledListItemsList = [...selectedList.items].sort(() => 0.5 - Math.random())
		const extracted = shuffledListItemsList.slice(0, parseInt(quantity));


		setExtractedListItems(extracted)
	}


	return (

		<div className='flex flex-col w-full h-full  bg-gradient-to-b to-[#0f0c4c] from-[#06001a]'>

			<section className='bg-[#060018] flex flex-col py-2 px-4  gap-2 justify-center  items-center sticky top-0 left-0 w-full'>

				<PickList setSelectedList={updateSelectedList} onlyIncompleteListItems />

				<QuantityInput selectedList={selectedList} setValue={setQuantity} onlyIncompleteListItems  >
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



				{extractedListItems.length > 0 && (
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

										<div className="absolute  -translate-y-1/2 right-2 top-1/2 flex gap-2">
											<PickedListAction Icon={AiOutlineDownload} onClick={onDownloadClick} tooltip="Download as a file" tooltipClicked="Done!" />
											<PickedListAction Icon={AiOutlineCopy} onClick={onCopyClick} tooltip="Copy to clipboard" tooltipClicked="Done!" />
										</div>
									</td>
								</tr>
							</thead>
							<tbody className="">
								{
									extractedListItems.map((listItem, index) => (
										<tr key={index} className="border-b last:border-none border-green-900/40">
											<td>
												<div className="px-2 py-1 text-center border-r border-green-900/80 max-w-[80px] w-[80px] ">
													{index + 1}
												</div>
											</td>
											<td className='w-full px-2 py-1 text-center'>{listItem.name}</td>
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


const PickedListAction: FC<{ onClick: () => void, tooltip: string, tooltipClicked?: string, Icon: IconType }> = ({ onClick, tooltip, tooltipClicked, Icon }) => {
	const [clicked, setClicked] = useState(false);

	useEffect(() => {
		if (!clicked) return;
		const timeout = setTimeout(() => {
			setClicked(false);
		}, 2500)

		return () => clearTimeout(timeout)
	}, [clicked])

	const onActionClick = () => {
		setClicked(true);
		onClick();
	}

	return <Tooltip
		arrow
		placeholder="top-start"
		title={clicked ? tooltipClicked ?? tooltip : tooltip}
		className="text-3xl text-yellow-500"
		onClick={onActionClick}
		onMouseEnter={() => setClicked(false)}
	>
		<button>
			<Icon />
		</button>
	</Tooltip>
}
