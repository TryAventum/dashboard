import * as actionTypes from './actionTypes'

export const setErrors = payload => {
  return {
    type: actionTypes.SET_FORM_ERRORS,
    payload
  }
}
