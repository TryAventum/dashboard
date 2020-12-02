import React, { useState } from 'react'
import Pagination from '../Pagination/Pagination'
import { useTable, useFilters } from 'react-table'

export default function ReactTableWrapper({
  columns,
  data,
  pagination,
  onPageChange,
}) {
  const [activePage, setActivePage] = useState(1)

  // Define a default UI for filtering
  function DefaultColumnFilter({}) {
    // function DefaultColumnFilter({
    //   column: { filterValue, preFilteredRows, setFilter },
    // }) {
    // const count = preFilteredRows.length

    return (
      <input
        className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        // value={filterValue || ''}
        value={''}
        // onChange={(e) => {
        //   setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        // }}
        // placeholder={`Search ${count} roles...`}
        placeholder={`Filter...`}
      />
    )
  }

  const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage)
    onPageChange({ page: activePage })
  }

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, defaultColumn }, useFilters)

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={
                          typeof column.accessor === 'string'
                            ? column.accessor
                            : column.id
                        }
                        scope="col"
                        className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.Header}
                        <div className="mt-1">
                          {column.canFilter ? <DefaultColumnFilter /> : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => {
                    return (
                      <tr
                        key={row.id}
                        className={`${
                          index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        {columns.map((column, _index) => {
                          return (
                            <td
                              key={
                                typeof column.accessor === 'string'
                                  ? column.accessor
                                  : column.id
                              }
                              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                              <column.Cell value={row[column['accessor']]} />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps()}
                          scope="col"
                          className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.render('Header')}
                          <div className="mt-1">
                            {column.canFilter ? column.render('Filter') : null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, index) => {
                    prepareRow(row)
                    return (
                      <tr
                        {...row.getRowProps()}
                        className={`${
                          index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                              {cell.render('Cell')}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}
      <Pagination
        activePage={activePage}
        onPageChange={handlePaginationChange}
        totalPages={
          pagination && pagination.totalPages ? pagination.totalPages : 1
        }
      />
    </>
  )
}
