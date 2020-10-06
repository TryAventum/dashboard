import Joi from '@hapi/joi'
import ConditionalLogicValidator from './conditional-logic-validator'
let aventum = window.aventum

class ContentValidator {
  static defaultMessages = {
    "string.empty": aventum.i18n.t('required'),
    "any.required": aventum.i18n.t('required'),
    "string.pattern.base": aventum.i18n.t('error.ftmtrp')
  }

  static getMessages(messages = {}){
    //Before overwriting default messages we first check if the message exist for the given key
    let newMessages = {}
    for (const key in messages) {
      if (messages.hasOwnProperty(key)) {
        const element = messages[key];
        if(element){
          newMessages[key] = element
        }
      }
    }

    return {
      ...this.defaultMessages,
      ...newMessages
    }
  }

  /**
   * The main difference between this method and the getVisibleFields method that this method
   * applies to the entire schema and takes care of the schema custom fields by applying the conditional
   * logic on the custom field's fields as well.
   *
   * @param {Array} schemaFields
   * @param {Object} values
   * @param {Array} customFields Application custom fields.
   * @returns {Object} Object has two properties, `schemaFields` is the visible schema fields
   * and the `customFields` which is the custom fields in this schema with only their visible
   * fields only.
   */
  static getSchemaVisibleFields(schemaFields, values, customFields) {
    //First get the visible content fields
    let visibleContentFields = ConditionalLogicValidator.getVisibleFields(
      schemaFields,
      values
    )

    //Now this visibleContentFields may has custom fields that has a conditional logic in their fields.
    visibleContentFields.forEach((field, index) => {
      if (field.type === 'custom') {
        let customFieldData = customFields.find(e => e.name === field.name)
        let customFieldValues = values[field.name]

        //If the custom field is repeatable then then each value in the array of the custom field values
        //has a unique visible fields
        if (field.repeatable) {
          visibleContentFields[index].visibleFields = []
          customFieldValues = customFieldValues ? customFieldValues : [{}]
          for (const value of customFieldValues) {
            let customFieldVisibleFields = ConditionalLogicValidator.getVisibleFields(
              customFieldData.fields,
              value
            )
            visibleContentFields[index].visibleFields.push(
              customFieldVisibleFields
            )
          }
        } else {
          visibleContentFields[
            index
          ].visibleFields = ConditionalLogicValidator.getVisibleFields(
            customFieldData.fields,
            customFieldValues
          )
        }
      }
    })

    return visibleContentFields
  }

