import React from 'react'
import Checkbox from '../../../UI/Checkbox/Checkbox'
import aventum from '../../../../aventum'
import { boolean } from 'boolean'

export function BooleanField ({ onChange, checked, label, popup }) {
  /**
   * The render method of the BooleanField just started executing.
   *
   * @hook
   * @name BooleanFieldBeforeRender
   * @type doActionSync
   * @since 1.0.0
   *
   * @param {Object} $this The BooleanField component.
   */
  aventum.hooks.doActionSync('BooleanFieldBeforeRender', this)

  let checkboxField = (
    <Checkbox
      onChange={onChange}
      checked={boolean(checked)}
      label={label}
      help={popup}
    />
  )

  /**
   * What will BooleanField component render.
   *
   * @hook
   * @name BooleanFieldRender
   * @type applyFiltersSync
   * @since 1.0.0
   *
   * @param {Object} result The returned value from the render method.
   * @param {Object} $this The BooleanField component.
   */
  checkboxField = aventum.hooks.applyFiltersSync(
    'BooleanFieldRender',
    checkboxField,
    this
  )

  return checkboxField
}

export default BooleanField
