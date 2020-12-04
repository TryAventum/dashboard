import React, { useState, useReducer, useEffect } from 'react'
import isEqual from 'lodash/isEqual'
import Pagination from '../Pagination/Pagination'
import { usePrevious } from '../../../shared/react-hooks'
import Fuse from 'fuse.js'
// import { useTable, useFilters } from 'react-table'

// Define a default UI for filtering
function DefaultColumnFilter({ columnID, setFilter: _setFilter, value }) {
  // function DefaultColumnFilter({
  //   column: { filterValue, preFilteredRows, setFilter },
  // }) {
  // const count = preFilteredRows.length

  return (
    <input
      className="shadow-sm px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
      // value={filterValue || ''}
      value={value || ''}
      onChange={(e) => {
        const eV = e.target.value
        _setFilter((ov) => {
          if (eV) {
            return {
              ...ov,
              [columnID]: eV,
            }
          } else {
            delete ov[columnID]
            return {
              ...ov,
            }
          }
        }) // Set undefined to remove the filter entirely
      }}
      // placeholder={`Search ${count} roles...`}
      placeholder={`Filter...`}
    />
  )
}

// Ascending Sorting
const ascSort = (column) => {
  return (a, b) => {
    var nameA = a[column].toUpperCase() // ignore upper and lowercase
    var nameB = b[column].toUpperCase() // ignore upper and lowercase
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }

    // names must be equal
    return 0
  }
}

// Descending Sorting
const descSort = (column) => {
  return (a, b) => {
    var nameA = a[column].toUpperCase() // ignore upper and lowercase
    var nameB = b[column].toUpperCase() // ignore upper and lowercase
    if (nameA > nameB) {
      return -1
    }
    if (nameA < nameB) {
      return 1
    }

    // names must be equal
    return 0
  }
}

export default function ReactTableWrapper({
  columns,
  data,
  pagination = null,
  onPageChange,
  onFilterChange = null,
}) {
  const [activePage, setActivePage] = useState(1)
  const [filter, setFilter] = useState({})
  const [sort, setSort] = useState({ sortBy: null, sortOrder: 'ASC' })
  const prevFilter = usePrevious(filter)
  // const [filterState, dispatchFilter] = useReducer(reducer, [])

  const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage)
    onPageChange({ page: activePage })
  }

  useEffect(() => {
    if (onFilterChange && !isEqual(filter, prevFilter)) {
      onFilterChange(filter)
    }
  }, [filter, prevFilter])

  if (Object.keys(filter).length && !onFilterChange) {
    const options = {
      keys: Object.keys(filter),
      // sortFn: ascSort,
      // sortFn: (a, b) => {
      //   console.log('a', a.item[0].v)
      //   console.log('b', b)
      // },
    }

    const fuse = new Fuse(data, options)

    const result = fuse.search({
      $and: Object.keys(filter).map((key) => ({ [key]: filter[key] })),
    })

    if (sort.sortBy) {
      if (sort.sortOrder === 'ASC') {
        data = result.map((i) => i.item).sort(ascSort(sort.sortBy))
      } else {
        data = result.map((i) => i.item).sort(descSort(sort.sortBy))
      }
    } else {
      data = result.map((i) => i.item)
    }
  }

  // const onFilterChange = ({}) => {}

  // const defaultColumn = React.useMemo(
  //   () => ({
  //     // Let's set up our default Filter UI
  //     Filter: DefaultColumnFilter,
  //   }),
  //   []
  // )

  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  // } = useTable({ columns, data, defaultColumn }, useFilters)

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {columns.map((column) => {
                      const columnID =
                        typeof column.accessor === 'string'
                          ? column.accessor
                          : column.id
                      return (
                        <th
                          key={columnID}
                          scope="col"
                          className="px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.Header}
                          <div className="mt-1">
                            {column.canFilter ? (
                              <DefaultColumnFilter
                                columnID={columnID}
                                value={filter[columnID]}
                                filter={column.filter}
                                setFilter={setFilter}
                              />
                            ) : null}
                          </div>
                        </th>
                      )
                    })}
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
                              <column.Cell
                                value={
                                  typeof column.accessor === 'string'
                                    ? row[column['accessor']]
                                    : column.accessor(row)
                                }
                              />
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
      {pagination && (
        <Pagination
          activePage={activePage}
          onPageChange={handlePaginationChange}
          totalPages={
            pagination && pagination.totalPages ? pagination.totalPages : 1
          }
        />
      )}
    </>
  )
}
