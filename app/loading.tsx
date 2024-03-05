'use client'

import Spinner from "@/components/Spinner";

const Loading = ({ loading = true }: { loading: boolean }) => {
	return <Spinner loading={loading} />
}

export default Loading;