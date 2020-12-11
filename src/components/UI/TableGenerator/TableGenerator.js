import React, { useState, useReducer, useEffect } from 'react'
import isEqual from 'lodash/isEqual'
import Pagination from '../Pagination/Pagination'
import { usePrevious } from '../../../shared/react-hooks'
import Fuse from 'fuse.js'
import Loader from '../Loader/Loader'

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
            const nv = { ...ov }
            delete nv[columnID]
            return nv
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
    {
      row,
      index,
      columns,
      children,
      className,
      getTrGroupProps,
      tdClassName,
      ...props
    },
    ref
  ) => {
    const finalClassName = `flex justify-between ${
      index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'
    } ${className}`
    let finalProps = { ...props, className: finalClassName }
    if (getTrGroupProps) {
      finalProps = {
        ...getTrGroupProps({ row, props: finalProps }),
      }
    }
    return (
      <div ref={ref} {...finalProps}>
        {columns.map((column, _index) => {
          return (
            <div
              key={column.id || column.accessor}
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

export const TbodyComponent = React.forwardRef(
  ({ children, getTbodyProps }, ref) => {
    let finalProps = { className: 'tbody flex flex-col' }
    if (getTbodyProps) {
      finalProps = {
        ...getTbodyProps({ props: finalProps }),
      }
    }
    return (
      <div ref={ref} {...finalProps}>
        {children}
      </div>
    )
  }
)

export function TableGenerator({
  columns,
  data,
  pagination = null,
  children,
  onPageChange,
  onFilterChange = null,
  onSortChange = null,
  onChange = null,
  getTrGroupProps = null,
  getTbodyProps = null,
  loading,
  paginationClassName = '',
}) {
  const [activePage, setActivePage] = useState(1)
  const [filter, setFilter] = useState({})
  const [sort, setSort] = useState({ sortBy: null, sortOrder: 'ASC' })
  const prevFilter = usePrevious(filter)
  const prevSort = usePrevious(sort)
  // const [filterState, dispatchFilter] = useReducer(reducer, [])

  const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage)
    onPageChange({ page: activePage })
    if (onChange) {
      onChange({ activePage, filter, sort })
    }
  }

  useEffect(() => {
    if (prevFilter && onFilterChange && !isEqual(filter, prevFilter)) {
      onFilterChange(filter)
      if (onChange) {
        onChange({ activePage, filter, sort })
      }
    }
  }, [filter, prevFilter])

  useEffect(() => {
    if (prevSort && onSortChange && !isEqual(sort, prevSort)) {
      onSortChange(sort)
      if (onChange) {
        onChange({ activePage, filter, sort })
      }
    }
  }, [sort, prevSort])

  // Filtering the rows
  if (Object.keys(filter).length && !onFilterChange) {
    const options = {
      keys: Object.keys(filter),
    }

    const fuse = new Fuse(data, options)

    const result = fuse.search({
      $and: Object.keys(filter).map((key) => ({ [key]: filter[key] })),
    })

    data = result.map((i) => i.item)
  }

  // Sorting the rows
  if (sort.sortBy && !onSortChange) {
    if (sort.sortOrder === 'ASC') {
      data = data.sort(ascSort(sort.sortBy))
    } else {
      data = data.sort(descSort(sort.sortBy))
    }
  }

  const commonBoarder = 'border-b border-gray-200 sm:rounded-lg'

  return (
    <>
      <div className="relative flex flex-col">
        {loading && (
          <div
            className={`absolute flex justify-center items-center inset-0 bg-cool-gray-100 opacity-75 ${commonBoarder}`}
          >
            <Loader className="w-8 text-gray-400" />
          </div>
        )}
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className={`shadow overflow-hidden ${commonBoarder}`}>
              <div className="table min-w-full divide-y divide-gray-200">
                <div className="thead">
                  <div className="flex justify-between">
                    {columns.map((column) => {
                      const columnID = column.id || column.accessor
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
                  data,
                  columns,
                  getTrGroupProps,
                  getTbodyProps,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {pagination && (
        <div className="flex justify-end py-3">
          <Pagination
            activePage={activePage}
            onPageChange={handlePaginationChange}
            className={paginationClassName}
            loading={loading}
            totalPages={
              pagination && pagination.totalPages ? pagination.totalPages : 1
            }
          />
        </div>
      )}
    </>
  )
}

export default function FullTable(props) {
  return (
    <TableGenerator {...props}>
      {({ data, columns, getTrGroupProps, getTbodyProps }) => {
        return (
          <TbodyComponent getTbodyProps={getTbodyProps}>
            {data.map((row, index) => {
              return (
                <TrComponent
                  key={row.id}
                  columns={columns}
                  row={row}
                  index={index}
                  getTrGroupProps={getTrGroupProps}
                />
              )
            })}
          </TbodyComponent>
        )
      }}
    </TableGenerator>
  )
}
