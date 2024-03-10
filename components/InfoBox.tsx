import Link from "next/link";

export const InfoBox = (props: any) => {
	const {
		heading,
		backgroundColor = 'bg-gray-100',
		textColor = 'text-gray-800',
		buttonInfo,
		children
	} = props;
	return (
		<div className={`${backgroundColor} p-6 rounded-lg shadow-md`}>
			<h2 className={`${textColor} text-2xl font-bold`}>{heading}</h2>
			<p className="mt-2 mb-4">
				{children}
			</p>
			<Link
				href={buttonInfo.link}
				className={`${buttonInfo.backgroundColor} btn-black`}
			>
				{buttonInfo.text}
			</Link>
		</div>
	)
}