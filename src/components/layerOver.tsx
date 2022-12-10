import type { FC } from "react"

const LayerOver: FC<{ children: JSX.Element | JSX.Element[], closeView?: () => void, customInnerDiv?: boolean, noBackdrop?: boolean }> = ({ children, noBackdrop, customInnerDiv, closeView }) => {

	return (
		<div
			className={`w-[99%] sm:w-full h-full z-30 absolute left-0 top-0 ${noBackdrop ? `` : `backdrop-blur-sm backdrop-brightness-50`} flex justify-center items-center min-w-[300px] min-h-[600px]`}
			onClick={closeView}
		>
			{customInnerDiv
				? children
				: (
					<div
						className="transition-all duration-500 rounded h-[90%] w-full min-w-[300px] max-w-[800px] min-h-[600px] relative overflow-visible bg-overlay bg-opacity-80 flex flex-col justify-between px-4 py-2 text-center border border-white/20"
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