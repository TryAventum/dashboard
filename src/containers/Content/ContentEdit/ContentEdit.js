import React, { useEffect } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import { connect, useDispatch } from 'react-redux'
import { useLocation, useHistory, useParams } from 'react-router-dom'
import * as actions from '../../../store/actions/index'
import { useTranslation } from 'react-i18next'
import aventum from '../../../aventum'
import { getObjectByName } from '../../../shared/utility'
import { prepareForSave, parseFields } from '../../../shared/fieldsHelpers'
import RenderFields from '../../../components/Fields/RenderFields/RenderFields'
import ConditionalLogicValidator from '../../../shared/conditional-logic-validator'
import ContentValidator from '../../../shared/content-validator'
import SaveButtons from '../../../components/UI/SaveButtons/SaveButtons'
import Notification from '../../../components/UI/Notification/Notification'
import { useNotification } from '../../../shared/react-hooks'

export function ContentEdit({
  resetCurrentContentValues,
  setErrors,
  schemas,
  getCurrentContentValues,
  setDefaultValues,
  currentContentValues,
  fields,
  loading,
  ...props
}) {
  const history = useHistory()
  const location = useLocation()
  const { id, content } = useParams()
  const { t, i18n } = useTranslation()
  const { notificationList, addNotification, onDismiss } = useNotification()
  const dispatch = useDispatch()

  useEffect(() => {
    if (id) {
      getCurrentContentValues(id, content)
    } else {
      setDefaultValues({ content, schemas, customFields: fields })
    }
    return () => {
      resetCurrentContentValues()
      setErrors(null)
    }
  }, [id, content, schemas.length])

  const saveContent = (event) => {
    let _content = getObjectByName(schemas, content)

    _content = cloneDeep(_content)
    let customFields = cloneDeep(fields)

    customFields = customFields.map((cf) => {
      cf.fields = cf.fields.map((f) => {
        const tmp = prepareForSave({ fields: [f] })
        return tmp.fields[0]
      })

      return cf
    })

    _content.fields = _content.fields.map((f) => {
      const tmp = prepareForSave({ fields: [f] })
      return tmp.fields[0]
    })

    const validation = ContentValidator.validateFields(
      _content.fields,
      currentContentValues,
      customFields
    )

    const setValidationErrors = (validation, __content, customFields) => {
      var errors = null

      if (validation) {
        errors = {}
        for (const field of validation.details) {
          const cField = __content.fields.find((f) => f.name === field.path[0])

          errors[cField.id] = [field.message]
        }
      }

      setErrors(errors)
    }

    setValidationErrors(validation, _content, customFields)

    if (validation) {
      addNotification(
        {},
        {
          errorHeader: t('error.Pctve!'),
          error: true,
        }
      )
      return
    }

    let result
    if (!id) {
      result = dispatch(actions.saveContent(currentContentValues, content))
    } else {
      result = dispatch(
        actions.updateContent(
          {
            id: id,
            form: currentContentValues,
          },
          content
        )
      )
    }

    addNotification(result, {
      successHeader: t('messages.DataSavedSuccessfully'),
    })
  }

  const onCancel = (event) => {
    history.push(`/contents/${content}/list`)
  }

  let nContent = getObjectByName(schemas, content)

  // Handle conditional logic
  if (nContent) {
    nContent = { ...nContent }

    nContent.fields = nContent.fields.map((f) => {
      const tmp = prepareForSave({ fields: [f] })
      return tmp.fields[0]
    })

    nContent.fields = ConditionalLogicValidator.getVisibleFields(
      nContent.fields,
      currentContentValues
    )

    nContent.fields = parseFields(nContent.fields)
  }

  // const validationRules = getValidationRulesFromSchema(
  //   getContentSchema(content, fields)
  // )

  // if (!this.validator.validations.length && validationRules.length) {
  //   this.validator.validations = validationRules
  // }

  // let validation = this.submitted // if the form has been submitted at least once
  //   ? this.validator.validate(currentContentValues) // then check validity every time we render
  //   : this.state.validation // otherwise just use what's in state

  return (
    <div>
      <div>
        <div className="w-4/5">
          <h3 className="text-3xl mb-4">
            {' '}
            {t('AddNew$Content', {
              content: nContent ? t(nContent.singularTitle) : '',
            })}
          </h3>
        </div>
      </div>
      <div className="flex">
        <div className="w-4/5">
          <RenderFields {...props} content={nContent} customFields={fields} />
        </div>
        <div className={`w-1/5 ${i18n.dir() === 'ltr' ? 'pl-6' : 'pr-6'}`}>
          <SaveButtons
            onSave={saveContent}
            onCancel={onCancel}
            loading={loading}
          />
        </div>
      </div>
      <Notification notifyList={notificationList} onDismiss={onDismiss} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    schemas: state.schema.schemas,
    currentContentValues: state.content.currentContentValues,
    fields: state.field.fields,
    loading: state.shared.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveContent: (form, content) =>
      dispatch(actions.saveContent(form, content)),
    setErrors: (payload) => dispatch(actions.setErrors(payload)),
    setDefaultValues: (payload) => dispatch(actions.setDefaultValues(payload)),
    updateContent: (form, content) =>
      dispatch(actions.updateContent(form, content)),
    getCurrentContentValues: (id, content) =>
      dispatch(actions.getCurrentContentValues(id, content)),
    resetCurrentContentValues: () =>
      dispatch(actions.resetCurrentContentValues()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentEdit)
