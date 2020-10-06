import React, { Component } from 'react'
import Panel from '../../../UI/Panel/Panel'
import { Draggable } from 'react-beautiful-dnd'
import aventum from '../../../../aventum'
import { withTranslation } from 'react-i18next'
import { FaTrash } from 'react-icons/fa'

import FieldsSettingsListItemController from './FieldsSettingsListItemController/FieldsSettingsListItemController'

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // styles we need to apply on draggables
  ...draggableStyle,
})

class FieldsSettingsListItem extends Component {
  getHeader = (snapshot, provided) => {
    let icon = (
      <FaTrash
        title={this.props.t('Remove')}
        onClick={(event) => this.props.onRemoveItem(this.props.id)}
        className={`fill-current text-gray-500 cursor-pointer m-0 hover:text-red-400`}
      />
    )

    /**
     * The remove icon of the field's header(the controller).
     *
     * @hook
     * @name FieldsSettingsListItemHeaderRemoveIcon
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} snapshot From the Draggable component of the react-beautiful-dnd package.
     * @param {Object} $this The FieldsSettingsListItem component.
     */
    icon = aventum.hooks.applyFiltersSync(
      'FieldsSettingsListItemHeaderRemoveIcon',
      icon,
      snapshot,
      this
    )

    let header = (
      <Panel.Header
        {...provided.dragHandleProps}
        className={`${
          snapshot.isDragging ? `` : ``
        } flex justify-between items-center`}
      >
        <h3 className="font-bold text-cool-gray-600 text-xl">
          {this.props.name}({this.props.type})
        </h3>
        {icon}
      </Panel.Header>
    )

    /**
     * The controller(field) header.
     *
     * @hook
     * @name FieldsSettingsListItemHeader
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} header The header, React component.
     * @param {Object} snapshot From the Draggable component of the react-beautiful-dnd package.
     * @param {Object} $this The FieldsSettingsListItem component.
     */
    header = aventum.hooks.applyFiltersSync(
      'FieldsSettingsListItemHeader',
      header,
      snapshot,
      this
    )

    return header
  }

  getField() {
    let field = null

    let fields =
      this.props.fields &&
      this.props.fields.map((f) => {
        let result = (
          <FieldsSettingsListItemController
            type={f.type}
            inputType={f.inputType}
            key={f.name}
            value={f.value}
            name={f.name}
            checked={f.checked}
            options={f.options}
            required={f.required}
            schemas={this.props.schemas}
            id={this.props.id}
            handleChange={this.props.handleChange}
            label={f.label}
          />
        )
        return result
      })

    /**
     * The field that will be rendered.
     *
     * @hook
     * @name FieldsSettingsListItemField
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} field React component.
     * @param {Object} $this The FieldsSettingsListItem component.
     */
    field = aventum.hooks.applyFiltersSync(
      'FieldsSettingsListItemField',
      field,
      this
    )

    field = fields

    return field
  }
  render() {
    /**
     * The render method for the FieldsSettingsListItem component just started.
     *
     * @hook
     * @name FieldsSettingsListItemRenderStarted
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The FieldsSettingsListItem component.
     */
    aventum.hooks.doActionSync('FieldsSettingsListItemRenderStarted', this)

    let errors = this.props.errors ? (
      <span className="text-red-500 inline-block mt-2 capitalize">
        {this.props.errors.join(', ') + '!'}
      </span>
    ) : null

    return (
      <Draggable draggableId={this.props.id} index={this.props.index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
            className={errors ? 'border-red-400 border-solid' : ''}
          >
            <Panel className={snapshot.isDragging ? `bg-gray-100` : ``}>
              {this.getHeader(snapshot, provided)}
              <Panel.Content className="controllers">{this.getField()}</Panel.Content>
            </Panel>
            {errors}
          </div>
        )}
      </Draggable>
    )
  }
}

export default withTranslation()(FieldsSettingsListItem)
