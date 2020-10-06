import aventum from '../aventum'

export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  }
}

export const getObjectByName = (schemas, contentName) => {
  return schemas.find(c => c.name === contentName)
}

export const getObjectById = (objects, objectId) => {
  return objects.find(c => c.id === objectId)
}

export const cleanArray = (arr) => {
  return arr.reduce((acc, curr) => {
    if (curr) {
      return [...acc, curr]
    }

    return acc
  }, [])
}

export const getContentSchema = (content, customFields) => {
  const fields = content.fields.map(f => {
    const obj = {}

    if (f.type === 'custom') {
      var field = customFields.find(z => z.name === f.name)

      const handeledFeilds = field.fields.map(e => {
        const subObj = {}
        const name = e.fields.find(h => h.name === 'name').value
        const type = e.type
        const required = e.fields.find(h => h.name === 'required').checked
        subObj[name] = { required, type }
        return subObj
      })

      let embeddedDocument = {}

      for (const i of handeledFeilds) {
        embeddedDocument = { ...embeddedDocument, ...i }
      }

      obj[f.name] = embeddedDocument

      // const required = f.fields.find(h => h.name === 'required').checked
    } else {
      const name = f.fields.find(h => h.name === 'name').value
      const type = f.type
      const required = f.fields.find(h => h.name === 'required').checked
      obj[name] = { required, type }
    }

    return obj
  })

  let schema = {}

  for (const oo of fields) {
    schema = { ...schema, ...oo }
  }

  return schema
}

export const getValidationRulesFromSchema = contentSchema => {
  const rules = []

  for (const obj in contentSchema) {
    if (contentSchema[obj].type && contentSchema[obj].required) {
      rules.push({
        field: obj,
        method: 'isEmpty',
        validWhen: false,
        message: `${obj} is required.`
      })
    } else {
      for (const o in contentSchema[obj]) {
        if (
          contentSchema[obj][o] &&
          contentSchema[obj][o].type &&
          contentSchema[obj][o].required
        ) {
          rules.push({
            field: `${obj}/${o}`,
            method: 'isEmpty',
            validWhen: false,
            message: `${obj}/${o} is required.`
          })
        }
      }
    }
  }

  return rules
}

export const isObject = obj => {
  return typeof obj === 'object' && obj !== null
}

export const getContentsAsIdTitle = schemas => {
  return schemas.map(c => ({
    label: c.title,
    value: c.id
  }))
}

/**
 * Make array of objects that contains id property unique
 */
export const arrayUniqueByID = arr => {
  return arr.reduce((a, c) => {
    var f = a.find(e => e.id.toString() === c.id.toString())
    if (f) {
      return a
    }
    return [...a, c]
  }, [])
}

export const arrayUniqueByProperty = (
  arr,
  property = 'id',
  toString = true
) => {
  return arr.reduce((a, c) => {
    var f = null
    if (toString) {
      f = a.find(e => e[property].toString() === c[property].toString())
    } else {
      f = a.find(e => e[property] === c[property])
    }
    if (f) {
      return a
    }
    return [...a, c]
  }, [])
}

export const shorten = (value, limit) => {
  if (value && value.length > limit) {
    return value.substr(0, limit) + ' ...'
  }
  return value
}

export const getFileExtension = url => {
  return url
    .split('.')
    .pop()
    .split(/#|\?/)[0]
}

export const validate = (schema, values, fieldsNames) => {
  let errors = null
  const valuesObj = {}

  for (const fieldName of fieldsNames) {
    valuesObj[fieldName] = values[fieldName]
  }

  const { error } = schema.validate(valuesObj, { abortEarly: false })

  if (error) {
    errors = {}
    for (const field of error.details) {
      if (!errors[field.path[0]]) {
        errors[field.path[0]] = field.message
      }
    }
  }

  return errors
}

export const onDragEnd = result => {
  /**
   * Fires when dragging a controller ends.
   *
   * @hook
   * @name SchemaNFieldsOnDragEnd
   * @type applyFiltersSync
   * @since 1.0.0
   *
   * @param {Object} result Object contains the state of what happen after the drag like
   *                        destination, source, and draggableId.
   *                        [For more info see](https://github.com/atlassian/react-beautiful-dnd)
   */
  result = aventum.hooks.applyFiltersSync(
    'SchemaNFieldsOnDragEnd',
    result
  )

  /**
   * Fires when dragging a controller ends.
   *
   * @hook
   * @name SchemaNFieldsOnDragEnd
   * @type doActionSync
   * @since 1.0.0
   *
   * @param {Object} result Object contains the state of what happen after the drag like
   *                        destination, source, and draggableId.
   *                        [For more info see](https://github.com/atlassian/react-beautiful-dnd)
   */
  aventum.hooks.doActionSync('SchemaNFieldsOnDragEnd', result)
}

export const addClasses = (node, classes) => {
  classes.length && node.classList.add(...classes)
}

export const removeClasses = (node, classes) => {
  classes.length && node.classList.remove(...classes)
}

export const stringClassesToArray = (classes) => {
  return classes.split(' ').filter((s) => s.length)
}
