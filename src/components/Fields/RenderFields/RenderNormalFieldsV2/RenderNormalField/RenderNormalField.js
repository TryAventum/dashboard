import React, { useState, useEffect, useCallback } from 'react'
import { usePrevious } from '../../../../../shared/react-hooks'
import { useTranslation } from 'react-i18next'
import aventum from '../../../../../aventum'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import TextField from '../../../FieldsTypes/TextField/TextField'
import DateTime from '../../../FieldsTypes/DateTime/DateTime'
import DynamicTable from '../../../FieldsTypes/DynamicTable/DynamicTable'
import DropdownField from '../../../FieldsTypes/DropdownField/DropdownField'
import BooleanField from '../../../FieldsTypes/BooleanField/BooleanField'
import Relation from '../../../FieldsTypes/Relation/Relation'
import SmartButton from '../../../FieldsTypes/SmartButton/SmartButton'
import Upload from '../../../FieldsTypes/Upload/Upload'
import TextareaWrapper from '../../../../UI/TextareaWrapper/TextareaWrapper'
import RepeatableControls from '../../../../../hoc/RepeatableControls/RepeatableControls'
import FieldWrapper from '../../../../../hoc/FieldWrapper/FieldWrapper'
import {
  getFieldValue,
  fieldsNeedIds
} from '../../../../../shared/fieldsHelpers'
import { v1 as uuidv1 } from 'uuid'
import isEqual from 'lodash/isEqual'

/**
 * We mean by "normal" not "custom"
 */
