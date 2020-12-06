import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import ReactTable from 'react-table'
import ReactTableWrapper from '../../../components/UI/TableGenerator/TableGenerator'
import * as actions from '../../../store/actions/index'
import { useUndo } from '../../../shared/react-hooks'
import Undo from '../../../components/UI/Undo/Undo'

export function CapabilityList({
  getAllCapabilities,
  capabilities,
  deleteCapability,
}) {
  const { t } = useTranslation()

  const { undoList, removeWithUndo, onUndo, onDismiss, allUndoLists } = useUndo(
    deleteCapability
  )

  useEffect(() => {
    getAllCapabilities()
  }, [])

  const data = capabilities

  const columns = [
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
            <Link to={`/capabilities/${props.value}/edit`}>
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
  ]

  return (
    <>
      <ReactTableWrapper
        filterable
        data={data}
        className="bg-white"
        columns={columns}
        showPagination={false}
        pageSize={data.length}
        getTrGroupProps={({ row, props }) => {
          if (row) {
            return {
              ...props,
              className: allUndoLists.find((i) => row.id == i.id)
                ? props.className + ' h-0 border-0 overflow-hidden'
                : props.className,
            }
          } else {
            return {}
          }
        }}
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
    capabilities: state.capability.capabilities,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteCapability: (payload, capability) =>
      dispatch(actions.deleteCapability(payload, capability)),
    getAllCapabilities: () => dispatch(actions.getAllCapabilities()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CapabilityList)
