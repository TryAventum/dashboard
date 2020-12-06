import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import ReactTableWrapper from '../../../components/UI/TableGenerator/TableGenerator'
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
        canFilter: true,
        canSort: true,
        Cell: (props) => <div className={'text-center'}>{props.value}</div>,
      },
      {
        Header: t('Label'),
        accessor: 'label',
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

  return (
    <>
      <ReactTableWrapper data={data} columns={columns} />

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
