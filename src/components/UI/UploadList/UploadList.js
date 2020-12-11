import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import UploadListItem from './UploadListItem/UploadListItem'
import * as actions from '../../../store/actions/index'
import Pagination from '../../UI/Pagination/Pagination'
import Undo from '../../UI/Undo/Undo'
import { useUndo } from '../../../shared/react-hooks'

export function UploadList({
  getUploads,
  picker,
  selectedUploads,
  multiple,
  setSelectedUploads,
  uploads,
  style,
  deleteUpload,
  pagination,
}) {
  const [activePage, setActivePage] = useState(1)

  const { undoList, removeWithUndo, onUndo, onDismiss, allUndoLists } = useUndo(
    deleteUpload
  )

  const select = (event, item) => {
    if (!picker) {
      return
    }

    let newSelected
    if (selectedUploads.some((e) => e.id === item.id)) {
      newSelected = selectedUploads.filter((e) => e.id !== item.id)
    } else {
      if (multiple) {
        newSelected = [...selectedUploads, item]
      } else {
        newSelected = [item]
      }
    }

    setSelectedUploads(newSelected)
  }

  const handlePaginationChange = (e, { activePage }) => {
    setActivePage(activePage)
    getUploads({ page: activePage })
  }

  useEffect(() => {
    getUploads({ page: activePage })
  }, [])

  const hasUploads = !!(uploads && uploads.length)

  const allUndoListsIds = allUndoLists.map((i) => i.id)

  uploads = uploads.filter((u) => !allUndoListsIds.includes(u.id))

  return (
    <div>
      <div>
        <div>
          <div style={style} className="flex flex-wrap uploads">
            {hasUploads
              ? uploads.map((i) => (
                  <UploadListItem
                    deleteItem={(item) => removeWithUndo(item)}
                    key={i.id}
                    item={i}
                    selected={selectedUploads}
                    select={select}
                    picker={picker}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
      <div>
        <div>
          {hasUploads && (
            <div className="flex justify-end py-2">
              <Pagination
                activePage={activePage}
                onPageChange={handlePaginationChange}
                totalPages={
                  pagination && pagination.totalPages
                    ? pagination.totalPages
                    : 1
                }
              />
            </div>
          )}
        </div>
      </div>
      <Undo
        onUndo={onUndo}
        onDismiss={onDismiss}
        undoList={undoList}
        time={3000}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.upload.loading,
    uploads: state.upload.uploads,
    selectedUploads: state.upload.selectedUploads,
    pagination: state.upload.pagination,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUploads: (payload) => dispatch(actions.getUploads(payload)),
    setSelectedUploads: (payload) =>
      dispatch(actions.setSelectedUploads(payload)),
    deleteUpload: (payload) => dispatch(actions.deleteUpload(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadList)
