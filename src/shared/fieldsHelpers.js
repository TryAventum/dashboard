import { v1 as uuidv1 } from 'uuid'
import i18n from '../i18n'
import aventum from '../aventum'
import { getObjectByName } from './utility'

// The following fields need fake ids for their values values if the are repeatable.
export const fieldsNeedIds = [
  'string',
  'decimal',
  'bigInteger',
  'text',
  'email',
  'password',
  'textarea',
  'date',
  'time',
  'dateTime',
]

export const getCondLogicNewRule = () => {
  return {
    ruleId: uuidv1(),
    fieldId: '',
    operator: '',
    value: '',
    logicType: 'any',
  }
}
aventum.getCondLogicNewRule = getCondLogicNewRule

export const conditionalLogic = () => {
  return {
    enable: false,
    actionType: 'show', // show or hide
    logicType: 'all', // all or any
    rules: [getCondLogicNewRule()],
  }
}
aventum.conditionalLogic = conditionalLogic

export const stringField = (withId = true) => {
  return {
    type: 'string',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('Pattern'),
        name: 'pattern',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('PatValMes'),
        name: 'patValMes',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const dateField = (withId = true) => {
  return {
    type: 'date',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('Format'),
        name: 'format',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('CalendarFormat'),
        name: 'calendarFormat',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('ShowMonthDropdown'),
        name: 'showMonthDropdown',
        type: 'checkbox',
        checked: false,
        value: 'showMonthDropdown',
      },
      {
        label: i18n.t('ShowYearDropdown'),
        name: 'showYearDropdown',
        type: 'checkbox',
        checked: false,
        value: 'showYearDropdown',
      },
      {
        label: i18n.t('DropdownMode'),
        name: 'dropdownMode',
        type: 'select',
        options: [
          { label: i18n.t('scroll'), value: 'scroll' },
          { label: i18n.t('select'), value: 'select' },
        ],
        value: '',
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const timeField = (withId = true) => {
  return {
    type: 'time',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('Format'),
        name: 'format',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('CalendarFormat'),
        name: 'calendarFormat',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('TimeIntervals'),
        name: 'timeIntervals',
        inputType: 'number',
        type: 'input',
        value: 15,
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const dateTimeField = (withId = true) => {
  return {
    type: 'dateTime',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('Format'),
        name: 'format',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('CalendarDateFormat'),
        name: 'calendarDateFormat',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('CalendarTimeFormat'),
        name: 'calendarTimeFormat',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('TimeIntervals'),
        name: 'timeIntervals',
        type: 'input',
        inputType: 'number',
        value: 15,
      },
      {
        label: i18n.t('ShowMonthDropdown'),
        name: 'showMonthDropdown',
        type: 'checkbox',
        checked: false,
        value: 'showMonthDropdown',
      },
      {
        label: i18n.t('ShowYearDropdown'),
        name: 'showYearDropdown',
        type: 'checkbox',
        checked: false,
        value: 'showYearDropdown',
      },
      {
        label: i18n.t('DropdownMode'),
        name: 'dropdownMode',
        type: 'select',
        options: [
          { label: i18n.t('scroll'), value: 'scroll' },
          { label: i18n.t('select'), value: 'select' },
        ],
        value: '',
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const textareaField = (withId = true) => {
  return {
    type: 'textarea',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('Pattern'),
        name: 'pattern',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('PatValMes'),
        name: 'patValMes',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('TextareaType'),
        name: 'textareaType',
        type: 'select',
        options: [
          { label: i18n.t('Textarea'), value: 'textarea' },
          { label: i18n.t('WYSIWYG'), value: 'wysiwyg' },
        ],
        value: 'textarea',
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const uploadField = (withId = true) => {
  return {
    type: 'upload',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const booleanField = (withId = true) => {
  return {
    type: 'boolean',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('DefaultValue'),
        name: 'defaultValue',
        type: 'select',
        options: [
          { label: i18n.t('Unchecked'), value: false },
          { label: i18n.t('Checked'), value: true },
        ],
        value: false,
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const relationField = (withId = true) => {
  return {
    type: 'relation',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('Reference'),
        name: 'reference',
        type: 'select',
        value: '',
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const selectField = (withId = true) => {
  return {
    type: 'select',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('options'),
        name: 'options',
        type: 'RepeatableTextValue',
        value: [{ label: '', value: '', id: uuidv1() }],
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const bigIntegerField = (withId = true) => {
  return {
    type: 'bigInteger',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('Pattern'),
        name: 'pattern',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('PatValMes'),
        name: 'patValMes',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const decimalField = (withId = true) => {
  return {
    type: 'decimal',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('FieldLabel'),
        name: 'label',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('FieldNameInDB'),
        name: 'name',
        required: true,
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('Pattern'),
        name: 'pattern',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('PatValMes'),
        name: 'patValMes',
        type: 'input',
        value: '',
      },
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const getFieldValue = (type, event, data) => {
  const ev = event.event ? event.event : event
  let value
  switch (type) {
    case 'string':
    case 'decimal':
    case 'bigInteger':
    case 'input':
    default:
      value = ev.target.value
      break
    case 'boolean':
    case 'checkbox':
      value = data.checked
      break
    case 'select':
      value = data.value
      break
    case 'relation':
      value = data
      break
    case 'textarea':
      value = ev
      break
    case 'time':
    case 'date':
    case 'dateTime':
      value = ev
      break
    case 'upload':
      value = ev
      break
    case 'dynamictable':
      value = ev
      break
  }

  return value
}

export const setSchemaSubFieldValue = (subField, event, data) => {
  if (subField.type === 'input') {
    subField.value = event.target.value
  } else if (subField.type === 'checkbox') {
    subField.checked = data.checked
  } else if (subField.type === 'conditionalLogic') {
    subField.value = event
  } else if (subField.type === 'select') {
    subField.value = data.value
  } else if (subField.type === 'RepeatableTextValue') {
    switch (event.type) {
      case 'value':
      default:
        subField.value[event.index].value = event.event.target.value
        break
      case 'text':
        subField.value[event.index].label = event.event.target.value
        break
      case 'plus':
        subField.value.splice(event.index + 1, 0, {
          label: '',
          value: '',
          id: uuidv1(),
        })
        break
      case 'reorder':
        subField.value = event.rows
        break
      case 'minus':
        if (subField.value.length !== 1) {
          subField.value.splice(event.index, 1)
        }
        break
    }
  }

  return subField
}

export const customField = (item, withId = true) => {
  return {
    name: item,
    type: 'custom',
    id: withId ? uuidv1() : '',
    fields: [
      {
        label: i18n.t('RequiredQ'),
        name: 'required',
        type: 'checkbox',
        checked: false,
        value: 'required',
      },
      {
        label: i18n.t('RepeatableQ'),
        name: 'repeatable',
        type: 'checkbox',
        checked: false,
        value: 'repeatable',
      },
      {
        label: i18n.t('ConditionalLogic'),
        name: 'conditionalLogic',
        type: 'conditionalLogic',
        value: { ...conditionalLogic() },
      },
    ],
  }
}

export const getField = (type, withId = true) => {
  let field = null
  switch (type) {
    case 'string':
      field = stringField(withId)
      break
    case 'date':
      field = dateField(withId)
      break
    case 'time':
      field = timeField(withId)
      break
    case 'dateTime':
      field = dateTimeField(withId)
      break
    case 'decimal':
      field = decimalField(withId)
      break
    case 'bigInteger':
      field = bigIntegerField(withId)
      break
    case 'boolean':
      field = booleanField(withId)
      break
    case 'relation':
      field = relationField(withId)
      break
    case 'select':
      field = selectField(withId)
      break
    case 'upload':
      field = uploadField(withId)
      break
    case 'textarea':
      field = textareaField(withId)
      break
    default:
      /**
       * Get the field's constructor, when clicking on a field name button to add it to the schema
       *  builder or the custom fields build this hook will be called for unknown or custom fields.
       *
       * @hook
       * @name getField
       * @type applyFiltersSync
       * @since 1.0.0
       *
       * @param {string} type the type of the field
       * @param {boolean} withId whether we want id with the field or no
       */
      field = aventum.hooks.applyFiltersSync(
        'getField',
        customField(type, withId),
        type,
        withId
      )
      break
  }

  return field
}

export const addField = (component, item) => {
  component.setState((state, props) => {
    return {
      fields: [...(state.fields ? state.fields : []), getField(item)],
    }
  })
}

export const prepareForSave = (unreadyField) => {
  // Clone the object to avoid the modify by reference
  unreadyField = { ...unreadyField }

  // Clone the fields array [...unreadyField.fields]
  unreadyField.fields = [...unreadyField.fields].map((f) => {
    let field = null

    switch (f.type) {
      case 'string':
      case 'decimal':
      case 'bigInteger':
        field = {
          id: f.id,
          type: f.type,
          name: f.fields.find((i) => i.name === 'name').value,
          label: f.fields.find((i) => i.name === 'label').value,
          required: f.fields.find((i) => i.name === 'required').checked,
          pattern: f.fields.find((i) => i.name === 'pattern').value,
          patValMes: f.fields.find((i) => i.name === 'patValMes').value,
          repeatable: f.fields.find((i) => i.name === 'repeatable').checked,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break

      case 'textarea':
        field = {
          id: f.id,
          type: f.type,
          name: f.fields.find((i) => i.name === 'name').value,
          label: f.fields.find((i) => i.name === 'label').value,
          required: f.fields.find((i) => i.name === 'required').checked,
          pattern: f.fields.find((i) => i.name === 'pattern').value,
          patValMes: f.fields.find((i) => i.name === 'patValMes').value,
          repeatable: f.fields.find((i) => i.name === 'repeatable').checked,
          textareaType: f.fields.find((i) => i.name === 'textareaType').value,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break

      case 'upload':
        field = {
          id: f.id,
          type: f.type,
          name: f.fields.find((i) => i.name === 'name').value,
          label: f.fields.find((i) => i.name === 'label').value,
          required: f.fields.find((i) => i.name === 'required').checked,
          repeatable: f.fields.find((i) => i.name === 'repeatable').checked,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break

      case 'boolean':
        field = {
          id: f.id,
          type: f.type,
          name: f.fields.find((i) => i.name === 'name').value,
          defaultValue: f.fields.find((i) => i.name === 'defaultValue').value,
          label: f.fields.find((i) => i.name === 'label').value,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break

      case 'relation':
        field = {
          id: f.id,
          type: f.type,
          name: f.fields.find((i) => i.name === 'name').value,
          label: f.fields.find((i) => i.name === 'label').value,
          reference: f.fields.find((i) => i.name === 'reference').value,
          required: f.fields.find((i) => i.name === 'required').checked,
          repeatable: f.fields.find((i) => i.name === 'repeatable').checked,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break
      case 'select':
        field = {
          id: f.id,
          type: f.type,
          name: f.fields.find((i) => i.name === 'name').value,
          label: f.fields.find((i) => i.name === 'label').value,
          options: f.fields.find((i) => i.name === 'options').value,
          required: f.fields.find((i) => i.name === 'required').checked,
          repeatable: f.fields.find((i) => i.name === 'repeatable').checked,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break
      case 'date':
        field = {
          id: f.id,
          type: f.type,
          name: f.fields.find((i) => i.name === 'name').value,
          label: f.fields.find((i) => i.name === 'label').value,
          format: f.fields.find((i) => i.name === 'format').value,
          calendarFormat: f.fields.find((i) => i.name === 'calendarFormat')
            .value,
          showMonthDropdown: f.fields.find(
            (i) => i.name === 'showMonthDropdown'
          ).checked,
          showYearDropdown: f.fields.find((i) => i.name === 'showYearDropdown')
            .checked,
          dropdownMode: f.fields.find((i) => i.name === 'dropdownMode').value,
          required: f.fields.find((i) => i.name === 'required').checked,
          repeatable: f.fields.find((i) => i.name === 'repeatable').checked,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break
      case 'time':
        field = {
          id: f.id,
          type: f.type,
          name: f.fields.find((i) => i.name === 'name').value,
          label: f.fields.find((i) => i.name === 'label').value,
          format: f.fields.find((i) => i.name === 'format').value,
          calendarFormat: f.fields.find((i) => i.name === 'calendarFormat')
            .value,
          timeIntervals: f.fields.find((i) => i.name === 'timeIntervals').value,
          required: f.fields.find((i) => i.name === 'required').checked,
          repeatable: f.fields.find((i) => i.name === 'repeatable').checked,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break
      case 'dateTime':
        field = {
          id: f.id,
          type: f.type,
          name: f.fields.find((i) => i.name === 'name').value,
          label: f.fields.find((i) => i.name === 'label').value,
          format: f.fields.find((i) => i.name === 'format').value,
          calendarDateFormat: f.fields.find(
            (i) => i.name === 'calendarDateFormat'
          ).value,
          calendarTimeFormat: f.fields.find(
            (i) => i.name === 'calendarTimeFormat'
          ).value,
          timeIntervals: f.fields.find((i) => i.name === 'timeIntervals').value,
          showMonthDropdown: f.fields.find(
            (i) => i.name === 'showMonthDropdown'
          ).checked,
          showYearDropdown: f.fields.find((i) => i.name === 'showYearDropdown')
            .checked,
          dropdownMode: f.fields.find((i) => i.name === 'dropdownMode').value,
          required: f.fields.find((i) => i.name === 'required').checked,
          repeatable: f.fields.find((i) => i.name === 'repeatable').checked,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break
      // I.E custom field
      default:
        field = {
          id: f.id,
          type: f.type,
          name: f.name,
          required: f.fields.find((i) => i.name === 'required').checked,
          repeatable: f.fields.find((i) => i.name === 'repeatable').checked,
          conditionalLogic: f.fields.find((i) => i.name === 'conditionalLogic')
            .value,
        }
        break
    }

    return field
  })

  return unreadyField
}

export const setDefaultValues = (
  content,
  customFields = [],
  prepareFirst = true
) => {
  if (prepareFirst) {
    content = prepareForSave(content)
  }
  const values = {}

  for (const field of content.fields) {
    if (field.type === 'custom') {
      const customField = getObjectByName(customFields, field.name)
      if (field.repeatable) {
        values[field.name] = [setDefaultValues(customField, [], false)]
      } else {
        values[field.name] = setDefaultValues(customField, [], false)
      }
    } else {
      if (Object.prototype.hasOwnProperty.call(field, 'defaultValue')) {
        if (field.repeatable) {
          values[field.name] = [field.defaultValue]
        } else {
          values[field.name] = field.defaultValue
        }
      }
    }
  }

  return values
}

export const parseFields = (fields) => {
  if (typeof fields === 'string') {
    fields = JSON.parse(fields)
  }

  fields = fields.map((f) => {
    const field = getField(f.type, false)
    field.id = f.id

    field.fields = field.fields.map((i) => {
      if (i.type === 'checkbox') {
        i.checked = f[i.name]
      } else {
        i.value = f[i.name]
      }
      return i
    })

    if (field.name) {
      field.name = f.name
    }

    // switch (f.type) {
    //   case 'string':
    //   case 'number':
    //   case 'upload':
    //   case 'textarea':
    //   case 'relation':
    //   case 'select':
    //   default:
    //     field.fields = field.fields.map(i => {
    //       if (i.name === 'repeatable' || i.name === 'required') {
    //         i.checked = f[i.name]
    //       } else {
    //         i.value = f[i.name]
    //       }
    //       return i
    //     })

    //     break

    //   case 'boolean':
    //     field.fields = field.fields.map(i => {
    //       if (i.name === 'required') {
    //         i.checked = f[i.name]
    //       } else {
    //         i.value = f[i.name]
    //       }
    //       return i
    //     })
    //     break
    // }

    return field
  })

  return fields
}
