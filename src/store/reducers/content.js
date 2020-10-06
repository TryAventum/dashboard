import * as actionTypes from '../actions/actionTypes'
import { updateObject, getObjectByName } from '../../shared/utility'
import { setDefaultValues as sDV } from '../../shared/fieldsHelpers'

const initialState = {
  loadingContent: false,
  currentContentValues: {},
  pagination: {},
  currentContentList: [],
}

const setLoadingContent = (state, action) => {
  return updateObject(state, { loadingContent: action.payload })
}

const setCurrentContentValues = (state, action) => {
  const currentContentValues = { ...state.currentContentValues }

  currentContentValues[action.payload.name] = action.payload.value

  return updateObject(state, {
    currentContentValues: currentContentValues,
  })
}

const setDefaultValues = (state, action) => {
  const content = getObjectByName(
    action.payload.schemas,
    action.payload.content
  )

  return updateObject(state, {
    currentContentValues: sDV(content, action.payload.customFields),
  })
}

const deleteContent = (state, action) => {
  const currentContentList = state.currentContentList.filter(
    (i) => i.id !== action.payload
  )
  return updateObject(state, {
    currentContentList: currentContentList,
  })
}

const setAllCurrentContentValues = (state, action) => {
  return updateObject(state, { currentContentValues: action.content })
}

const resetCurrentContentList = (state, action) => {
  return updateObject(state, { currentContentList: [] })
}

const resetCurrentContentValues = (state, action) => {
  return updateObject(state, { currentContentValues: {} })
}

const setCurrentContentList = (state, action) => {
  return updateObject(state, {
    currentContentList: action.contents,
    pagination: action.pagination,
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DELETE_CONTENT:
      return deleteContent(state, action)
    case actionTypes.LOADING_CONTENT:
      return setLoadingContent(state, action)
    case actionTypes.SET_CURRENT_CONTENT_VALUES:
      return setCurrentContentValues(state, action)
    case actionTypes.SET_DEFAULT_VALUES:
      return setDefaultValues(state, action)
    case actionTypes.RESET_CURRENT_CONTENT_LIST:
      return resetCurrentContentList(state, action)
    case actionTypes.RESET_CURRENT_CONTENT_VALUES:
      return resetCurrentContentValues(state, action)
    case actionTypes.SET_CURRENT_CONTENT_LIST:
      return setCurrentContentList(state, action)
    case actionTypes.SET_ALL_CURRENT_CONTENT_VALUES:
      return setAllCurrentContentValues(state, action)
    default:
      return state
  }
}

export default reducer
