import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  capabilities: [],
  loadingCapabilities: false,
  currentCapabilityValues: {}
}

const setCurrentCapabilityValues = (state, action) => {
  const currentCapabilityValues = { ...state.currentCapabilityValues }

  currentCapabilityValues[action.payload.name] = action.payload.value

  return updateObject(state, {
    currentCapabilityValues: currentCapabilityValues
  })
}

const resetCurrentCapabilityValues = (state, action) => {
  return updateObject(state, { currentCapabilityValues: {} })
}

const setAllCapabilities = (state, action) => {
  return updateObject(state, {
    capabilities: action.capabilities
  })
}

const setAllCurrentCapabilityValues = (state, action) => {
  return updateObject(state, { currentCapabilityValues: action.capability })
}

const deleteCapability = (state, action) => {
  const capabilities = state.capabilities.filter(i => i.id !== action.capability)
  return updateObject(state, {
    capabilities
  })
}

const setLoadingCapabilities = (state, action) => {
  return updateObject(state, { loadingCapabilities: action.payload })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING_CAPABILITIES:
      return setLoadingCapabilities(state, action)
    case actionTypes.DELETE_CAPABILITY:
      return deleteCapability(state, action)
    case actionTypes.SET_CURRENT_CAPABILITY_VALUES:
      return setCurrentCapabilityValues(state, action)
    case actionTypes.RESET_CURRENT_CAPABILITY_VALUES:
      return resetCurrentCapabilityValues(state, action)
    case actionTypes.SET_ALL_CURRENT_CAPABILITY_VALUES:
      return setAllCurrentCapabilityValues(state, action)
    case actionTypes.SET_ALL_CAPABILITIES:
      return setAllCapabilities(state, action)
    default:
      return state
  }
}

export default reducer
