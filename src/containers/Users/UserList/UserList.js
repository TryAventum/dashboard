import React, { useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import ReactTable from 'react-table'
import debounce from 'lodash/debounce'
import * as actions from '../../../store/actions/index'
import { useUndo } from '../../../shared/react-hooks'
import Undo from '../../../components/UI/Undo/Undo'

export function UserList ({
  resetCurrentUserList,
  getUserPage,
  deleteUser,
  currentUserList,
  pagination,
  loading
}) {
  const { t } = useTranslation()
  const { undoList, removeWithUndo, onUndo, onDismiss, allUndoLists } = useUndo(
    deleteUser
  )

  useEffect(() => {
    return () => {
      resetCurrentUserList()
    }
  }, [])

  const getUsers = (state, instance) => {
    const query = {}
    query.like = []
    for (const q of state.filtered) {
      query.like.push({ column: q.id, value: q.value })
    }

    const sort = state.sorted.length ? state.sorted[0] : null
    const sortBy = sort ? sort.id : 'id'
    const sortOrder = sort ? (sort.desc ? 'DESC' : 'ASC') : 'DESC'

    query.sortBy = sortBy
    query.sortOrder = sortOrder

    getUserPage({
      page: state.page + 1,
      url: `query=${encodeURIComponent(JSON.stringify(query))}`
    })
  }

  const debouncedGetUsers = useCallback(debounce(getUsers, 500), [])

  const allUndoListsIds = allUndoLists.map((i) => i.id)

  const data = currentUserList.filter((u) => !allUndoListsIds.includes(u.id))

  const columns = [
    {
      Header: t('fn'),
      accessor: 'firstName',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>
    },
    {
      Header: t('ln'),
      accessor: 'lastName',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>
    },
    {
      Header: t('email'),
      accessor: 'email',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>
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
            <Link to={`/users/${props.value}/edit`}>
              <FaEdit className="cursor-pointer text-indigo-400 inline" />
            </Link>
          </div>
        )
      }
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
              onClick={() => removeWithUndo(props.value)}
              className="cursor-pointer text-red-400 inline"
            />
          </div>
        )
      }
    }
  ]

  return (
    <>
      <ReactTable
        loading={loading}
        pages={pagination.totalPages}
        filterable
        manual
        data={data}
        columns={columns}
        onFetchData={debouncedGetUsers}
        showPageSizeOptions={false}
        // Text
        previousText={t('Previous')}
        nextText={t('Next')}
        loadingText={t('Loading...')}
        noDataText={t('Nousersfound')}
        pageText={t('Page')}
        ofText={t('of')}
        rowsText={t('rows')}
        // Accessibility Labels
        pageJumpText={t('jumptopage')}
        rowsSelectorText={t('rowsperpage')}
        className="bg-white"
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

const mapStateToProps = (state) => {
  return {
    currentUserList: state.user.currentUserList,
    loading: state.user.loadingUser,
    pagination: state.user.pagination
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteUser: (payload, user) => dispatch(actions.deleteUser(payload, user)),
    getUserPage: (payload, user) =>
      dispatch(actions.getUserPage(payload, user)),
    resetCurrentUserList: () => dispatch(actions.resetCurrentUserList())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
