import i18n from '../i18n'

export default class SchemaFieldValidator {
  static validateSchemaName (currentSchema, schemas) {
    const schemaNameErrors = []

    // Is the name exist
    if (!currentSchema.name) {
      schemaNameErrors.push(i18n.t('required'))
    }

    // Check the validity of the name
    if (!/^[a-zA-Z0-9-_]+$/.test(currentSchema.name)) {
      schemaNameErrors.push(
        i18n.t('error.invalidnameonlyalphanumeric-and_acceptable')
      )
    }

    // Check for duplicate name
    const nameExist = schemas.find(
      f => f.name === currentSchema.name && f.id !== currentSchema.id
    )

    if (nameExist) {
      schemaNameErrors.push(i18n.t('error.thereisotherschemawiththesamename'))
    }

    if (schemaNameErrors.length) {
      return schemaNameErrors
    }

    return undefined
  }

  static validateFields (currentSchema, schemas) {
    const fieldsErrors = []

    /**
     * Fields validation
     */
    for (const field of currentSchema.fields) {
      const fieldErrors = []

      // Check if the name not exist
      if (!field.name) {
        fieldErrors.push(i18n.t('required'))
      }

      // Check for duplicate name
      const nameExist = currentSchema.fields.find(
        f => f.name === field.name && f.id !== field.id
      )
      if (nameExist) {
        fieldErrors.push(i18n.t('error.fieldnameduplicated'))
      }

      // Check the validity of the name
      if (!/^[a-zA-Z0-9-_]+$/.test(field.name)) {
        fieldErrors.push(
          i18n.t('error.invalidnameonlyalphanumeric-and_acceptable')
        )
      }

      // If the field is relational, make sure the user selected the relational content.
      if (field.type === 'relation' && !field.reference) {
        fieldErrors.push(i18n.t('error.pleaseselecttherelationalcontent'))
      }

      if (fieldErrors.length) {
        fieldsErrors.push({ id: field.id, errors: fieldErrors })
      }
    }

    if (fieldsErrors.length) {
      return fieldsErrors
    }

    return undefined
  }

  /**
   * @param {Object} currentSchema The currently edited field or schema.
   */
  static validate (currentSchema, schemas) {
    const result = {}

    const fieldsErrors = this.validateFields(currentSchema, schemas)
    if (fieldsErrors) {
      result.fields = fieldsErrors
    }

    const schemaNameErrors = this.validateSchemaName(currentSchema, schemas)
    if (schemaNameErrors) {
      result.nameErrors = schemaNameErrors
    }

    if (!currentSchema.title) {
      result.titleErrors = [i18n.t('required')]
    }

    if (!currentSchema.singularTitle) {
      result.singularTitleErrors = [i18n.t('required')]
    }

    if (Object.keys(result).length) {
      return result
    }

    return undefined
  }
}
