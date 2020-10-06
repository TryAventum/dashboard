import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'
import { parseFields } from '../../shared/fieldsHelpers'

const initialState = {
  fields: [],
  loadingFields: false
}

const setFieldList = (state, action) => {
  const fields = action.fields.map(i => {
    i.fields = parseFields(i.fields)
    return i
  })
  return updateObject(state, {
    fields: fields
  })
}

const deleteField = (state, action) => {
  const fields = state.fields.filter(i => i.id !== action.field)
  return updateObject(state, {
    fields: fields
  })
}

const setLoadingFields = (state, action) => {
  return updateObject(state, { loadingFields: action.payload })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_FIELD_LIST:
      return setFieldList(state, action)
    case actionTypes.LOADING_FIELDS:
      return setLoadingFields(state, action)
    case actionTypes.DELETE_FIELD:
      return deleteField(state, action)
    default:
      return state
  }
}

export default reducer
