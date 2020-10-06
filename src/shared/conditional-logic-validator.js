import { parse, parseISO } from 'date-fns'
import aventum from '../aventum'

class ConditionalLogicValidator {
  /**
   * These fields ['bigInteger', 'decimal', 'string', 'textarea']
   */
  static handleStringLikeFieldsOperators (rule, depField, fieldValue) {
    switch (rule.operator) {
      case '=':
      default:
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return fieldValue.every(v => v === rule.value)
          } else {
            return fieldValue.some(v => v === rule.value)
          }
        } else {
          return fieldValue === rule.value
        }
      case '!=':
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return fieldValue.every(v => v !== rule.value)
          } else {
            return fieldValue.some(v => v !== rule.value)
          }
        } else {
          return fieldValue !== rule.value
        }
      case '>':
        // If the fields are number like type then we compare them as numbers
        if (depField.type === 'decimal' || depField.type === 'bigInteger') {
          if (depField.repeatable) {
            if (rule.logicType === 'all') {
              return fieldValue.every(v => Number(v) > Number(rule.value))
            } else {
              return fieldValue.some(v => Number(v) > Number(rule.value))
            }
          } else {
            return Number(fieldValue) > Number(rule.value)
          }
        } else {
          // If the fields are string like type then we compare the length of the string
          if (depField.repeatable) {
            if (rule.logicType === 'all') {
              return fieldValue.every(v => v.length > rule.value)
            } else {
              return fieldValue.some(v => v.length > rule.value)
            }
          } else {
            return fieldValue.length > rule.value
          }
        }
      case '<':
        if (depField.type === 'decimal' || depField.type === 'bigInteger') {
          if (depField.repeatable) {
            if (rule.logicType === 'all') {
              return fieldValue.every(v => Number(v) < Number(rule.value))
            } else {
              return fieldValue.some(v => Number(v) < Number(rule.value))
            }
          } else {
            return Number(fieldValue) < Number(rule.value)
          }
        } else {
          if (depField.repeatable) {
            if (rule.logicType === 'all') {
              return fieldValue.every(v => v.length < rule.value)
            } else {
              return fieldValue.some(v => v.length < rule.value)
            }
          } else {
            return fieldValue.length < rule.value
          }
        }
      case 'sw':
        if (depField.type === 'decimal' || depField.type === 'bigInteger') {
          if (depField.repeatable) {
            fieldValue = fieldValue.map((j) => j + '')
          } else {
            fieldValue = fieldValue + ''
          }
        }
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return fieldValue.every(v => v.startsWith(rule.value))
          } else {
            return fieldValue.some(v => v.startsWith(rule.value))
          }
        } else {
          return fieldValue.startsWith(rule.value)
        }
      case 'ew':
        if (depField.type === 'decimal' || depField.type === 'bigInteger') {
          if (depField.repeatable) {
            fieldValue = fieldValue.map((j) => j + '')
          } else {
            fieldValue = fieldValue + ''
          }
        }
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return fieldValue.every(v => v.endsWith(rule.value))
          } else {
            return fieldValue.some(v => v.endsWith(rule.value))
          }
        } else {
          return fieldValue.endsWith(rule.value)
        }
      case 'c':
        if (depField.type === 'decimal' || depField.type === 'bigInteger') {
          if (depField.repeatable) {
            fieldValue = fieldValue.map((j) => j + '')
          } else {
            fieldValue = fieldValue + ''
          }
        }
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return fieldValue.every(v => v.includes(rule.value))
          } else {
            return fieldValue.some(v => v.includes(rule.value))
          }
        } else {
          return fieldValue.includes(rule.value)
        }
      case 'dc':
        if (depField.type === 'decimal' || depField.type === 'bigInteger') {
          if (depField.repeatable) {
            fieldValue = fieldValue.map((j) => j + '')
          } else {
            fieldValue = fieldValue + ''
          }
        }
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return fieldValue.every(v => !v.includes(rule.value))
          } else {
            return fieldValue.some(v => !v.includes(rule.value))
          }
        } else {
          return !fieldValue.includes(rule.value)
        }
    }
  }

  /**
   * These fields ['date', 'time', 'dateTime']
   */
  static handleDateOperators (rule, depField, fieldValue) {
    let ruleValue = new Date(rule.value)
    ruleValue = ruleValue.getTime()

    // Convert the values to dates if the are not
    var datedFieldValue = null
    if (depField.repeatable) {
      datedFieldValue = fieldValue.map(v => {
        let tmp
        if (aventum.db.type !== 'mongodb') {
          switch (depField.type) {
            case 'time':
              tmp = parse(v, 'HH:mm:ss', new Date())
              return tmp.getTime()

            case 'date':
              tmp = parseISO(v)
              return tmp.getTime()

            case 'dateTime':
            default:
              tmp = new Date(v)
              return tmp.getTime()
          }
        } else {
          tmp = new Date(v)
          return tmp.getTime()
        }
      })
    } else {
      datedFieldValue = new Date(fieldValue)
      datedFieldValue = datedFieldValue.getTime()
    }

    switch (rule.operator) {
      case '=':
      default:
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return datedFieldValue.every(v => v === ruleValue)
          } else {
            return datedFieldValue.some(v => v === ruleValue)
          }
        } else {
          return datedFieldValue === ruleValue
        }
      case '!=':
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return datedFieldValue.every(v => v !== ruleValue)
          } else {
            return datedFieldValue.some(v => v !== ruleValue)
          }
        } else {
          return datedFieldValue !== ruleValue
        }
      case '>':
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return datedFieldValue.every(v => v > ruleValue)
          } else {
            return datedFieldValue.some(v => v > ruleValue)
          }
        } else {
          return datedFieldValue > ruleValue
        }
      case '<':
        if (depField.repeatable) {
          if (rule.logicType === 'all') {
            return datedFieldValue.every(v => v < ruleValue)
          } else {
            return datedFieldValue.some(v => v < ruleValue)
          }
        } else {
          return datedFieldValue < ruleValue
        }
    }
  }

  static handleUploadAndRelationFieldsOperators (rule, depField, fieldValue) {
    switch (rule.operator) {
      case '=':
      default:
        if (depField.repeatable) {
          return fieldValue.sort().join('') === rule.value.sort().join('')
        } else {
          return fieldValue === rule.value
        }
      case '!=':
        if (depField.repeatable) {
          return fieldValue.sort().join('') !== rule.value.sort().join('')
        } else {
          return fieldValue !== rule.value
        }
      case 'c':
        if (depField.repeatable) {
          return rule.value.every(v => fieldValue.includes(v))
        } else {
          return fieldValue === rule.value
        }
      case 'dc':
        if (depField.repeatable) {
          return rule.value.every(v => !fieldValue.includes(v))
        } else {
          return fieldValue !== rule.value
        }
    }
  }

  static handleBoolOperators (rule, depField, fieldValue) {
    switch (rule.operator) {
      case '=':
      default:
        return fieldValue === rule.value
      case '!=':
        return fieldValue !== rule.value
    }
  }

  static handleSelectOperators (rule, depField, fieldValue) {
    if (depField.repeatable) {
      switch (rule.operator) {
        case '=':
        default:
          return fieldValue.sort().join('') === rule.value.sort().join('')
        case '!=':
          return fieldValue.sort().join('') !== rule.value.sort().join('')
        case 'c':
          return rule.value.every(v => fieldValue.includes(v))
        case 'dc':
          return rule.value.every(v => !fieldValue.includes(v))
      }
    } else {
      switch (rule.operator) {
        case '=':
        default:
          return fieldValue === rule.value
        case '!=':
          return fieldValue !== rule.value
        case '>':
          return Number(fieldValue) > Number(rule.value)
        case '<':
          return Number(fieldValue) < Number(rule.value)
        case 'sw':
          return fieldValue.startsWith(rule.value)
        case 'ew':
          return fieldValue.endsWith(rule.value)
        case 'c':
          return fieldValue.includes(rule.value)
        case 'dc':
          return !fieldValue.includes(rule.value)
      }
    }
  }

  static applyRule (fields, values, rule) {
    // Get the field that this rule depends on
    const depField = fields.find(f => f.id === rule.fieldId)

    const fieldValue = values ? values[depField.name] : undefined

    // If the field doesn't have value so far
    if (!fieldValue || (depField.repeatable && !fieldValue.length)) {
      return false
    }

    switch (depField.type) {
      case 'bigInteger':
      case 'decimal':
      case 'string':
      case 'textarea':
      default:
        return this.handleStringLikeFieldsOperators(rule, depField, fieldValue)

      case 'select':
        return this.handleSelectOperators(rule, depField, fieldValue)

      case 'date':
      case 'time':
      case 'dateTime':
        return this.handleDateOperators(rule, depField, fieldValue)

      case 'boolean':
        return this.handleBoolOperators(rule, depField, fieldValue)

      case 'relation':
      case 'upload':
        return this.handleUploadAndRelationFieldsOperators(
          rule,
          depField,
          fieldValue
        )
    }
  }

  /**
   * Apply the conditional logic rules and return only the fields that must be visible.
   *
   * @param {Array} fields like the schema fields or the custom field's fields.
   */
  static getVisibleFields (fields, values) {
    const visibleFields = fields.filter(field => {
      const conditionalLogic = field.conditionalLogic
      // If the conditionalLogic is not enabled then the field must be visible
      if (!conditionalLogic.enable) {
        return true
      }

      var result
      if (conditionalLogic.logicType === 'all') {
        result = conditionalLogic.rules.every(rule => {
          return this.applyRule(fields, values, rule)
        })
      } else {
        result = conditionalLogic.rules.some(rule => {
          return this.applyRule(fields, values, rule, 'any')
        })
      }

      if (conditionalLogic.actionType === 'show') {
        if (result) {
          return true
        } else {
          return false
        }
      } else {
        if (result) {
          return false
        } else {
          return true
        }
      }
    })

    return visibleFields
  }
}

export default ConditionalLogicValidator
