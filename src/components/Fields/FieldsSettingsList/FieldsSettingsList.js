import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'
import { FaRegHandPointLeft, FaRegHandPointRight } from 'react-icons/fa'
import Panel from '../../../components/UI/Panel/Panel'
import { withTranslation } from 'react-i18next'
import aventum from '../../../aventum'

import FieldsSettingsListItem from './FieldsSettingsListItem/FieldsSettingsListItem'

/**
 * Render the controllers(the fields), for example when we creating a schema
 */
class FieldsSettingsList extends Component {
  componentDidMount() {
    aventum.hooks.addAction(
      'SchemaNFieldsOnDragEnd',
      'Aventum/Core/FieldsSettingsList',
      this.fieldsSettingsListDragEnd
    )
  }

  componentWillUnmount() {
    aventum.hooks.removeAction(
      'SchemaNFieldsOnDragEnd',
      'Aventum/Core/FieldsSettingsList'
    )
  }

  handleChange = (id, name, event, data) => {
    this.props.setFieldData(id, name, event, data)
  }

  fieldsSettingsListDragEnd = (result) => {
    if (result.type !== 'FieldsSettingsList') {
      return
    }

    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    let currentList = [...this.props.items]

    let draggableElement = this.props.items.find((i) => i.id === draggableId)

    //From source.index remove one item
    currentList.splice(source.index, 1)

    //Remove nothing and insert the draggableId
    currentList.splice(destination.index, 0, draggableElement)

    this.props.reorderItems(currentList)
  }

  render() {
    /**
     * The render method for the FieldsSettingsList component just started.
     *
     * @hook
     * @name FieldsSettingsListRenderStarted
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The FieldsSettingsList component.
     */
    aventum.hooks.doActionSync('FieldsSettingsListRenderStarted', this)

    let settingsControls = this.props.items
      ? this.props.items.map((control, index) => {
          return (
            <FieldsSettingsListItem
              type={control.type}
              name={control.name}
              key={control.id}
              errors={control.errors}
              index={index}
              id={control.id}
              handleChange={this.handleChange}
              onRemoveItem={this.props.removeItem}
              fields={control.fields}
              schemas={this.props.schemas}
            />
          )
        })
      : null

    /**
     * The list of the controls in the FieldsSettingsList component.
     *
     * @hook
     * @name FieldsSettingsListSettingsControls
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Array} settingsControls the controls that we will filter.
     * @param {Object} $this The FieldsSettingsList component.
     */
    settingsControls = aventum.hooks.applyFiltersSync(
      'FieldsSettingsListSettingsControls',
      settingsControls,
      this
    )

    return (
      <Droppable droppableId="droppable" type="FieldsSettingsList">
        {(provided, snapshot) => (
          <Panel
            className={`${
              snapshot.isDraggingOver ? ' bg-cool-gray-300' : 'bg-cool-gray-200'
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Panel.Content className="fields">
              {settingsControls && settingsControls.length ? (
                settingsControls
              ) : (
                <div className="flex items-center justify-between">
                  {this.props.t('AddFieldsFromRightPanel')}
                  {this.props.i18n.dir() === 'ltr' ? (
                    <FaRegHandPointRight />
                  ) : (
                    <FaRegHandPointLeft />
                  )}
                </div>
              )}
            </Panel.Content>
            {provided.placeholder}
          </Panel>
        )}
      </Droppable>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    schemas: state.schema.schemas,
  }
}

export default connect(mapStateToProps)(withTranslation()(FieldsSettingsList))
