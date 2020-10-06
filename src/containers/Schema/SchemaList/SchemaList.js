import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import ReactTable from 'react-table'
import * as actions from '../../../store/actions/index'
import { useUndo } from '../../../shared/react-hooks'
import Undo from '../../../components/UI/Undo/Undo'

export function SchemaList({ schemas, deleteSchema }) {
  const { t, i18n } = useTranslation()
  const { undoList, removeWithUndo, onUndo, onDismiss, allUndoLists } = useUndo(
    deleteSchema
  )

  const allUndoListsIds = allUndoLists.map((i) => i.id)

  const data = schemas.filter((u) => !allUndoListsIds.includes(u.id))

  const columns = [
    {
      Header: t('Name'),
      accessor: 'name',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      Header: t('Title'),
      accessor: 'title',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      id: 'Edit',
      Header: t('Edit'),
      accessor: 'name',
      filterable: false,
      sortable: false,
      Cell: (props) => {
        return (
          <div className={'text-center'}>
            <Link to={`/schemas/${props.value}/edit`}>
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
              className="cursor-pointer text-red-400 inline"
              onClick={() => removeWithUndo(props.value)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <>
      <ReactTable
        filterable
        data={data}
        columns={columns}
        showPagination={false}
        pageSize={data.length}
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
    loadingSchemas: state.schema.loadingSchemas,
    schemas: state.schema.schemas,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteSchema: (payload) => dispatch(actions.deleteSchema(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SchemaList)
