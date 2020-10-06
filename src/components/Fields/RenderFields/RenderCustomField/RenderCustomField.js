import React, { useState, useEffect, useCallback } from 'react'
import Panel from '../../../UI/Panel/Panel'
import RenderNormalFields from '../RenderNormalFieldsV2/RenderNormalFields'
import aventum from '../../../../aventum'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../../../store/actions/index'
import {
  prepareForSave,
  fieldsNeedIds,
  setDefaultValues,
} from '../../../../shared/fieldsHelpers'
import RepeatableControls from '../../../../hoc/RepeatableControls/RepeatableControls'
import { v1 as uuidv1 } from 'uuid'
import ConditionalLogicValidator from '../../../../shared/conditional-logic-validator'
import { usePrevious } from '../../../../shared/react-hooks'
import isEqual from 'lodash/isEqual'

function RenderCustomField({
  currentContentValues,
  customFieldData: { name: customFieldName } = {},
  customFieldData,
  content,
  match,
  location,
  history,
  handleClick,
  id,
  required,
}) {
  const { t } = useTranslation()
  let errors = useSelector((state) => state.form.errors)
  const dispatch = useDispatch()

  const repeatable = content.fields
    .find((e) => e.name === customFieldName)
    .fields.find((e) => e.name === 'repeatable').checked

  let customFieldValues = currentContentValues[customFieldName]
  const prevCustomFieldValues = usePrevious(customFieldValues)

  const getInitUuids = () => {
    const uuids = []
    if (repeatable) {
      if (customFieldValues && customFieldValues.length) {
        customFieldValues.forEach(() => {
          uuids.push(uuidv1())
        })
      } else {
        uuids.push(uuidv1())
      }
    }

    return uuids
  }

  let [uuids, setUuids] = useState(getInitUuids())

  if (
    repeatable &&
    !!prevCustomFieldValues &&
    customFieldValues &&
    customFieldValues.length !== uuids.length
  ) {
    uuids = getInitUuids()
    setUuids(uuids)
  }

  const setCustomFieldValue = (newValue) => {
    dispatch(
      actions.setCurrentContentValues({
        name: [customFieldName],
        value: repeatable ? [...newValue] : { ...newValue },
      })
    )
  }

  const handleChange = useCallback(
    (val, fieldType, name, propsIndex, index, isRepeatable, event, data) => {
      let currentValue = customFieldValues

      // let currentValue = state[name]

      if (repeatable) {
        if (currentValue && currentValue.length) {
          // From propsIndex remove one item, the item that removed will be returned in an array
          const currentObject = currentValue.splice(propsIndex, 1)[0]

          if (isRepeatable && fieldsNeedIds.includes(fieldType)) {
            if (currentObject[name]) {
              currentObject[name] = val.map((v) => v.value)
            } else {
              currentObject[name] = val.map((v) => v.value)
            }
          } else {
            currentObject[name] = val
          }

          // Remove nothing and insert the draggableId
          currentValue.splice(propsIndex, 0, currentObject)
        } else {
          currentValue = [
            {
              [name]:
                isRepeatable && fieldsNeedIds.includes(fieldType)
                  ? val.map((v) => v.value)
                  : val,
            },
          ]
        }
      } else {
        if (currentValue) {
          if (isRepeatable && fieldsNeedIds.includes(fieldType)) {
            if (currentValue[name]) {
              currentValue[name] = val.map((v) => v.value)
            } else {
              currentValue[name] = val.map((v) => v.value)
            }
          } else {
            currentValue[name] = val
          }
        } else {
          currentValue = {
            [name]:
              isRepeatable && fieldsNeedIds.includes(fieldType)
                ? val.map((v) => v.value)
                : val,
          }
        }
      }

      setCustomFieldValue(currentValue)
    },
    [
      isEqual(customFieldValues, prevCustomFieldValues),
      customFieldName,
      repeatable,
      setCustomFieldValue,
    ]
  )

  const plusClicked = (index) => {
    const currentValue = currentContentValues[customFieldName]

    // Remove nothing and insert the new item
    currentValue.splice(index + 1, 0, setDefaultValues(customFieldData))
    uuids.splice(index + 1, 0, uuidv1())
    setUuids(uuids)

    dispatch(
      actions.setCurrentContentValues({
        name: customFieldName,
        value: [...currentValue],
        index,
      })
    )
  }

  const minusClicked = (index) => {
    const currentValue = currentContentValues[customFieldName]

    if (!currentValue || currentValue.length <= 1) {
      return
    }

    // From index remove one item
    currentValue.splice(index, 1)

    uuids.splice(index, 1)
    setUuids(uuids)

    dispatch(
      actions.setCurrentContentValues({
        name: customFieldName,
        value: [...currentValue],
        index,
      })
    )
  }

  const subFieldPlusClicked = (name, index, propsIndex) => {
    let currentValue = currentContentValues[customFieldName]

    if (repeatable) {
      if (currentValue && currentValue.length) {
        // From propsIndex remove one item, the item that removed will be returned in an array
        const currentObject = currentValue.splice(propsIndex, 1)[0]

        if (currentObject[name]) {
          // Remove nothing and insert ''
          currentObject[name].splice(index + 1, 0, '')
          // currentObject[name][index + 1] = ''
        } else {
          currentObject[name] = ['', '']
        }

        // Remove nothing and insert the draggableId
        currentValue.splice(propsIndex, 0, currentObject)
      } else {
        currentValue = [{ [name]: ['', ''] }]
      }
    } else {
      if (currentValue) {
        if (currentValue[name]) {
          // currentValue[name][index + 1] = ''
          // Remove nothing and insert ''
          currentValue[name].splice(index + 1, 0, '')
        } else {
          currentValue[name] = ['', '']
        }
      } else {
        currentValue = { [name]: ['', ''] }
      }
    }

    setCustomFieldValue(currentValue)
  }

  const fieldsSettingsListDragEnd = useCallback(
    (result) => {
      if (result.type !== id) {
        return
      }

      const { destination, source } = result

      if (!destination) {
        return
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return
      }

      const currentValue = currentContentValues[customFieldName]

      setUuids((prevUuids) => {
        const draggableElement = currentValue[source.index]
        const draggableUuid = prevUuids[source.index]

        // From source.index remove one item
        currentValue.splice(source.index, 1)
        prevUuids.splice(source.index, 1)

        // Remove nothing and insert the draggableId
        currentValue.splice(destination.index, 0, draggableElement)
        prevUuids.splice(destination.index, 0, draggableUuid)

        dispatch(
          actions.setCurrentContentValues({
            name: customFieldName,
            value: [...currentValue],
          })
        )

        return prevUuids
      })
    },
    [currentContentValues, customFieldName, dispatch, id]
  )

  useEffect(() => {
    aventum.hooks.addAction(
      'RenderFieldsOnDragEnd',
      `a${id}`,
      fieldsSettingsListDragEnd
    )
    return () => {
      aventum.hooks.removeAction('RenderFieldsOnDragEnd', `a${id}`)
    }
  }, [fieldsSettingsListDragEnd, id])

  const subFieldMinusClicked = (name, index, propsIndex) => {
    const currentValue = currentContentValues[customFieldName]

    if (repeatable) {
      if (currentValue && currentValue.length) {
        // From propsIndex remove one item, the item that removed will be returned in an array
        const currentObject = currentValue.splice(propsIndex, 1)[0]

        if (currentObject[name] && currentObject[name].length > 1) {
          // From index remove one item
          currentObject[name].splice(index, 1)

          // Remove nothing and insert the draggableId
          currentValue.splice(propsIndex, 0, currentObject)

          setCustomFieldValue(currentValue)
        }
      }
    } else {
      if (currentValue) {
        if (currentValue[name] && currentValue[name].length > 1) {
          // From index remove one item
          currentValue[name].splice(index, 1)
          setCustomFieldValue(currentValue)
        }
      }
    }
  }

  let fields

  if (repeatable && (!customFieldValues || !customFieldValues.length)) {
    const val = {}
    customFieldValues = [val]
    dispatch(
      actions.setCurrentContentValues({
        name: customFieldName,
        value: [val],
        index: 0,
      })
    )
  }

  const cleanedField = prepareForSave(customFieldData)

  if (repeatable) {
    const flds = customFieldValues.map((e, index) => {
      return (
        <Draggable key={uuids[index]} draggableId={uuids[index]} index={index}>
          {(draggableProvided, draggableSnapshot) => (
            <div
              ref={draggableProvided.innerRef}
              {...draggableProvided.draggableProps}
              key={index}
            >
              <RepeatableControls
                key={uuids[index]}
                index={index}
                minusClicked={minusClicked}
                plusClicked={plusClicked}
                dragHandleProps={draggableProvided.dragHandleProps}
                childrenWrapperClass="custom-field-fields"
              >
                <RenderNormalFields
                  puuid={uuids[index]}
                  fields={ConditionalLogicValidator.getVisibleFields(
                    cleanedField.fields,
                    e
                  )}
                  handleChange={handleChange}
                  index={index}
                  match={match}
                  location={location}
                  history={history}
                  handleClick={handleClick}
                  currentContentValues={e}
                  mainFieldName={customFieldName}
                  minusClicked={subFieldMinusClicked}
                  plusClicked={subFieldPlusClicked}
                />
              </RepeatableControls>
            </div>
          )}
        </Draggable>
      )
    })

    fields = (
      <Droppable droppableId={id} type={id}>
        {(droppableProvided, droppableSnapshot) => (
          <div ref={droppableProvided.innerRef} className="sub-fields">
            {flds}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    )
  } else {
    if (customFieldValues && Object.keys(customFieldValues).length) {
      fields = (
        <RenderNormalFields
          fields={ConditionalLogicValidator.getVisibleFields(
            cleanedField.fields,
            customFieldValues
          )}
          match={match}
          location={location}
          history={history}
          handleClick={handleClick}
          handleChange={handleChange}
          index={0}
          currentContentValues={customFieldValues}
          mainFieldName={customFieldName}
          minusClicked={subFieldMinusClicked}
          plusClicked={subFieldPlusClicked}
        />
      )
    } else {
      fields = (
        <RenderNormalFields
          fields={ConditionalLogicValidator.getVisibleFields(
            cleanedField.fields,
            null
          )}
          match={match}
          location={location}
          history={history}
          handleClick={handleClick}
          handleChange={handleChange}
          index={0}
          currentContentValues={null}
          mainFieldName={customFieldName}
          minusClicked={subFieldMinusClicked}
          plusClicked={subFieldPlusClicked}
        />
      )
    }
  }

  errors = errors ? errors[id] : null
  errors = errors ? (
    <span className="text-red-500 inline-block mt-2 capitalize p-4">
      {errors.join(', ') + '!'}
    </span>
  ) : null

  return (
    <Panel
      key={customFieldData.id}
      className={`${
        errors ? 'border border-red-400 border-solid overflow-hidden' : ''
      } mb-4`}
      data-testid-name={customFieldData.name}
    >
      <Panel.Header className="text-xl font-medium leading-5 text-gray-700">
        {' '}
        {t(customFieldData.title)}{' '}
        {required && <span style={{ color: 'red' }}>*</span>}
      </Panel.Header>
      <Panel.Content className={!repeatable ? 'custom-field-fields' : ''}>
        {fields}
      </Panel.Content>
      {errors}
    </Panel>
  )
}

// function areEqual(prevProps, nextProps) {
//   /*
//   return true if passing nextProps to render would return
//   the same result as passing prevProps to render,
//   otherwise return false
//   */

//   return isEqual(
//     prevProps.currentContentValues[prevProps.customFieldData['name']],
//     nextProps.currentContentValues[nextProps.customFieldData['name']]
//   )
// }

export default RenderCustomField
