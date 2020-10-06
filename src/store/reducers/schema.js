import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'
import { parseFields } from '../../shared/fieldsHelpers'

const initialState = {
  schemas: [],
  loadingSchemas: false,
}

const setSchemaList = (state, action) => {
  const schemas = action.schemas.map((i) => {
    i.fields = parseFields(i.fields)
    return i
  })

  return updateObject(state, {
    schemas: schemas,
  })
}

const deleteSchema = (state, action) => {
  const schemas = state.schemas.filter((i) => i.id !== action.schema)
  return updateObject(state, {
    schemas: schemas,
  })
}

const createSchema = (state, action) => {
  action.schema.fields = parseFields(action.schema.fields)
  return updateObject(state, {
    schemas: [action.schema, ...state.schemas],
  })
}

const setLoadingSchemas = (state, action) => {
  return updateObject(state, { loadingSchemas: action.payload })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SCHEMA_LIST:
      return setSchemaList(state, action)
    case actionTypes.LOADING_SCHEMAS:
      return setLoadingSchemas(state, action)
    case actionTypes.DELETE_SCHEMA:
      return deleteSchema(state, action)
    case actionTypes.CREATE_SCHEMA:
      return createSchema(state, action)
    default:
      return state
  }
}

export default reducer