function RenderNormalField (props) {
  const {
    id,
    value: propsValue,
    repeatable: propsRepeatable,
    type,
    handleChange,
    name,
    index: propsIndex,
    popup,
    placeholder,
    label,
    required,
    calendarFormat,
    format,
    calendarTimeFormat,
    calendarDateFormat,
    timeIntervals,
    showMonthDropdown,
    showYearDropdown,
    dropdownMode,
    reference,
    columns,
    options,
    match,
    history,
    location,
    clearable,
    textareaType
  } = props
  const { t } = useTranslation()
  const getAppropriateValue = useCallback(
    (currVal = null) => {
      /**
       * We check here if the current value equal to the propsValue in order to avoid setting
       * a new uuidv1 which result in rendering a new field instead of setting a new value for
       * the same field
       *  */

      if (currVal && Array.isArray(currVal)) {
        if (
          isEqual(
            fieldsNeedIds.includes(type)
              ? currVal.map((v) => v.value)
              : currVal,
            propsValue
          )
        ) {
          return currVal
        }
      }

      let value = null

      if (propsRepeatable) {
        if (Array.isArray(propsValue) && propsValue.length) {
          if (fieldsNeedIds.includes(type)) {
            value = []
            for (const v of propsValue) {
              value.push({ uuidv1: uuidv1(), value: v })
            }
          } else {
            value = propsValue
          }
        } else {
          if (fieldsNeedIds.includes(type)) {
            value = [{ value: '', uuidv1: uuidv1() }]
          } else {
            value = []
          }
        }
      } else {
        if (propsValue) {
          value = propsValue
        } else {
          value = ''
        }
      }

      return value
    },
    [propsRepeatable, type, propsValue]
  )

  const [value, setValue] = useState(getAppropriateValue())
  const prevPropsValue = usePrevious(propsValue)

  // const reorder = useCallback(newVal => {
  //   setValue(newVal)
  //   handleChange(
  //     newVal,
  //     type,
  //     name,
  //     propsIndex,
  //     0,
  //     propsRepeatable,
  //     null,
  //     null
  //   )
  // }, [props])

  const fieldsSettingsListDragEnd = useCallback(
    (result) => {
      if (result.type !== id) {
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

      setValue((prevValue) => {
        const currentList = [...prevValue]

        const draggableElement = prevValue.find((i) => i.uuidv1 === draggableId)

        // From source.index remove one item
        currentList.splice(source.index, 1)

        // Remove nothing and insert the draggableId
        currentList.splice(destination.index, 0, draggableElement)

        handleChange(
          currentList,
          type,
          name,
          propsIndex,
          0,
          propsRepeatable,
          null,
          null
        )

        return currentList
      })
    },
    [handleChange, id, name, propsIndex, propsRepeatable, type]
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

  function minusClicked (name, index) {
    let currentValue = value

    if (currentValue.length) {
      currentValue = [...currentValue]
    } else {
      currentValue = []
    }

    if (currentValue.length > 1) {
      // From index remove one item
      currentValue.splice(index, 1)

      setValue(currentValue)
      handleChange(
        currentValue,
        type,
        name,
        propsIndex,
        index,
        propsRepeatable,
        null,
        null
      )
    }
  }

  function plusClicked (name, index) {
    let currentValue = value

    if (currentValue && currentValue.length) {
      currentValue = [...currentValue]
    } else {
      currentValue = [{ value: '', uuidv1: uuidv1() }]
    }

    // Remove nothing and insert {value:'', uuidv1: uuidv1()} item
    currentValue.splice(index + 1, 0, { value: '', uuidv1: uuidv1() })

    setValue(currentValue)
    handleChange(
      currentValue,
      type,
      name,
      propsIndex,
      index,
      propsRepeatable,
      null,
      null
    )
  }

  useEffect(() => {
    if (!isEqual(prevPropsValue, propsValue)) {
      setValue(getAppropriateValue(value))
    }
  }, [getAppropriateValue, prevPropsValue, propsValue, value])

  function onChange (event, data, name, propsIndex, index, repeatable) {
    // if(event['event']){
    //   event.event.persist()
    // }else{
    //   if(event['persist']){
    if (event.persist) {
      event.persist()
    }
    //   }
    // }

    const val = getFieldValue(type, event, data)

    let currentValue = value

    if (repeatable) {
      if (currentValue && currentValue.length) {
        currentValue = [...currentValue]
        currentValue[index].value = val
      } else {
        currentValue = [{ value: val, uuidv1: uuidv1() }]
      }
    } else {
      currentValue = val
    }

    handleChange(
      currentValue,
      type,
      name,
      propsIndex,
      index,
      propsRepeatable,
      event,
      data
    )

    setValue(currentValue)

    // if (type === 'checkbox') {
    //   setState({
    //     checked: subField.checked
    //   })
    // } else {
    //   if(Array.isArray(subField.value)){
    //     subField.value = [...subField.value]
    //   }
    //   setState({
    //     value: subField.value
    //   })
    // }
  }

  let repeatable =
    propsRepeatable === false || propsRepeatable === true
      ? propsRepeatable
      : false

  repeatable = typeof repeatable === 'object' ? repeatable.checked : repeatable

  // const value = repeatable ? value.length ? value : repeatable ? [] : ''

  let result = null
  switch (type) {
    case 'string':
    case 'bigInteger':
    case 'decimal':
    case 'text':
    case 'email':
    case 'password':
      if (repeatable) {
        const flds = value.map((val, index) => {
          return (
            <Draggable key={val.uuidv1} draggableId={val.uuidv1} index={index}>
              {(draggableProvided, draggableSnapshot) => (
                <div
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.draggableProps}
                  key={index}
                >
                  <RepeatableControls
                    key={val.uuidv1}
                    args={[name, index, propsIndex]}
                    minusClicked={minusClicked}
                    plusClicked={plusClicked}
                    dragHandleProps={draggableProvided.dragHandleProps}
                  >
                    <TextField
                      match={match}
                      location={location}
                      history={history}
                      onChange={(event, data) =>
                        onChange(
                          event,
                          data,
                          name,
                          propsIndex,
                          index,
                          repeatable
                        )
                      }
                      type={type}
                      placeholder={t(placeholder || label)}
                      htmlID={val.uuidv1}
                      popup={popup}
                      label={t(label)}
                      key={id}
                      value={val.value}
                      required={required || null}
                      name={name}
                    />
                  </RepeatableControls>
                </div>
              )}
            </Draggable>
          )
        })
        result = (
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
        result = (
          <TextField
            match={match}
            location={location}
            history={history}
            onChange={(event, data) =>
              onChange(event, data, name, propsIndex, null, repeatable)
            }
            type={type}
            popup={popup}
            placeholder={t(placeholder || label)}
            htmlID={`${id}-0`}
            label={t(label)}
            key={id}
            value={value}
            required={required || null}
            name={name}
          />
        )
      }

      result = <FieldWrapper name={name} id={id}>{result}</FieldWrapper>
      break

    case 'dateTime':
    case 'time':
    case 'date':
      if (repeatable) {
        const flds = value.map((val, index) => {
          return (
            <Draggable key={val.uuidv1} draggableId={val.uuidv1} index={index}>
              {(draggableProvided, draggableSnapshot) => (
                <div
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.draggableProps}
                  key={index}
                >
                  <RepeatableControls
                    args={[name, index, propsIndex]}
                    minusClicked={minusClicked}
                    plusClicked={plusClicked}
                    dragHandleProps={draggableProvided.dragHandleProps}
                  >
                    <DateTime
                      match={match}
                      location={location}
                      history={history}
                      onChange={(event, data) =>
                        onChange(
                          event,
                          data,
                          name,
                          propsIndex,
                          index,
                          repeatable
                        )
                      }
                      type={type}
                      placeholder={t(placeholder || label)}
                      htmlID={val.uuidv1}
                      popup={popup}
                      label={t(label)}
                      key={id}
                      value={val.value}
                      format={format}
                      calendarFormat={calendarFormat}
                      calendarTimeFormat={calendarTimeFormat}
                      calendarDateFormat={calendarDateFormat}
                      timeIntervals={timeIntervals}
                      showMonthDropdown={showMonthDropdown}
                      showYearDropdown={showYearDropdown}
                      dropdownMode={dropdownMode}
                      required={required || null}
                      name={name}
                    />
                  </RepeatableControls>
                </div>
              )}
            </Draggable>
          )
        })

        result = (
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
        result = (
          <DateTime
            match={match}
            location={location}
            history={history}
            onChange={(event, data) =>
              onChange(event, data, name, propsIndex, null, repeatable)
            }
            type={type}
            popup={popup}
            placeholder={t(placeholder || label)}
            htmlID={`${id}-0`}
            label={t(label)}
            key={id}
            value={value}
            format={format}
            calendarFormat={calendarFormat}
            calendarTimeFormat={calendarTimeFormat}
            calendarDateFormat={calendarDateFormat}
            timeIntervals={timeIntervals}
            showMonthDropdown={showMonthDropdown}
            showYearDropdown={showYearDropdown}
            dropdownMode={dropdownMode}
            required={required || null}
            name={name}
          />
        )
      }

      result = <FieldWrapper name={name} id={id}>{result}</FieldWrapper>
      break
    case 'relation':
      result = (
        <Relation
          match={match}
          location={location}
          history={history}
          label={t(label)}
          onChange={(event, data) => onChange(event, data, name, propsIndex)}
          multiple={repeatable}
          value={value}
          required={required || null}
          name={name}
          reference={reference}
        />
      )
      result = <FieldWrapper name={name} id={id}>{result}</FieldWrapper>
      break
    case 'dynamictable':
      result = (
        <DynamicTable
          match={match}
          location={location}
          history={history}
          onChange={(event, data) => onChange(event, data, name, propsIndex)}
          popup={popup}
          label={t(label)}
          value={value}
          columns={columns}
          placeholder={t(placeholder || label)}
          required={required || null}
          name={name}
        />
      )
      result = <FieldWrapper name={name} id={id}>{result}</FieldWrapper>
      break
    case 'boolean':
      result = (
        <div>
          <BooleanField
            match={match}
            location={location}
            history={history}
            onChange={(event, data) => onChange(event, data, name, propsIndex)}
            // value={value ? value : ''}
            checked={value}
            popup={popup}
            label={label ? t(label) : ''}
          />
        </div>
      )
      result = <FieldWrapper name={name} id={id}>{result}</FieldWrapper>
      break
    case 'Button':
      result = (
        <div>
          <SmartButton
            {...props}
            match={match}
            location={location}
            history={history}
            name={name}
          />
        </div>
      )
      break
    case 'select':
      result = (
        <DropdownField
          match={match}
          location={location}
          history={history}
          clearable={clearable}
          onChange={(event, data) => onChange(event, data, name, propsIndex)}
          popup={popup}
          label={t(label)}
          value={value}
          placeholder={t(placeholder || label)}
          fluid
          search
          selection
          multiple={repeatable}
          options={options}
          required={required || null}
          name={name}
        />
      )
      result = <FieldWrapper name={name} id={id}>{result}</FieldWrapper>
      break
    case 'textarea':
      if (repeatable) {
        const flds = value.map((val, index) => {
          return (
            <Draggable key={val.uuidv1} draggableId={val.uuidv1} index={index}>
              {(draggableProvided, draggableSnapshot) => (
                <div
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.draggableProps}
                  key={index}
                >
                  <RepeatableControls
                    key={val.uuidv1}
                    args={[name, index, propsIndex]}
                    minusClicked={minusClicked}
                    plusClicked={plusClicked}
                    dragHandleProps={draggableProvided.dragHandleProps}
                  >
                    <div>
                      <TextareaWrapper
                        match={match}
                        location={location}
                        history={history}
                        textareaType={textareaType}
                        onChange={(event, data) =>
                          onChange(
                            event,
                            data,
                            name,
                            propsIndex,
                            index,
                            repeatable
                          )
                        }
                        value={val.value}
                        label={t(label)}
                        id={`${id}${propsIndex || 0}${index}`}
                        required={required || null}
                      />
                    </div>
                  </RepeatableControls>
                </div>
              )}
            </Draggable>
          )
        })

        result = (
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
        result = (
          <div>
            <TextareaWrapper
              match={match}
              location={location}
              history={history}
              textareaType={textareaType}
              onChange={(event, data) =>
                onChange(event, data, name, propsIndex, null, repeatable)
              }
              label={t(label)}
              value={value}
              required={required || null}
              id={id}
            />
          </div>
        )
      }

      result = <FieldWrapper name={name} id={id}>{result}</FieldWrapper>
      break
    case 'upload':
      result = (
        <div>
          <Upload
            match={match}
            location={location}
            history={history}
            onChange={(event, data) => onChange(event, data, name, propsIndex)}
            multiple={repeatable}
            value={value}
            label={t(label)}
            uniqueID={propsIndex + id}
            required={required || null}
            name={name}
          />
        </div>
      )
      result = <FieldWrapper name={name} id={id}>{result}</FieldWrapper>
      break
    default:
      result = null
      break
  }
  return result
}

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */

  return (
    isEqual(prevProps.value, nextProps.value) &&
    isEqual(prevProps.handleChange, nextProps.handleChange)
  )
}

export default React.memo(RenderNormalField, areEqual)
