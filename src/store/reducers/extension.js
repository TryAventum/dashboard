import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  extensions: [],
  activeDashboardExtensions: [],
  loadingExtensions: false,
  loadingDeleteExtension: false,
  activateExtensionLoading: false,
  loadingActiveDashboardExtensions: false
}

const setExtensionList = (state, action) => {
  return updateObject(state, {
    extensions: action.extensions
  })
}

const setAllActiveDashboardExtensions = (state, action) => {
  return updateObject(state, {
    activeDashboardExtensions: action.payload
  })
}

const updateExtension = (state, action) => {
  let extensions = [...state.extensions]
  extensions = extensions.map(e => {
    if (e.name === action.payload.name) {
      e.aventum.active = action.payload.aventum.active
    }
    return e
  })
  return updateObject(state, {
    extensions
  })
  // let extensionIndex = state.currentExtensionList.findIndex(
  //   p => p.id === action.payload.id
  // )
  // let newExtensions = [...state.currentExtensionList]
  // newExtensions[extensionIndex] = action.payload
  // return updateObject(state, {
  //   currentExtensionList: newExtensions
  // })
}

const addExtension = (state, action) => {
  return updateObject(state, {
    extensions: [action.payload, ...state.extensions]
  })
}

const deleteExtension = (state, action) => {
  const extensions = state.extensions.filter(i => i.name !== action.extension)
  return updateObject(state, {
    extensions
  })
}

const setLoadingExtensions = (state, action) => {
  return updateObject(state, { loadingExtensions: action.payload })
}

const setActivateExtensionLoading = (state, action) => {
  return updateObject(state, { activateExtensionLoading: action.payload })
}

const setLoadingActiveDashboardExtensions = (state, action) => {
  return updateObject(state, { loadingActiveDashboardExtensions: action.payload })
}

const setLoadingDeleteExtension = (state, action) => {
  return updateObject(state, { loadingDeleteExtension: action.payload })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ALL_EXTENSIONS:
      return setExtensionList(state, action)
    case actionTypes.SET_ALL_ACTIVE_DASHBOARD_EXTENSIONS:
      return setAllActiveDashboardExtensions(state, action)
    case actionTypes.LOADING_ACTIVE_DASHBOARD_EXTENSIONS:
      return setLoadingActiveDashboardExtensions(state, action)
    case actionTypes.ADD_EXTENSION:
      return addExtension(state, action)
    case actionTypes.LOADING_EXTENSIONS:
      return setLoadingExtensions(state, action)
    case actionTypes.DELETE_EXTENSION_LOADING:
      return setLoadingDeleteExtension(state, action)
    case actionTypes.ACTIVATE_EXTENSION_LOADING:
      return setActivateExtensionLoading(state, action)
    case actionTypes.DELETE_EXTENSION:
      return deleteExtension(state, action)
    case actionTypes.UPDATE_EXTENSION:
      return updateExtension(state, action)
    default:
      return state
  }
}

export default reducer
