import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Dropdown from '../../UI/Dropdown/Dropdown'
import Input from '../../UI/Input/Input'
import Checkbox from '../../UI/Checkbox/Checkbox'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import * as actions from '../../../store/actions/index'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { getObjectById } from '../../../shared/utility'
import SelectContentModal from '../../UI/SelectContentModal/SelectContentModal'
import SelectUploadsModal from '../../UI/SelectUploadsModal/SelectUploadsModal'
import { getCondLogicNewRule } from '../../../shared/fieldsHelpers'
import { usePrevious } from '../../../shared/react-hooks'

const needSubFieldLogicType = [
  'bigInteger',
  'decimal',
  'string',
  'textarea',
  'date',
  'time',
  'dateTime'
]
export function ConditionalLogicRules ({
  value,
  schemas,
  currentEditedSchemaOrField,
  onChange,
  id,
  setSelectedUploads
}) {
  const [rules, setRules] = useState(() => [getCondLogicNewRule()])
  const [actionType, setActionType] = useState('show')
  const [logicType, setLogicType] = useState('all')
  const [enable, setEnable] = useState(false)
  const [valueSet, setValueSet] = useState(false)

  const { t } = useTranslation()

  const prevValue = usePrevious(value)

  useEffect(() => {
    if ((!prevValue && value) || (!valueSet && value)) {
      setRules(value.rules)
      setActionType(value.actionType)
      setLogicType(value.logicType)
      setEnable(value.enable)
      setValueSet(true)
    }
  }, [prevValue, value, valueSet])

  const getValidDateValue = (val) => {
    try {
      if (val instanceof Date && !isNaN(val)) {
        return val
      } else {
        val = new Date(val)
        if (!val instanceof Date || isNaN(val)) {
          val = new Date()
        }
      }
    } catch (error) {
      val = new Date()
    }

    return val
  }

  const setRuleValue = (rule, value) => {
    const newRules = [...rules].map((c) => {
      if (rule.ruleId === c.ruleId) {
        c.value = value
        return {
          ...c
        }
      }
      return c
    })

    setRules(newRules)
    setValueSet(true)
  }

  useEffect(() => {
    onChange({
      enable,
      actionType,
      logicType,
      rules
    })
  }, [actionType, enable, logicType, onChange, rules])

  const onEnableChange = () => {
    setEnable((ov) => {
      return !ov
    })
    setValueSet(true)
  }

  const addRule = (data) => {
    // Remove nothing and insert the new row
    const newRules = [...rules]
    newRules.splice(data.index + 1, 0, getCondLogicNewRule())

    setRules(newRules)
    setValueSet(true)
  }

  const removeRule = (data) => {
    const newRules = [...rules]

    if (newRules.length === 1) {
      const tmp = [getCondLogicNewRule()]
      setRules(tmp)
      setValueSet(true)
    }

    // From index remove one item
    newRules.splice(data.index, 1)

    setRules(newRules)
    setValueSet(true)
  }

  const condSelected = (rule, value) => {
    const newRules = [...rules].map((c) => {
      if (rule.ruleId === c.ruleId) {
        c.operator = value
      }
      return c
    })

    setRules(newRules)
    setValueSet(true)
  }

  const subFieldLogicTypeChanges = (rule, value) => {
    const newRules = [...rules].map((c) => {
      if (rule.ruleId === c.ruleId) {
        c.logicType = value
      }
      return c
    })

    setRules(newRules)
    setValueSet(true)
  }

  const getConOptions = (rule = null) => {
    switch (rule.type) {
      case 'select':
        if (rule.repeatable) {
          return [
            { label: t('is'), value: '=' },
            { label: t('isnot'), value: '!=' },
            { label: t('contains'), value: 'c' },
            { label: t('doesnotcontain'), value: 'dc' }
          ]
        } else {
          return [
            { label: t('is'), value: '=' },
            { label: t('isnot'), value: '!=' },
            { label: t('contains'), value: 'c' },
            { label: t('doesnotcontain'), value: 'dc' },
            { label: t('greater than'), value: '>' },
            { label: t('less than'), value: '<' },
            { label: t('starts with'), value: 'sw' },
            { label: t('ends with'), value: 'ew' }
          ]
        }

      case 'bigInteger':
      case 'decimal':
      case 'string':
      case 'textarea':
        return [
          { label: t('is'), value: '=' },
          { label: t('isnot'), value: '!=' },
          { label: t('contains'), value: 'c' },
          { label: t('doesnotcontain'), value: 'dc' },
          { label: t('greater than'), value: '>' },
          { label: t('less than'), value: '<' },
          { label: t('starts with'), value: 'sw' },
          { label: t('ends with'), value: 'ew' }
        ]

      case 'boolean':
        return [
          { label: t('is'), value: '=' },
          { label: t('isnot'), value: '!=' }
        ]
      case 'date':
      case 'time':
      case 'dateTime':
        return [
          { label: t('is'), value: '=' },
          { label: t('isnot'), value: '!=' },
          { label: t('greater than'), value: '>' },
          { label: t('less than'), value: '<' }
        ]
      case 'relation':
      case 'upload':
      default:
        if (rule.repeatable) {
          return [
            { label: t('is'), value: '=' },
            { label: t('isnot'), value: '!=' },
            { label: t('contains'), value: 'c' },
            { label: t('doesnotcontain'), value: 'dc' }
          ]
        } else {
          return [
            { label: t('is'), value: '=' },
            { label: t('isnot'), value: '!=' }
          ]
        }
    }
  }

  const fieldSelected = (rule, value) => {
    const newRules = [...rules].map((c) => {
      if (rule.ruleId === c.ruleId) {
        c.fieldId = value
        c.value = rule.value
        c.operator = rule.operator || ''
        return {
          ...c
        }
      }
      return c
    })

    setRules(newRules)
    setValueSet(true)
  }

  let wantedFields = currentEditedSchemaOrField.fields
    ? currentEditedSchemaOrField.fields.filter(
      // If the field is not custom field and it is not the same field that the conditional logic appears on then we want it.
      (f) => !['custom'].includes(f.type) && f.id !== id
    )
    : []

  wantedFields = wantedFields.map((f) => {
    const obj = {
      label: f.fields.find((o) => o.name === 'label').value,
      name: f.fields.find((o) => o.name === 'name').value,
      type: f.type,
      fieldId: f.id
    }

    if (f.type === 'select') {
      obj.options = f.fields.find((o) => o.name === 'options').value
    }

    if (f.type === 'relation') {
      const reference = f.fields.find((o) => o.name === 'reference').value
      if (reference) {
        obj.content = getObjectById(schemas, reference).name
      } else {
        obj.content = ''
      }
    }

    if (f.type !== 'boolean') {
      obj.repeatable = f.fields.find((o) => o.name === 'repeatable').checked
    }

    return obj
  })

  const fieldsOptions = wantedFields.map((y) => {
    return { label: y.label, value: y.fieldId }
  })

  return (
    <div>
      <Checkbox
        onChange={onEnableChange}
        value="enable"
        checked={enable}
        label={t('ConditionalLogic')}
      />

      {enable && (
        <div className={'flex flex-col my-3 conditional-logic'}>
          <div className="flex items-center">
            <Dropdown
              inline
              options={[
                { label: t('Show'), value: 'show' },
                { label: t('Hide'), value: 'hide' }
              ]}
              onChange={(event, data) => {
                setActionType(data.value)
                setValueSet(true)
              }}
              value={actionType}
            />{' '}
            {t('thisfieldif')}{' '}
            <Dropdown
              inline
              options={[
                { label: t('All'), value: 'all' },
                { label: t('Any'), value: 'any' }
              ]}
              onChange={(event, data) => {
                setLogicType(data.value)
                setValueSet(true)
              }}
              value={logicType}
            />{' '}
            {t('ofthefollowingmatch')}
          </div>
          {rules.map((r, index) => {
            const field = wantedFields.find((f) => f.fieldId === r.fieldId)
            const nSFLT =
              !!(field &&
              needSubFieldLogicType.includes(field.type) &&
              field.repeatable)
            const c = {
              ...r,
              repeatable: field ? field.repeatable : null,
              options: field ? field.options : [],
              name: field ? field.name : '',
              type: field ? field.type : '',
              content: field ? field.content : ''
            }
            const value =
              c.value || c.value === false ? c.value : c.repeatable ? [] : ''
            return (
              <div key={c.ruleId} className={'flex'}>
                <div className={'flex w-11/12 items-center'}>
                  {nSFLT && (
                    <div className={'flex-1 p-1'}>
                      <Dropdown
                        placeholder={t('LogicType')}
                        fluid
                        selection
                        options={[
                          { label: t('All'), value: 'all' },
                          { label: t('Any'), value: 'any' }
                        ]}
                        onChange={(event, data) =>
                          subFieldLogicTypeChanges(c, data.value)
                        }
                        value={c.logicType}
                      />
                    </div>
                  )}
                  <div className={'flex-2 p-1'}>
                    <Dropdown
                      placeholder={t('SelectField')}
                      fluid
                      selection
                      options={fieldsOptions}
                      onChange={(event, data) => fieldSelected(c, data.value)}
                      value={c.fieldId}
                    />
                  </div>
                  <div className={'flex-2 p-1'}>
                    {c.name && (
                      <Dropdown
                        placeholder={t('Operator')}
                        fluid
                        selection
                        options={getConOptions(c)}
                        onChange={(event, data) => condSelected(c, data.value)}
                        value={c.operator}
                      />
                    )}
                  </div>
                  <div className={'flex-2 p-1'}>
                    {['string', 'bigInteger', 'decimal', 'textarea'].includes(
                      c.type
                    ) && (
                      <Input
                        className={'w-full'}
                        placeholder="..."
                        onChange={(event) =>
                          setRuleValue(c, event.target.value)
                        }
                        value={value}
                      />
                    )}
                    {c.type === 'date' && (
                      <DatePicker
                        customInput={<Input />}
                        selected={getValidDateValue(value)}
                        onChange={(date) => setRuleValue(c, date)}
                      />
                    )}
                    {c.type === 'dateTime' && (
                      <DatePicker
                        selected={getValidDateValue(value)}
                        onChange={(date) => setRuleValue(c, date)}
                        customInput={<Input />}
                        wrapperClassName={'w-full oooo'}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                      />
                    )}
                    {c.type === 'time' && (
                      <DatePicker
                        selected={getValidDateValue(value)}
                        onChange={(date) => setRuleValue(c, date)}
                        customInput={<Input />}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                      />
                    )}
                    {c.type === 'relation' && (
                      <SelectContentModal
                        multiple={c.repeatable}
                        btnSize="normal"
                        onChange={(event, data) => setRuleValue(c, data)}
                        content={c.content}
                        selected={value}
                      />
                    )}
                    {c.type === 'upload' && (
                      <SelectUploadsModal
                        // size="small"
                        icon="image"
                        labelPosition="left"
                        id={c.ruleId}
                        onChange={(data) =>
                          setRuleValue(
                            c,
                            data.map((u) => u.id)
                          )
                        }
                        onOpen={() =>
                          setSelectedUploads(
                            Array.isArray(value)
                              ? value.map((u) => ({ id: u }))
                              : [{ id: value }]
                          )
                        }
                        multiple={c.repeatable}
                      />
                    )}
                    {c.type === 'select' && (
                      <Dropdown
                        placeholder="..."
                        fluid
                        selection
                        clearable
                        multiple={c.repeatable}
                        options={c.options}
                        onChange={(event, data) => setRuleValue(c, data.value)}
                        value={value}
                      />
                    )}
                    {c.type === 'boolean' && (
                      <Dropdown
                        placeholder="..."
                        fluid
                        selection
                        options={[
                          { label: t('Checked'), value: true },
                          { label: t('Unchecked'), value: false }
                        ]}
                        onChange={(event, data) => setRuleValue(c, data.value)}
                        value={value}
                      />
                    )}
                  </div>
                </div>
                <div className={'p-1 flex justify-center items-center w-1/12'}>
                  <div className={'px-3 text-green-400'}>
                    <span
                      onClick={() => addRule({ ...c, index })}
                      className={'cursor-pointer plus'}
                    >
                      <FaPlus />
                    </span>
                  </div>
                  <div className={'px-3 text-red-600'}>
                    <span
                      onClick={() => removeRule({ ...c, index })}
                      className={'cursor-pointer minus'}
                    >
                      <FaMinus />
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    schemas: state.schema.schemas,
    currentEditedSchemaOrField: state.shared.currentEditedSchemaOrField
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedUploads: (payload) =>
      dispatch(actions.setSelectedUploads(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConditionalLogicRules)
