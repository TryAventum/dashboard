import React, { useState, useEffect } from 'react'
import Joi from '@hapi/joi'
import Dropdown from '../../../components/UI/Dropdown/Dropdown'
import Input from '../../../components/UI/Input/Input'
import { useTranslation, withTranslation } from 'react-i18next'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { connect, useDispatch } from 'react-redux'

import * as actions from '../../../store/actions/index'
// import aventum from '../../../aventum'
import { validate } from '../../../shared/utility'
import SaveButtons from '../../../components/UI/SaveButtons/SaveButtons'
import Notification from '../../../components/UI/Notification/Notification'
import { useNotification } from '../../../shared/react-hooks'
export function EditRole ({
  getAllCapabilities,
  getCurrentRole,
  currentRoleValues,
  resetCurrentRoleValues,
  updateRole,
  saveRole,
  saving,
  loading,
  capabilities: propsCapabilities
}) {
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [reserved, setReserved] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [capabilities, setCapabilities] = useState([])
  const { notificationList, addNotification, onDismiss } = useNotification()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const schema = Joi.object({
    name: Joi.string()
      .alphanum()
      .required()
      .messages({
        'string.empty': t('Required!'),
        'any.required': t('Required!')
      }),
    label: Joi.string()
      .required()
      .messages({
        'string.empty': t('Required!'),
        'any.required': t('Required!')
      })
  })

  const history = useHistory()
  const location = useLocation()
  const { role } = useParams()

  const resetState = () => {
    setName('')
    setLabel('')
    setReserved(false)
    setCapabilities([])
  }

  useEffect(() => {
    getAllCapabilities()
    return () => {
      resetCurrentRoleValues()
    }
  }, [])

  useEffect(() => {
    if (role) {
      getCurrentRole(role)
    } else {
      resetState()
    }
  }, [role])

  useEffect(() => {
    setName(currentRoleValues.name)
    setLabel(currentRoleValues.label)
    setReserved(currentRoleValues.reserved)
    if (currentRoleValues.capabilities) {
      setCapabilities(currentRoleValues.capabilities.map((c) => c.id))
    }
  }, [currentRoleValues.name])

  const onCancel = (event) => {
    history.push('/roles/list')
  }

  const saveContent = (event) => {
    let result = validate(schema, { name, label }, ['name', 'label'])

    if (!submitted) {
      setSubmitted(true)
    }

    if (!result) {
      // handle actual form submission here
      const form = {
        name: name,
        label: label,
        capabilities: capabilities
      }

      if (!role) {
        result = dispatch(actions.saveRole(form))
      } else {
        result = dispatch(actions.updateRole({ id: role, form }))
      }
      addNotification(result, {
        successHeader: t('messages.DataSavedSuccessfully')
      })
    }
  }

  // if the form has been submitted at least once then check validity every time we render
  const validation = submitted
    ? validate(schema, { name, label }, ['name', 'label'])
    : {}

  const allCapabilities = propsCapabilities.map((c) => {
    return { label: c.name, value: c.id }
  })

  return (
    <div className="flex">
      <div className="w-5/6 px-4">
        <Input
          placeholder={t('CapabilityLabel')}
          onChange={(e) => setLabel(e.target.value)}
          disabled={loading}
          value={label || ''}
          id="label"
          help={validation && validation.label ? validation.label : ''}
          error={!!(validation && validation.label)}
          className="mb-6"
        />
        <Input
          placeholder={t('CapabilityName')}
          onChange={(e) => setName(e.target.value)}
          disabled={loading || reserved}
          value={name || ''}
          id="name"
          help={validation && validation.name ? validation.name : ''}
          error={!!(validation && validation.name)}
          title={reserved ? t('Reserved') : ''}
          className="mb-6"
        />
        <Dropdown
          onChange={(event, data) => setCapabilities(data.value)}
          value={capabilities}
          placeholder="Capabilities"
          multiple
          options={allCapabilities}
          clearable
        />
      </div>
      <div className="w-2/12 px-4">
        <SaveButtons
          onSave={saveContent}
          onCancel={onCancel}
          loading={saving}
        />
      </div>
      <Notification notifyList={notificationList} onDismiss={onDismiss} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.role.loadingRoles,
    saving: state.shared.loading,
    roles: state.role.roles,
    capabilities: state.capability.capabilities,
    currentRoleValues: state.role.currentRoleValues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveRole: (payload) => dispatch(actions.saveRole(payload)),
    updateRole: (payload) => dispatch(actions.updateRole(payload)),
    getCurrentRole: (payload) => dispatch(actions.getCurrentRole(payload)),
    getAllCapabilities: () => dispatch(actions.getAllCapabilities()),
    resetCurrentRoleValues: (payload) =>
      dispatch(actions.resetCurrentRoleValues())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(EditRole))
