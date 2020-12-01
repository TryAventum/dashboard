import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useTable } from 'react-table'
import * as actions from '../../../store/actions/index'
import { useUndo } from '../../../shared/react-hooks'
import Undo from '../../../components/UI/Undo/Undo'

export function RoleList({ getAllRoles, deleteRole, roles }) {
  const { t, i18n } = useTranslation()

  const { undoList, removeWithUndo, onUndo, onDismiss, allUndoLists } = useUndo(
    deleteRole
  )

  useEffect(() => {
    getAllRoles()
  }, [])

  const allUndoListsIds = allUndoLists.map((i) => i.id)

  const data = React.useMemo(
    () => roles.filter((u) => !allUndoListsIds.includes(u.id)),
    [allUndoListsIds.length, roles.length]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: t('Name'),
        accessor: 'name',
        Cell: (props) => <div className={'text-center'}>{props.value}</div>,
      },
      {
        Header: t('Label'),
        accessor: 'label',
        Cell: (props) => <div className={'text-center'}>{props.value}</div>,
      },
      {
        id: 'Edit',
        Header: t('Edit'),
        accessor: 'id',
        filterable: false,
        sortable: false,
        Cell: (props) => {
          return (
            <div className={'text-center'}>
              <Link to={`/roles/${props.value}/edit`}>
                <FaEdit className="cursor-pointer text-indigo-400 inline" />
              </Link>
            </div>
          )
        },
      },
      {
        id: 'Delete',
        Header: t('Delete'),
        accessor: (a) => a,
        filterable: false,
        sortable: false,
        Cell: (props) => {
          return (
            <div className={'text-center'}>
              <FaTrash
                onClick={() =>
                  !props.value.reserved ? removeWithUndo(props.value) : null
                }
                className={`${
                  !props.value.reserved
                    ? 'cursor-pointer text-red-400'
                    : 'text-gray-500'
                } inline`}
                title={props.value.reserved ? t('Reserved') : t('Delete')}
              />
            </div>
          )
        },
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <>
      {/* <ReactTableWrapper
        filterable
        data={data}
        columns={columns}
        showPagination={false}
        pageSize={data.length}
        className="bg-white"
      /> */}

      <div className="flex flex-col">
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
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
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
      </div>
      <Undo
        onUndo={onUndo}
        onDismiss={onDismiss}
        undoList={undoList}
        time={3000}
      />
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    roles: state.role.roles,
    pagination: state.role.pagination,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteRole: (payload, role) => dispatch(actions.deleteRole(payload, role)),
    getAllRoles: () => dispatch(actions.getAllRoles()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleList)
