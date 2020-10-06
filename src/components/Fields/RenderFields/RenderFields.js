import React, { useReducer, useCallback } from 'react'
import RenderCustomField from './RenderCustomField/RenderCustomField'
import { DragDropContext } from 'react-beautiful-dnd'
import RenderNormalField from './RenderNormalFieldsV2/RenderNormalField/RenderNormalField'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../../store/actions/index'
import { prepareForSave, fieldsNeedIds } from '../../../shared/fieldsHelpers'
import aventum from '../../../aventum'
import isEqual from 'lodash/isEqual'
import { usePrevious } from '../../../shared/react-hooks'

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      const newState = { ...state, [action.name]: action.value }
      return newState
    default:
      throw new Error()
  }
}

function RenderFields(props) {
  const [state, dispatch] = useReducer(reducer, {})
  const prevState = usePrevious(state)
  const reduxDispatch = useDispatch()
  const currentContentValues = useSelector(
    (state) => state.content.currentContentValues
  )
  const prevCurrentContentValues = usePrevious(currentContentValues)

  const onDragEnd = (result) => {
    /**
     * Fires when dragging a controller ends.
     *
     * @hook
     * @name RenderFieldsOnDragEnd
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} result Object contains the state of what happen after the drag like
     *                        destination, source, and draggableId.
     *                        [For more info see](https://github.com/atlassian/react-beautiful-dnd)
     * @param {Object} $this The RenderFields component.
     */
    result = aventum.hooks.applyFiltersSync(
      'RenderFieldsOnDragEnd',
      result,
      this
    )

    /**
     * Fires when dragging a controller ends.
     *
     * @hook
     * @name RenderFieldsOnDragEnd
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} result Object contains the state of what happen after the drag like
     *                        destination, source, and draggableId.
     *                        [For more info see](https://github.com/atlassian/react-beautiful-dnd)
     * @param {Object} $this The RenderFields component.
     */
    aventum.hooks.doActionSync('RenderFieldsOnDragEnd', result, this)
  }

  const handleNormalChange = useCallback(
    (value, fieldType, name, propsIndex, index, repeatable, event, data) => {
      let currentValue = state[name] || currentContentValues[name]

      if (repeatable && fieldsNeedIds.includes(fieldType)) {
        currentValue = value.map((v) => v.value)
      } else {
        currentValue = value
      }

      dispatch({
        type: 'SET',
        name,
        value: currentValue,
      })

      reduxDispatch(
        actions.setCurrentContentValues({
          name,
          value: currentValue,
        })
      )
    },
    [isEqual(currentContentValues, prevCurrentContentValues), reduxDispatch, isEqual(state, prevState)]
  )

  let field = null

  const fields = props.content.fields.map((f) => {
    let result = null

    var cleanedField = {}
    if (f.fields) {
      cleanedField = prepareForSave({ fields: [f] })
      cleanedField = cleanedField.fields[0]
    }

    if (f.type !== 'custom') {
      result = (
        <RenderNormalField
          {...props}
          key={f.id}
          id={f.id}
          {...cleanedField}
          handleChange={handleNormalChange}
          value={currentContentValues[cleanedField.name]}
        />
      )
    } else {
      // Custom field data
      // Using just find() cause issues because it gave us the object by reference
      const customFieldData = {
        ...props.customFields.find((e) => e.name === f.name),
      }

      // Add the other data to the field data
      // customFieldData.fields = [...customFieldData.fields, ...f.fields]

      result = (
        <RenderCustomField
          {...cleanedField}
          {...props}
          key={f.id}
          customFieldData={customFieldData}
          content={props.content}
          customFields={props.customFields}
          currentContentValues={currentContentValues}
        />
      )
    }

    return result
  })

  field = (
    <div className="fields">
      <DragDropContext onDragEnd={onDragEnd}>{fields}</DragDropContext>
    </div>
  )

  return field
}

export default RenderFields
