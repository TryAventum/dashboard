import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import DropzoneJS from '../../../components/UI/DropzoneJS/DropzoneJS'
import {
  FaExclamation,
  FaTrash,
  FaRegCheckCircle,
  FaRegCircle,
} from 'react-icons/fa'
import Input from '../../../components/UI/Input/Input'
import Loader from '../../../components/UI/Loader/Loader'
import Button from '../../../components/UI/Button/Button'
import TableGenerator from '../../../components/UI/TableGenerator/TableGenerator'
import { useTranslation } from 'react-i18next'
import * as actions from '../../../store/actions/index'
import aventum from '../../../aventum'
import DataModal from '../../../components/UI/DataModal/DataModal'

import { useUndo } from '../../../shared/react-hooks'
import Undo from '../../../components/UI/Undo/Undo'

export function ExtensionList({
  installExtensionFromRemote,
  activateExtensionLoading,
  loadingDeleteExtension,
  deleteExtension,
  addExtension,
  getAllExtensions,
  activateExtension,
  extensions,
  loading,
}) {
  const { t, i18n } = useTranslation()
  const [packageOrUrl, setPackageOrUrl] = useState('')
  const [dashboardNotExistMessage, setDashboardNotExistMessage] = useState('')
  const [reloadAfterDone, setReloadAfterDone] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const { undoList, removeWithUndo, onUndo, onDismiss, allUndoLists } = useUndo(
    deleteExtension
  )

  const reloadPage = () => {
    window.location.reload()
  }

  const doneClicked = () => {
    if (reloadAfterDone) {
      reloadPage()
    } else {
      setModalOpen(false)
    }
  }

  const afterActivateExtension = async (response) => {
    if (!response.error) {
      reloadPage()
    }
  }

  const onDeleteExtensionSuccess = (response, payload) => {
    if (response.data.message) {
      setModalOpen(true)
      setDashboardNotExistMessage(response.data.message)
      setReloadAfterDone(true)
    }
  }

  const installFromRemoteResponse = (response, payload) => {
    if (response.data.message) {
      setModalOpen(true)
      setDashboardNotExistMessage(response.data.message)
    }
  }

  const installFromRemote = () => {
    installExtensionFromRemote({
      package: packageOrUrl,
    })
  }

  const onSuccessExtension = (response) => {
    addExtension(response.extension)

    if (response.message) {
      setModalOpen(true)
      setDashboardNotExistMessage(response.message)
    }
  }

  useEffect(() => {
    aventum.hooks.addAction(
      'DeleteExtensionSuccess',
      'Aventum/Core/ExtensionList',
      onDeleteExtensionSuccess
    )
    aventum.hooks.addAction(
      'InstallExtensionFromRemoteSuccessResponse',
      'Aventum/Core/ExtensionList',
      installFromRemoteResponse
    )
    getAllExtensions()
    aventum.hooks.addAction(
      'AfterActivateExtension',
      'Aventum/Core/ExtensionList',
      afterActivateExtension
    )
    return () => {
      aventum.hooks.removeAction(
        'AfterActivateExtension',
        'Aventum/Core/ExtensionList'
      )
      aventum.hooks.removeAction(
        'DeleteExtensionSuccess',
        'Aventum/Core/ExtensionList'
      )
    }
  }, [])

  const allUndoListsIds = allUndoLists.map((i) => i.id)

  const data = extensions.filter((u) => !allUndoListsIds.includes(u.id))

  const columns = [
    {
      Header: t('Name'),
      accessor: 'name',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      Header: t('Description'),
      accessor: 'description',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      Header: t('Version'),
      accessor: 'version',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      Header: t('Author'),
      accessor: 'author.name',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      Header: t('License'),
      accessor: 'license',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      Header: t('Target'),
      accessor: 'aventum.target',
      Cell: (props) => <div className={'text-center'}>{props.value}</div>,
    },
    {
      id: 'Active',
      Header: t('Active'),
      accessor: (e) => e,
      filterable: false,
      sortable: false,
      Cell: (props) => {
        const loading =
          (activateExtensionLoading === props.value.name &&
            !!activateExtensionLoading) ||
          activateExtensionLoading === props.value.name

        return (
          <div className={'flex items-center justify-center text-teal-400'}>
            {!loading && props.value.aventum.active ? (
              <FaRegCheckCircle
                onClick={() => activateExtension(props.value)}
                className={'cursor-pointer'}
              />
            ) : !loading ? (
              <FaRegCircle
                onClick={() => activateExtension(props.value)}
                className={'cursor-pointer'}
              />
            ) : null}
            {loading && <Loader props={{ width: '16px' }} />}
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
          <div className={'flex items-center justify-center text-red-400'}>
            {loadingDeleteExtension === props.value.name ? (
              <Loader props={{ width: '16px' }} />
            ) : (
              <FaTrash
                className="cursor-pointer text-red-400"
                onClick={() => removeWithUndo(props.value)}
              />
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <DropzoneJS
        message={t('DropExtensionsToUpload')}
        onSuccessUpload={onSuccessExtension}
        url="exts"
      />
      <div className="relative">
        <Input
          onChange={(e) => setPackageOrUrl(e.target.value)}
          className="py-8"
          placeholder={t('NPMPackageNameOrGit')}
        />
        <Button
          size="small"
          loading={loading}
          disabled={loading || !packageOrUrl.length}
          onClick={installFromRemote}
          className="absolute"
          style={{
            top: '40%',
            [i18n.dir() === 'ltr' ? 'right' : 'left']: '8px',
          }}
        >
          {t('Install')}
        </Button>
      </div>
      <TableGenerator
        filterable
        data={data}
        columns={columns}
        showPagination={false}
        pageSize={data.length}
        className="bg-white"
      />
      <DataModal
        doneClicked={doneClicked}
        modalOpen={modalOpen}
        data={dashboardNotExistMessage}
        headingTitle={t('Notice')}
        headerIcon={<FaExclamation className="text-yellow-400" />}
        buttonText={t('OK')}
      />
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
    extensions: state.extension.extensions,
    loading: state.shared.loading,
    activateExtensionLoading: state.extension.activateExtensionLoading,
    loadingDeleteExtension: state.extension.loadingDeleteExtension,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteExtension: (payload, extension) =>
      dispatch(actions.deleteExtension(payload, extension)),
    installExtensionFromRemote: (payload) =>
      dispatch(actions.installExtensionFromRemote(payload)),
    getAllExtensions: () => dispatch(actions.getAllExtensions()),
    activateExtension: (extension) =>
      dispatch(actions.activateExtension(extension)),
    addExtension: (extension) => dispatch(actions.addExtension(extension)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExtensionList)
