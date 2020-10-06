import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  roles: [],
  loadingRoles: false,
  currentRoleValues: {}
}

const setRoleList = (state, action) => {
  return updateObject(state, {
    roles: action.roles
  })
}

const setCurrentRoleValues = (state, action) => {
  const currentRoleValues = { ...state.currentRoleValues }

  currentRoleValues[action.payload.name] = action.payload.value

  return updateObject(state, {
    currentRoleValues: currentRoleValues
  })
}

const resetCurrentRoleValues = (state, action) => {
  return updateObject(state, { currentRoleValues: {} })
}

const setAllCurrentRoleValues = (state, action) => {
  return updateObject(state, { currentRoleValues: action.role })
}

const deleteRole = (state, action) => {
  const roles = state.roles.filter(i => i.id !== action.role)
  return updateObject(state, {
    roles: roles
  })
}

const setLoadingRoles = (state, action) => {
  return updateObject(state, { loadingRoles: action.payload })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ALL_ROLES:
      return setRoleList(state, action)
    case actionTypes.LOADING_ROLES:
      return setLoadingRoles(state, action)
    case actionTypes.DELETE_ROLE:
      return deleteRole(state, action)
    case actionTypes.SET_CURRENT_ROLE_VALUES:
      return setCurrentRoleValues(state, action)
    case actionTypes.RESET_CURRENT_ROLE_VALUES:
      return resetCurrentRoleValues(state, action)
    case actionTypes.SET_ALL_CURRENT_ROLE_VALUES:
      return setAllCurrentRoleValues(state, action)
    default:
      return state
  }
}

export default reducer
