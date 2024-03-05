'use client'

import {ClipLoader} from "react-spinners";

const override = {
	display: 'block',
	margin: '100px auto'
};

const Loading = ({ loading = true }: { loading: boolean}) => {
	return <ClipLoader
		color={'#3b82f6'}
		loading={true}
		cssOverride={override}
		size={150}
		aria-label={"Loading Spinner"}
	/>
}

export default Loading;