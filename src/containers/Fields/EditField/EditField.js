import React from 'react'
import Panel from '../../../components/UI/Panel/Panel'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import * as actions from '../../../store/actions/index'
// import aventum from '../../../aventum'
import { onDragEnd } from '../../../shared/utility'
import Notification from '../../../components/UI/Notification/Notification'
import { useSchemaFieldHelper } from '../../../shared/react-hooks'

import FieldsButtons from '../../../components/Fields/FieldsButtons/FieldsButtons'
import FieldTitle from '../../Schema/SchemaTitle/SchemaTitle'
import FieldsSettingsList from '../../../components/Fields/FieldsSettingsList/FieldsSettingsList'

export function EditField ({
  fields: propsFields,
  setCurrentEditedSchemaOrField,
  schemas
}) {
  const history = useHistory()
  const { field } = useParams()
  const { t, i18n } = useTranslation()

  const {
    getCurrentObject,
    acl,
    icon,
    name,
    title,
    fields,
    setIcon,
    setAcl,
    setName,
    setTitle,
    setFields,
    nameErrors,
    setNameErrors,
    titleErrors,
    setTitleErrors,
    singularTitle,
    singularTitleErrors,
    setSingularTitle,
    setSingularTitleErrors,
    resetState,
    addFieldSettingsItem,
    reorderFieldsSettingsListItems,
    setFieldData,
    setValidationErrors,
    removeItem,
    saveData,
    notificationList,
    addNotification,
    onDismiss
  } = useSchemaFieldHelper({
    setCurrentEditedSchemaOrField,
    objects: propsFields,
    objectName: field,
    schemas,
    saveMethod: actions.saveField,
    updateMethod: actions.updateField
  })

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <div>
          <div className="w-4/5 py-6">
            <Panel className="">
              <Panel.Content>
                <FieldTitle
                  titleLabel={t('FieldPluralTitle')}
                  titleErrors={titleErrors}
                  singularTitleLabel={t('FieldSingularTitle')}
                  singularTitleErrors={singularTitleErrors}
                  nameLabel={t('FieldName')}
                  title={title || ''}
                  singularTitle={singularTitle || ''}
                  titlePlaceholder={t('ForExampleSizes')}
                  singularTitlePlaceholder={t('ForExampleSize')}
                  namePlaceholder={t('ForExampSizes')}
                  name={name || ''}
                  nameErrors={nameErrors}
                  onTitleChange={(v) => setTitle(v)}
                  onSingularTitleChange={(v) => setSingularTitle(v)}
                  onNameChange={(v) => setName(v)}
                />
              </Panel.Content>
            </Panel>
          </div>
        </div>
        <div>
          <div className="flex">
            <div className="w-4/5">
              <FieldsSettingsList
                setFieldData={setFieldData}
                reorderItems={reorderFieldsSettingsListItems}
                items={fields}
                removeItem={removeItem}
              />
            </div>
            <div className={`w-1/5 ${i18n.dir() === 'ltr' ? 'pl-6' : 'pr-6'}`}>
              <FieldsButtons
                saveSchema={saveData}
                onCancel={() => history.push('/fields/list')}
                onAddItem={addFieldSettingsItem}
                saveText={field ? t('Update') : t('Save')}
              />
            </div>
          </div>
        </div>
      </div>
      <Notification notifyList={notificationList} onDismiss={onDismiss} />
    </DragDropContext>
  )
}

const mapStateToProps = (state) => {
  return {
    loadingFields: state.field.loadingFields,
    fields: state.field.fields,
    schemas: state.schema.schemas
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveField: (payload) => dispatch(actions.saveField(payload)),
    updateField: (payload) => dispatch(actions.updateField(payload)),
    setCurrentEditedSchemaOrField: (payload) =>
      dispatch(actions.setCurrentEditedSchemaOrField(payload)),
    getFields: () => dispatch(actions.getFields())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditField)
