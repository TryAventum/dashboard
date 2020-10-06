import React, { Component } from 'react'
import Dropdown from '../../../UI/Dropdown/Dropdown'
import { withTranslation } from 'react-i18next'
import aventum from '../../../../aventum'

export class DropdownField extends Component {
  render () {
    /**
     * The render method of the DropdownField just started executing.
     *
     * @hook
     * @name DropdownFieldBeforeRender
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The DropdownField component.
     */
    aventum.hooks.doActionSync('DropdownFieldBeforeRender', this)

    let validationMessage = this.props.errors ? (
      <p className={'text-red-600 mt-2 text-sm'}>
        {this.props.errors.join(', ') + '!'}
      </p>
    ) : null

    /**
     * Validation message of the DropdownField.
     *
     * @hook
     * @name DropdownFieldValidationMessage
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} validationMessage The message component that will be filtered.
     * @param {Object} $this The DropdownField component.
     */
    validationMessage = aventum.hooks.applyFiltersSync(
      'DropdownFieldValidationMessage',
      validationMessage,
      this
    )

    let inputField = (
      <Dropdown
        onChange={this.props.onChange}
        value={this.props.value}
        placeholder={`${this.props.placeholder}${
          this.props.required && !this.props.label
            ? this.props.t('(required)')
            : ''
        }`}
        search
        clearable={this.props.clearable}
        multiple={this.props.multiple}
        options={this.props.options || []}
      />
    )

    /**
     * The Dropdown component that used in DropdownField.
     *
     * @hook
     * @name DropdownFieldSUIDropdown
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} dropdownField The field that will be rendered.
     * @param {Object} $this The BooleanField component.
     */
    inputField = aventum.hooks.applyFiltersSync(
      'DropdownFieldSUIDropdown',
      inputField,
      this
    )

    // const error = !!this.props.errors

    let result = (
      <div>
        <label className="mb-1 block" htmlFor={this.props.htmlFor}>
          {this.props.label}{' '}
          {this.props.label && this.props.required && (
            <span style={{ color: 'red' }}>*</span>
          )}
        </label>
        {this.props.popup ? (
          <div>
            {inputField}
            <p className={'text-gray-600 mt-2 text-sm'}>{this.props.popup}</p>
          </div>
        ) : (
          inputField
        )}
        {validationMessage}
      </div>
    )

    /**
     * What will DropdownField component render.
     *
     * @hook
     * @name DropdownFieldRender
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} result The returned value from the render method.
     * @param {Object} $this The DropdownField component.
     */
    result = aventum.hooks.applyFiltersSync('DropdownFieldRender', result, this)

    return result
  }
}

export default withTranslation()(DropdownField)
