import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  loading: false,
  currentEditedSchemaOrField: {}
}

const loading = (state, action) => {
  return updateObject(state, { loading: action.payload })
}

const setCurrentEditedSchemaOrField = (state, action) => {
  return updateObject(state, {
    currentEditedSchemaOrField: action.payload
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING:
      return loading(state, action)
    case actionTypes.SET_CURRENT_EDITED_SCHEMA_OR_FIELD:
      return setCurrentEditedSchemaOrField(state, action)
    default:
      return state
  }
}

export default reducer
