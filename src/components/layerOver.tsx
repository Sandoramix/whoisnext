import type { FC } from "react"

const LayerOver: FC<{ children: JSX.Element | JSX.Element[], closeView?: () => void }> = ({ children, closeView }) => {

	return (
		<div

			className={`w-full h-full z-30 absolute left-0 top-0 bg-black/70 flex justify-center items-center min-w-[300px] min-h-[600px]`}
			onClick={closeView}
		>
			{children}
		</div>
	)
}


export default LayerOver