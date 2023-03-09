import type { FC } from "react"

const LayerOver: FC<{ children: JSX.Element | JSX.Element[], closeView?: () => void, customInnerDiv?: boolean, noBackdrop?: boolean }> = ({ children, noBackdrop, customInnerDiv, closeView }) => {

	return (
		<div
			className={`max-h-100dvh w-full sm:w-full h-full z-30 fixed inset-0 ${noBackdrop ? `` : `backdrop-blur-sm backdrop-brightness-50`} flex justify-center items-center`}
			onClick={closeView}
		>
			{customInnerDiv
				? children
				: (
					<div
						className="transition-all duration-500 rounded h-[95%] w-full min-w-[300px] min-h-[320px] max-w-[800px] relative overflow-y-auto bg-overlay bg-opacity-70  px-4 py-2 text-center border border-white/20"
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