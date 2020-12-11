import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import isEqual from 'lodash/isEqual'
import { useTranslation } from 'react-i18next'
import TableGenerator from '../../../components/UI/TableGenerator/TableGenerator'
import debounce from 'lodash/debounce'
import * as actions from '../../../store/actions/index'
import { useUndo, usePrevious } from '../../../shared/react-hooks'
import Undo from '../../../components/UI/Undo/Undo'

export function UserList({}) {
  const { t } = useTranslation()
  const currentUserList = useSelector((state) => state.user.currentUserList)
  const loading = useSelector((state) => state.user.loadingUser)
  const pagination = useSelector((state) => state.user.pagination)
  const dispatch = useDispatch()
  const [query, setQuery] = useState({
    like: [],
    sortBy: 'id',
    sortOrder: 'DESC',
  })
  const prevQuery = usePrevious(query)
  const deleteUser = (payload, user) =>
    dispatch(actions.deleteUser(payload, user))
  const getUserPage = (payload, user) =>
    dispatch(actions.getUserPage(payload, user))
  const resetCurrentUserList = () => dispatch(actions.resetCurrentUserList())
  const { undoList, removeWithUndo, onUndo, onDismiss, allUndoLists } = useUndo(
    deleteUser
  )

  // const getUsers = ({ page }) => {
  //   const query = {}

  //   getUserPage({
  //     page: page,
  //     url: `query=${encodeURIComponent(JSON.stringify(query))}`,
  //   })
  // }
  const getUsers = ({ sort, filter }) => {
    const _query = { ...query }

    if (filter) {
      _query.like = []
      for (const column in filter) {
        if (filter.hasOwnProperty(column)) {
          const value = filter[column]
          _query.like.push({ column, value })
        }
      }
    }

    // _query.like = _query.like.filter((c) => c.column !== column)
    // for (const q of state.filtered) {
    // _query.like.push({ column, value })
    // }

    // const sort = state.sorted.length ? state.sorted[0] : null
    if (sort) {
      _query.sortBy = sort.sortBy
      _query.sortOrder = sort.sortOrder
    }
    // const sortBy = 'id'
    // const sortOrder = 'DESC'

    // _query.sortBy = sortBy
    // _query.sortOrder = sortOrder

    setQuery(_query)

    // getUserPage({
    //   page: 1,
    //   url: `query=${encodeURIComponent(JSON.stringify(_query))}`,
    // })
  }

  // const debouncedGetUsers = useCallback(debounce(getUsers, 500), [])
  const debouncedGetUserPage = useCallback(debounce(getUserPage, 500), [])

  useEffect(() => {
    debouncedGetUserPage({
      page: 1,
      url: `query=${encodeURIComponent(JSON.stringify(query))}`,
    })
  }, [isEqual(query, prevQuery)])

  useEffect(() => {
    getUserPage({
      page: 1,
      url: `query=${encodeURIComponent(JSON.stringify(query))}`,
    })
    return () => {
      resetCurrentUserList()
    }
  }, [])

  const allUndoListsIds = allUndoLists.map((i) => i.id)

  const data = currentUserList.filter((u) => !allUndoListsIds.includes(u.id))

  // function filterResults(rows, id, filterValue) {
  //   // console.log(id, filterValue, rows)
  //   getUsers2({ column: id[0], value: filterValue })

  //   return rows
  //   // return rows.filter(row => {
  //   //   const rowValue = row.values[id]
  //   //   return rowValue >= filterValue
  //   // })
  // }

  const columns = [
    {
      Header: t('fn'),
      accessor: 'firstName',
      // filter: filterResults,
      canFilter: true,
      canSort: true,
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      Header: t('ln'),
      accessor: 'lastName',
      // filter: filterResults,
      canFilter: true,
      canSort: true,
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      Header: t('email'),
      accessor: 'email',
      // filter: filterResults,
      canFilter: true,
      canSort: true,
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      id: 'Edit',
      Header: t('Edit'),
      accessor: 'id',
      Cell: (props) => {
        return (
          <div className={'text-center'}>
            <Link to={`/users/${props.value}/edit`}>
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
      Cell: (props) => {
        return (
          <div className={'text-center'}>
            <FaTrash
              onClick={() => removeWithUndo(props.value)}
              className="cursor-pointer text-red-400 inline"
            />
          </div>
        )
      },
    },
  ]

  return (
    <>
      <TableGenerator
        data={data}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={({ page }) => {
          getUserPage({
            page,
            url: `query=${encodeURIComponent(JSON.stringify(query))}`,
          })
        }}
        onFilterChange={(_filter) => getUsers({ filter: _filter })}
        onSortChange={(_sort) => getUsers({ sort: _sort })}
      />
      <Undo
        onUndo={onUndo}
        onDismiss={onDismiss}
        undoList={undoList}
        time={3000}
      />
    </>
  )
}

export default UserList
