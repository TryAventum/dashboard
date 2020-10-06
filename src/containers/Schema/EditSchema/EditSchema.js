import React from 'react'
import Panel from '../../../components/UI/Panel/Panel'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DragDropContext } from 'react-beautiful-dnd'
import * as actions from '../../../store/actions/index'
// import aventum from '../../../aventum'
import { onDragEnd } from '../../../shared/utility'
import { useSchemaFieldHelper } from '../../../shared/react-hooks'

import FieldsButtons from '../../../components/Fields/FieldsButtons/FieldsButtons'
import SchemaTitle from '../SchemaTitle/SchemaTitle'
import RolesCapabilities from '../RolesCapabilities/RolesCapabilities'
import FieldsSettingsList from '../../../components/Fields/FieldsSettingsList/FieldsSettingsList'
import Notification from '../../../components/UI/Notification/Notification'

export function EditSchema ({ schemas, setCurrentEditedSchemaOrField }) {
  const history = useHistory()
  const { schema } = useParams()
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
    saveData,
    addFieldSettingsItem,
    reorderFieldsSettingsListItems,
    setFieldData,
    setValidationErrors,
    removeItem,
    notificationList,
    addNotification,
    onDismiss
  } = useSchemaFieldHelper({
    setCurrentEditedSchemaOrField,
    objects: schemas,
    objectName: schema,
    schemas,
    saveMethod: actions.saveSchema,
    updateMethod: actions.updateSchema
  })

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <div>
          <div className="w-4/5 py-6">
            <Panel className="">
              <Panel.Content>
                <SchemaTitle
                  title={title || ''}
                  titleErrors={titleErrors}
                  singularTitle={singularTitle || ''}
                  singularTitleErrors={singularTitleErrors}
                  name={name || ''}
                  nameErrors={nameErrors}
                  showIcon
                  icon={icon || ''}
                  onTitleChange={(v) => setTitle(v)}
                  onSingularTitleChange={(v) => setSingularTitle(v)}
                  onNameChange={(v) => setName(v)}
                  onIconChange={(v) => setIcon(v)}
                />
              </Panel.Content>
            </Panel>
          </div>
        </div>
        <div>
          <div className="w-4/5 py-6">
            <Panel className="">
              <Panel.Content>
                <RolesCapabilities
                  acl={acl}
                  handleChange={(value) => setAcl(value)}
                  addNotification={addNotification}
                />
              </Panel.Content>
            </Panel>{' '}
          </div>
        </div>
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
              onCancel={() => history.push('/schemas/list')}
              onAddItem={addFieldSettingsItem}
              saveText={schema ? t('Update') : t('Save')}
              showAll
            />
          </div>
        </div>
      </div>
      <Notification notifyList={notificationList} onDismiss={onDismiss} />
    </DragDropContext>
  )
}

const mapStateToProps = (state) => {
  return {
    loadingSchemas: state.schema.loadingSchemas,
    schemas: state.schema.schemas
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentEditedSchemaOrField: (payload) =>
      dispatch(actions.setCurrentEditedSchemaOrField(payload)),
    getSchemas: () => dispatch(actions.getSchemas())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSchema)
