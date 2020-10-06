import * as Rules from './rules'

export default class Validator {
  //The touched fields is the fields that for example the user just click on them or touched them
  touched = []

  //The dirty fields is the fields that the user modified their values
  dirts = []

  fieldsRules = {}
  
  fieldsValues = {}

  check = {...Rules}

  isValid = (field, newValues = null) => {
    let values = newValues ? newValues : this.fieldsValues[field]
    let valid = false
    let rules = this.fieldsRules[field]
    let derty = []
    let self = this

    if (!Array.isArray(rules)) {
      return valid
    }

    rules.forEach((item, index) => {
      //if the item is a function then the user passed external validation funtion, so use it instead of the built in one
      let fn =
        typeof item === 'string' || item instanceof String ? self.check[item] : item

      if (fn(values) === true) {
        derty.push(true)
      } else {
        derty.push(false)
      }

      if (derty.indexOf(false) === -1) {
        valid = true
      } else {
        valid = false
      }
    })

    return valid
  }

  isAllValid = () => {
    let fieldsNames = Object.keys(this.fieldsRules)
    let derty = []
    let self = this
    let isAllValid = false

    fieldsNames.forEach((item, index) => {
      if (self.isValid(item, self.fieldsValues[item]) === true) {
        derty.push(true)
      } else {
        derty.push(false)
      }

      if (derty.indexOf(false) === -1) {
        isAllValid = true
      } else {
        isAllValid = false
      }
    })
    return isAllValid
  }

  touch = field => {
    if (this.touched.indexOf(field) === -1) {
      this.touched.push(field)
    }
  }

  dirt = field => {
    if (this.dirts.indexOf(field) === -1) {
      this.dirts.push(field)
    }
  }

  isTouched = field => {
    if (this.touched.indexOf(field) === -1) {
      return false
    } else {
      return true
    }
  }

  isDirty = field => {
    if (this.dirts.indexOf(field) === -1) {
      return false
    } else {
      return true
    }
  }

  isAnyTouched = () => {
    return this.touched.length > 0
  }

  isAnyDirty = () => {
    return this.dirts.length > 0
  }

  untouchEverything = () => {
    this.touched = []
  }

  cleanEverything = () => {
    this.dirts = []
  }
}
