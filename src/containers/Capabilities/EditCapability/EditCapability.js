import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Input from '../../../components/UI/Input/Input'
import { useDispatch, connect } from 'react-redux'
import Joi from '@hapi/joi'
import { useTranslation } from 'react-i18next'
import * as actions from '../../../store/actions/index'
import aventum from '../../../aventum'
import { validate } from '../../../shared/utility'
import Notification from '../../../components/UI/Notification/Notification'
import SaveButtons from '../../../components/UI/SaveButtons/SaveButtons'
import { useNotification } from '../../../shared/react-hooks'

export function EditCapability ({
  getCurrentCapability,
  resetCurrentCapabilityValues,
  currentCapabilityValues,
  loading,
  saving
}) {
  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [reserved, setReserved] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const history = useHistory()
  const { capability } = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { notificationList, addNotification, onDismiss } = useNotification()

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

  const resetState = () => {
    setName('')
    setLabel('')
    setReserved(false)
  }

  useEffect(() => {
    if (capability) {
      getCurrentCapability(capability)
    } else {
      resetState()
      resetCurrentCapabilityValues()
    }

    return () => {
      resetCurrentCapabilityValues()
    }
  }, [capability])

  useEffect(() => {
    setName(currentCapabilityValues.name)
    setLabel(currentCapabilityValues.label)
    setReserved(currentCapabilityValues.reserved)
  }, [
    currentCapabilityValues.name,
    currentCapabilityValues.label,
    currentCapabilityValues.reserved
  ])

  const onCancel = (event) => {
    history.push('/capabilities/list')
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
        label: label
      }

      if (!capability) {
        result = dispatch(actions.saveCapability(form))
      } else {
        result = dispatch(
          actions.updateCapability({
            id: capability,
            form
          })
        )
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
    loading: state.capability.loadingCapabilities,
    saving: state.shared.loading,
    currentCapabilityValues: state.capability.currentCapabilityValues
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveCapability: (payload) => dispatch(actions.saveCapability(payload)),
    updateCapability: (payload) => dispatch(actions.updateCapability(payload)),
    getCurrentCapability: (payload) =>
      dispatch(actions.getCurrentCapability(payload)),
    resetCurrentCapabilityValues: (payload) =>
      dispatch(actions.resetCurrentCapabilityValues())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCapability)
