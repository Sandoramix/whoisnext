import type { FC } from "react"

const LayerOver: FC<{ children: JSX.Element | JSX.Element[], closeView?: () => void, customInnerDiv?: boolean, noBackdrop?: boolean }> = ({ children, noBackdrop, customInnerDiv, closeView }) => {

	return (
		<div
			className={`w-full h-full z-30 absolute left-0 top-0 ${noBackdrop ? `` : `backdrop-blur-sm`} flex justify-center items-center min-w-[300px] min-h-[600px]`}
			onClick={closeView}
		>
			{customInnerDiv
				? children
				: (
					<div
						className="transition-all duration-500 rounded h-[91%] w-full min-w-[315px] max-w-[800px] relative overflow-visible bg-[#000d29]/80 flex flex-col justify-between  px-4 py-2 text-center"
						onClick={(ev) => ev.stopPropagation()}
					>

						{children}

					</div >
				)
			}
		</div>
	)
}


export default LayerOver