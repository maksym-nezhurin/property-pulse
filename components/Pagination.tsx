
interface IProps {
    page: number
    pageSize: number
    totalItems: number
    onPageChange: (page: number) => void
}

export const Pagination = (props: IProps) => {
    const { totalItems, pageSize, page, onPageChange} = props;
    const totalPages = Math.ceil(totalItems / pageSize );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage)
        }
    }

    return (<section className="container mx-auto flex justify-center my-8">
        <nav
            className="relative z-0 inline-flex rounded-md shadow-sm"
            aria-label="Pagination"
        >
            <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1) }
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <span className="sr-only">Previous</span>
                Previous
            </button>

            <span className='mx-2 my-2'>
                Page { page } of { totalPages }
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <span className="sr-only">Next</span>

                Next
            </button>
        </nav>
    </section>)
}