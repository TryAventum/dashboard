import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
// import ReactTable from 'react-table'
import ReactTableWrapper from '../../../components/UI/ReactTableWrapper/ReactTableWrapper'
import * as actions from '../../../store/actions/index'
import { useUndo } from '../../../shared/react-hooks'
import Undo from '../../../components/UI/Undo/Undo'

export function FieldList({ fields, deleteField }) {
  const { t } = useTranslation()
  const { undoList, removeWithUndo, onUndo, onDismiss, allUndoLists } = useUndo(
    deleteField
  )

  const allUndoListsIds = allUndoLists.map((i) => i.id)

  const data = fields.filter((u) => !allUndoListsIds.includes(u.id))

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
            <Link to={`/fields/${props.value}/edit`}>
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
      <ReactTableWrapper
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
    loadingFields: state.field.loadingFields,
    fields: state.field.fields,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteField: (payload) => dispatch(actions.deleteField(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FieldList)
