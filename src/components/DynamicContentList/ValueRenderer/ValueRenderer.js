import React, { Component } from 'react'
import { FaTimes, FaCheck } from 'react-icons/fa'
import { shorten } from '../../../shared/utility'
import aventum from '../../../aventum'

export class ValueRenderer extends Component {
  render () {
    /**
     * The render method of the ValueRenderer component just called.
     *
     * @hook
     * @name ValueRendererRenderStarted
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The ValueRenderer component.
     */
    aventum.hooks.doActionSync('ValueRendererRenderStarted', this)
    let value = ''

    switch (this.props.field.type) {
      case 'string':
      case 'decimal':
      case 'bigInteger':
      case 'date':
      case 'time':
      case 'dateTime':
      case 'text':
      case 'email':
      case 'password':
      case 'relation':
      case 'textarea':
        value = this.props.values[
          this.props.field.fields.find(h => h.name === 'name').value
        ]

        value = Array.isArray(value)
          ? value.map(t => shorten(t, 20)).join(', ')
          : shorten(value, 20)
        break
      case 'boolean':
        value = this.props.values[
          this.props.field.fields.find(h => h.name === 'name').value
        ]

        value = value ? (
          <FaCheck className="text-green-500" />
        ) : (
          <FaTimes className="text-red-500" />
        )
        break
      case 'select':
        value = this.props.values[
          this.props.field.fields.find(h => h.name === 'name').value
        ]

        const options = this.props.field.fields.find(e => e.name === 'options')
          .value

        let optionText = ''

        if (Array.isArray(value)) {
          optionText = options
            .filter(o => value.includes(o.value))
            .map(e => e.label)
          value = optionText.join(', ')
        } else {
          const tmp = options.find(o => o.value === value)
          optionText = tmp ? tmp.label : ''
          value = optionText
        }
        break
      case 'upload':
        value = this.props.values[
          this.props.field.fields.find(h => h.name === 'name').value
        ]

        const uploads = Array.isArray(value)
          ? this.props.uploads.filter(y => value.includes(y.id))
          : this.props.uploads.find(u => u.id === value)

        if (Array.isArray(uploads)) {
          value = uploads.map(u => {
            return (
              <img className="h-10 mr-1 inline" key={u.id} src={u.path} alt="" />
            )
          })
        } else {
          if (uploads) {
            value = (
              <img className="h-10 mr-1 inline" src={uploads.path} alt="" />
            )
          } else {
            value = ''
          }
        }
        break
      default:
        /**
         * Filter the default value for the unknown field type of the ValueRenderer of the DynamicContentList.
         *
         * @hook
         * @name ValueRendererUnknownField
         * @type applyFiltersSync
         * @since 1.0.0
         *
         * @param {?*} defaultValue The default value that returned for the unknown field type.
         * @param {Object} $this The ValueRenderer component.
         */
        value = aventum.hooks.applyFiltersSync(
          'ValueRendererUnknownField',
          null,
          this
        )
        break
    }

    /**
     * The final value for the field before the render
     *
     * @hook
     * @name ValueRendererFinalValue
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {*} value The final value
     * @param {Object} $this The ValueRenderer component.
     */
    value = aventum.hooks.applyFiltersSync(
      'ValueRendererFinalValue',
      value,
      this
    )

    return <>{value}</>
  }
}

export default ValueRenderer
