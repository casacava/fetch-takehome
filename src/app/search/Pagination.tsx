interface PaginationProps {
  page: number;
  total: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, total, setPage }: PaginationProps) {
  const pageSize = 10
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="flex justify-between mt-4">
      <button
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span>Page {page} of {totalPages}</span>

      <button
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
