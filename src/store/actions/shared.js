import * as actionTypes from './actionTypes'

export const loading = (payload) => {
  return {
    type: actionTypes.LOADING,
    payload
  }
}

export const setCurrentEditedSchemaOrField = payload => {
  return {
    type: actionTypes.SET_CURRENT_EDITED_SCHEMA_OR_FIELD,
    payload
  }
}
