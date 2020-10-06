import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  errors: null
}

const setErrors = (state, action) => {
  return updateObject(state, { errors: action.payload })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_FORM_ERRORS:
      return setErrors(state, action)
    default:
      return state
  }
}

export default reducer
