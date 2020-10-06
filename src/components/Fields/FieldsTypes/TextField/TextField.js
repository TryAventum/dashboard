import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Input from '../../../UI/Input/Input'

export class TextField extends Component {
  render() {
    let type = 'text'

    if (this.props.type && !['string'].includes(this.props.type)) {
      type = ['bigInteger', 'decimal'].includes(this.props.type)
        ? 'number'
        : this.props.type
    }

    const extraProps = {}
    if (type === 'number') {
      extraProps.step = 'any'
    }

    const inputField = (
      <Input
        id={this.props.htmlID}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        value={this.props.value}
        className="mt-1"
        {...extraProps}
        type={type}
      />
    )

    const validationMessage = this.props.errors ? (
      <p className={'text-red-600 mt-2 text-sm'}>
        {this.props.errors.join(', ') + '!'}
      </p>
    ) : null

    // const error = !!this.props.errors

    return (
      <div>
        {this.props.label && (
          <label
            htmlFor={this.props.htmlID}
            className="block text-sm font-medium leading-5 text-gray-700"
          >
            {this.props.label}{' '}
            {this.props.required && <span style={{ color: 'red' }}>*</span>}
          </label>
        )}
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
  }
}

export default withTranslation()(TextField)
