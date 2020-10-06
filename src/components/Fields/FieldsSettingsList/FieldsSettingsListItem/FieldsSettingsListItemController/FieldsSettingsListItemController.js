import React, { Component } from 'react'
import Dropdown from '../../../../UI/Dropdown/Dropdown'
import Checkbox from '../../../../UI/Checkbox/Checkbox'
import Input from '../../../../UI/Input/Input'
import aventum from '../../../../../aventum'
import RepeatableTextValue from '../../../../UI/RepeatableTextValue/RepeatableTextValue'
import ConditionalLogicRules from '../../../../UI/ConditionalLogicRules/ConditionalLogicRules'
import { getContentsAsIdTitle } from '../../../../../shared/utility'
import { withTranslation } from 'react-i18next'
// import debounce from 'lodash/debounce'
import { setSchemaSubFieldValue } from '../../../../../shared/fieldsHelpers'

function InputController(props) {
  return (
    <Input
      label={props.label}
      key={props.name}
      type={props.type}
      required={props.required}
      placeholder={props.label}
      onChange={props.onChange}
      value={props.value}
      className="mb-3"
    />
  )
}

function CheckboxController(props) {
  return (
    <div key={props.name}>
      <Checkbox
        onChange={props.onChange}
        value={props.value}
        checked={props.checked}
        label={props.label}
        className="mb-3"
      />
    </div>
  )
}

function RepeatableTextController(props) {
  return (
    <RepeatableTextValue
      rows={props.rows}
      onChange={props.onChange}
      key={props.name}
      id={props.id}
    />
  )
}

function SelectController(props) {
  let options = []
  if (props.name === 'reference') {
    options = getContentsAsIdTitle(props.schemas)
  } else {
    options = props.options
  }

  return (
    <div key={props.name} className="mb-3">
      <Dropdown
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
        fluid
        search
        selection
        options={options}
      />
    </div>
  )
}

export class FieldsSettingsListItemController extends Component {
  state = { value: this.props.value, checked: this.props.checked }

  // constructor(props) {
  //   super(props)

  //   this.handleChange = debounce(this.handleChange, 500)
  // }

  handleChange = (event, data) => {
    this.props.handleChange(this.props.id, this.props.name, event, data)
  }

  shouldComponentUpdate(nextProps, nextState) {
    //Only update the component on state change and ignore any props change
    if (
      nextState.value !== this.state.value ||
      nextState.checked !== this.state.checked
    ) {
      return true
    }
    return false
  }

  onChange = (event, data) => {
    if (event['event']) {
      event.event.persist()
    } else {
      if (event['persist']) {
        event.persist()
      }
    }

    let subField = {
      checked: this.state.checked,
      type: this.props.type,
      value: this.state.value,
    }
    subField = setSchemaSubFieldValue(subField, event, data)

    this.handleChange(event, data)

    if (this.props.type === 'checkbox') {
      this.setState({
        checked: subField.checked,
      })
    } else {
      if (Array.isArray(subField.value)) {
        subField.value = [...subField.value]
      }
      this.setState({
        value: subField.value,
      })
    }
  }

  render() {
    let result = null
    switch (this.props.type) {
      case 'input':
        result = (
          <InputController
            name={this.props.name}
            value={this.state.value}
            label={this.props.label}
            type={this.props.inputType}
            required={this.props.required}
            onChange={this.onChange}
          />
        )
        break
      case 'checkbox':
        result = (
          <CheckboxController
            name={this.props.name}
            checked={this.state.checked}
            value={this.state.value}
            label={this.props.label}
            required={this.props.required}
            onChange={this.onChange}
          />
        )
        break
      case 'select':
        result = (
          <SelectController
            name={this.props.name}
            value={this.state.value}
            onChange={this.onChange}
            options={this.props.options}
            required={this.props.required}
            placeholder={this.props.label}
            schemas={this.props.schemas}
          />
        )
        break
      case 'RepeatableTextValue':
        result = (
          <RepeatableTextController
            rows={this.state.value}
            onChange={this.onChange}
            name={this.props.name}
            required={this.props.required}
            id={this.props.id}
          />
        )
        break

      case 'conditionalLogic':
        result = (
          <ConditionalLogicRules
            value={this.state.value}
            onChange={this.onChange}
            name={this.props.name}
            required={this.props.required}
            id={this.props.id}
          />
        )
        break

      default:
        /**
         * Unknown controller type
         *
         * @hook
         * @name FieldsSettingsListItemUnknownControllerType
         * @type applyFiltersSync
         * @since 1.0.0
         *
         * @param {?*} defaultValue The default value is null, unless it get filtered.
         * @param {Object} $this The FieldsSettingsListItemController component.
         */
        result = aventum.hooks.applyFiltersSync(
          'FieldsSettingsListItemUnknownControllerType',
          null,
          this
        )
        break
    }

    /**
     * The controller that will be rendered.
     *
     * @hook
     * @name FieldsSettingsListItemRenderedController
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {paramType} controller The controller.
     * @param {Object} $this The FieldsSettingsListItemController component.
     */
    result = aventum.hooks.applyFiltersSync(
      'FieldsSettingsListItemRenderedController',
      result,
      this
    )

    return result
  }
}

export default withTranslation()(FieldsSettingsListItemController)
