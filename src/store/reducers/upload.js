import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  uploads: [],
  loading: false,
  pagination: {},
  selectedUploads: []
}

const loadingUploads = (state, action) => {
  return updateObject(state, {
    loading: action.payload
  })
}

const setUploads = (state, action) => {
  return updateObject(state, {
    uploads: action.uploads,
    pagination: action.pagination
  })
}

const setSelectedUploads = (state, action) => {
  return updateObject(state, {
    selectedUploads: [...action.uploads]
  })
}

const deleteUpload = (state, action) => {
  const uploads = state.uploads.filter(i => i.id !== action.payload)
  return updateObject(state, {
    uploads
  })
}

const addUpload = (state, action) => {
  return updateObject(state, {
    uploads: [action.payload, ...state.uploads]
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_UPLOADS:
      return setUploads(state, action)
    case actionTypes.SET_UPLOADS_LOADING:
      return loadingUploads(state, action)
    case actionTypes.DELETE_UPLOAD:
      return deleteUpload(state, action)
    case actionTypes.ADD_UPLOAD:
      return addUpload(state, action)
    case actionTypes.SET_SELECTED_UPLOADS:
      return setSelectedUploads(state, action)
    default:
      return state
  }
}

export default reducer