  /**
   * @param {Array} fields Like the schema fields
   * @param {Object} schemaShape Existing schemaShape to append to it
   */
  static getSchemaShape(fields, schemaShape = {}) {
    for (const field of fields) {
      switch (field.type) {
        case 'custom':
          if (field.repeatable) {
            let customFieldSchemaShapes = []
            for (const sField of field.visibleFields) {
              customFieldSchemaShapes.push(
                Joi.object(this.getSchemaShape(sField)).messages(this.getMessages())
              )
            }
            if (field.required) {
              schemaShape[field.name] = Joi.array()
                .required()
                .items(...customFieldSchemaShapes).messages(this.getMessages())
            } else {
              schemaShape[field.name] = Joi.array().items(
                ...customFieldSchemaShapes
              ).messages(this.getMessages())
            }
          } else {
            if (field.required) {
              schemaShape[field.name] = Joi.object(
                this.getSchemaShape(field.visibleFields)
              ).required().messages(this.getMessages())
            } else {
              schemaShape[field.name] = Joi.object(
                this.getSchemaShape(field.visibleFields)
              ).messages(this.getMessages())
            }
          }
          break

        default:
        case 'string':
          if (field.repeatable) {
            if (field.required) {
              if (field.pattern) {
                schemaShape[field.name] = Joi.array()
                  .required()
                  .items(Joi.string().pattern(new RegExp(field.pattern)).messages(this.getMessages({
                    "string.pattern.base": aventum.i18n.t(field.patValMes)
                  })))
                  .messages(this.getMessages())
              } else {
                schemaShape[field.name] = Joi.array()
                  .required()
                  .messages(this.getMessages())
                  .items(Joi.string().messages(this.getMessages()))
              }
            } else {
              if (field.pattern) {
                schemaShape[field.name] = Joi.array().items(
                  Joi.string().allow('').allow(null).pattern(new RegExp(field.pattern)).messages(this.getMessages({
                    "string.pattern.base": aventum.i18n.t(field.patValMes)
                  }))
                ).messages(this.getMessages())
              } else {
                schemaShape[field.name] = Joi.array().items(Joi.string().allow('').allow(null).messages(this.getMessages())).messages(this.getMessages())
              }
            }
          } else {
            if (field.required) {
              if (field.pattern) {
                schemaShape[field.name] = Joi.string()
                  .pattern(new RegExp(field.pattern))
                  .required()
                  .messages(this.getMessages({
                    "string.pattern.base": aventum.i18n.t(field.patValMes)
                  }))
              } else {
                schemaShape[field.name] = Joi.string().required().messages(this.getMessages())
              }
            } else {
              if (field.pattern) {
                schemaShape[field.name] = Joi.string().allow('').allow(null).pattern(
                  new RegExp(field.pattern)
                ).messages(this.getMessages({
                  "string.pattern.base": aventum.i18n.t(field.patValMes)
                }))
              } else {
                schemaShape[field.name] = Joi.string().allow('').allow(null).messages(this.getMessages())
              }
            }
          }
          break

        case 'decimal':
        case 'bigInteger':
          if (field.repeatable) {
            if (field.required) {
              schemaShape[field.name] = Joi.array()
                .required()
                .items(Joi.number().messages(this.getMessages())).messages(this.getMessages())
            } else {
              schemaShape[field.name] = Joi.array().items(Joi.number().messages(this.getMessages())).messages(this.getMessages())
            }
          } else {
            if (field.required) {
              schemaShape[field.name] = Joi.number().required().messages(this.getMessages())
            } else {
              schemaShape[field.name] = Joi.number().messages(this.getMessages())
            }
          }
          break

        case 'date':
        case 'dateTime':
        case 'time':
          if(aventum.db.type !== 'mongodb' && field.type==='time'){
            if (field.repeatable) {
              if (field.required) {
                schemaShape[field.name] = Joi.array()
                .required()
                //Make sure that the time format is HH:mm:ss I mean 24-hour time, leading zeroes mandatory
                .items(Joi.string().pattern(new RegExp('^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$')).messages(this.getMessages())).messages(this.getMessages())
              } else {
                schemaShape[field.name] = Joi.array().items(
                  Joi.string().pattern(new RegExp('^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$')).messages(this.getMessages())
                ).messages(this.getMessages())
              }
            } else {
              if (field.required) {
                schemaShape[field.name] = Joi.string()
                  .pattern(new RegExp('^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$'))
                  .required().messages(this.getMessages())
              } else {
                schemaShape[field.name] = Joi.string().pattern(
                  new RegExp('^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$')
                ).messages(this.getMessages())
              }
            }
          }else{
            if (field.repeatable) {
              if (field.required) {
                schemaShape[field.name] = Joi.array()
                  .required()
                  .items(Joi.date().messages(this.getMessages())).messages(this.getMessages())
              } else {
                schemaShape[field.name] = Joi.array().items(Joi.date().messages(this.getMessages())).messages(this.getMessages())
              }
            } else {
              if (field.required) {
                schemaShape[field.name] = Joi.date().required().messages(this.getMessages())
              } else {
                schemaShape[field.name] = Joi.date().messages(this.getMessages())
              }
            }
          }
          break

        case 'relation':
        case 'upload':
          if (field.repeatable) {
            if (field.required) {
              schemaShape[field.name] = Joi.array()
                .required()
                .items(Joi.alternatives().try(Joi.number(), Joi.string()).messages(this.getMessages())).messages(this.getMessages())
            } else {
              schemaShape[field.name] = Joi.array().items(
                Joi.alternatives().try(Joi.number(), Joi.string()).messages(this.getMessages())
              ).messages(this.getMessages())
            }
          } else {
            if (field.required) {
              schemaShape[field.name] = Joi.alternatives()
                .try(Joi.number(), Joi.string())
                .required().messages(this.getMessages())
            } else {
              schemaShape[field.name] = Joi.alternatives().try(
                Joi.number(),
                Joi.string()
              ).messages(this.getMessages())
            }
          }
          break

        case 'boolean':
          if (field.repeatable) {
            if (field.required) {
              schemaShape[field.name] = Joi.array()
                .required()
                .items(Joi.boolean().messages(this.getMessages())).messages(this.getMessages())
            } else {
              schemaShape[field.name] = Joi.array().items(Joi.boolean().messages(this.getMessages())).messages(this.getMessages())
            }
          } else {
            if (field.required) {
              schemaShape[field.name] = Joi.boolean().required().messages(this.getMessages())
            } else {
              schemaShape[field.name] = Joi.boolean().messages(this.getMessages())
            }
          }
          break
      }
    }

    return schemaShape
  }

  /**
   * Validates the schema fields or the custom field's fields.
   *
   * @param {Array} fields The fields that we want to validate no matter if they are custom field's
   * fields or schema fields.
   * @param {Object} values
   * @param {Array} customFields The app custom fields.
   * @returns {(undefined|Object)} If no error then undefined will be returned otherwise
   *  a Joi ValidationError object will be returned.
   */
  static validateFields(fields, values, customFields = null) {
    try {
      let getSchemaVisibleFields = this.getSchemaVisibleFields(
        fields,
        values,
        customFields
      )

      //We construct a schema then we validate it.
      let schemaShape = this.getSchemaShape(getSchemaVisibleFields)

      let validationSchema = Joi.object(schemaShape)

      const { error } = validationSchema.validate(values, {
        abortEarly: false,
        allowUnknown: true
      })

      return error
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export default ContentValidator
