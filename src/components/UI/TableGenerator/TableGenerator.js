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
      onClick={(e) => e.stopPropagation()}
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

export const TrComponent = React.forwardRef(
  (
    { row, index, columns, children, className, tdClassName, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={`flex justify-between ${
          index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'
        } ${className}`}
      >
        {columns.map((column, _index) => {
          return (
            <div
              key={
                typeof column.accessor === 'string'
                  ? column.accessor
                  : column.id
              }
              className={`px-6 py-4 whitespace-nowrap text-sm font-medium flex-1 text-gray-900 ${tdClassName}`}
            >
              <column.Cell
                index={index}
                column={column}
                value={
                  typeof column.accessor === 'string'
                    ? row[column['accessor']]
                    : column.accessor(row)
                }
              />
            </div>
          )
        })}
        {children}
      </div>
    )
  }
)

export function ReactTableWrapper({
  columns,
  data,
  pagination = null,
  children,
  onPageChange,
  onFilterChange = null,
  TbodyWrapperComponent = null,
  TrWrapperComponent = null,
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

  // Filtering the rows
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

    data = result.map((i) => i.item)
  }

  // Sorting the rows
  if (sort.sortBy) {
    if (sort.sortOrder === 'ASC') {
      data = data.sort(ascSort(sort.sortBy))
    } else {
      data = data.sort(descSort(sort.sortBy))
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
              <div className="table min-w-full divide-y divide-gray-200">
                <div className="thead">
                  <div className="flex justify-between">
                    {columns.map((column) => {
                      const columnID =
                        typeof column.accessor === 'string'
                          ? column.accessor
                          : column.id
                      return (
                        <div
                          key={columnID}
                          onClick={() => {
                            if (!column.canSort) {
                              return
                            }
                            if (columnID === sort.sortBy) {
                              setSort((ov) => ({
                                ...ov,
                                sortOrder:
                                  ov.sortOrder === 'DESC' ? 'ASC' : 'DESC',
                              }))
                            } else {
                              setSort((ov) => ({
                                ...ov,
                                sortBy: columnID,
                              }))
                            }
                          }}
                          scope="col"
                          className={`flex-1 text-center px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                            sort.sortBy === columnID && sort.sortOrder === 'ASC'
                              ? 'border-t-4'
                              : ''
                          } ${
                            sort.sortBy === columnID &&
                            sort.sortOrder === 'DESC'
                              ? 'border-b-4'
                              : ''
                          } ${column.canSort ? 'cursor-pointer' : ''}`}
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
                        </div>
                      )
                    })}
                  </div>
                </div>
                {children({
                  TrWrapperComponent,
                  data,
                  columns,
                })}
                {/* {TbodyWrapperComponent ? (
                  <TbodyWrapperComponent>
                    <TbodyComponent
                      TrWrapperComponent={TrWrapperComponent}
                      data={data}
                      columns={columns}
                    />
                  </TbodyWrapperComponent>
                ) : (
                  <TbodyComponent
                    TrWrapperComponent={TrWrapperComponent}
                    data={data}
                    columns={columns}
                  />
                )} */}
              </div>
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

export default function FullTable(props) {
  return (
    <ReactTableWrapper {...props}>
      {({ data, columns }) => {
        return (
          <div className="tbody flex flex-col">
            {data.map((row, index) => {
              return (
                <TrComponent
                  key={row.id}
                  columns={columns}
                  row={row}
                  index={index}
                />
              )
            })}
          </div>
        )
      }}
    </ReactTableWrapper>
  )
}