import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  loadingUser: false,
  currentUserValues: {},
  allUsersCount: 0,
  pagination: {},
  currentUserList: []
}

const setLoadingUser = (state, action) => {
  return updateObject(state, { loadingUser: action.payload })
}

const setAllUsersCount = (state, action) => {
  return updateObject(state, { allUsersCount: action.count })
}

const setCurrentUserValues = (state, action) => {
  const currentUserValues = { ...state.currentUserValues }

  currentUserValues[action.payload.name] = action.payload.value

  return updateObject(state, {
    currentUserValues: currentUserValues
  })
}

const deleteUser = (state, action) => {
  const currentUserList = state.currentUserList.filter(
    i => i.id !== action.payload
  )
  return updateObject(state, {
    currentUserList: currentUserList
  })
}

const setAllCurrentUserValues = (state, action) => {
  return updateObject(state, { currentUserValues: action.user })
}

const resetCurrentUserList = (state, action) => {
  return updateObject(state, { currentUserList: [] })
}

const resetCurrentUserValues = (state, action) => {
  return updateObject(state, { currentUserValues: {} })
}

const setCurrentUserList = (state, action) => {
  return updateObject(state, {
    currentUserList: action.users,
    pagination: action.pagination
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DELETE_USER:
      return deleteUser(state, action)
    case actionTypes.LOADING_USER:
      return setLoadingUser(state, action)
    case actionTypes.SET_CURRENT_USER_VALUES:
      return setCurrentUserValues(state, action)
    case actionTypes.SET_ALL_USERS_COUNT:
      return setAllUsersCount(state, action)
    case actionTypes.RESET_CURRENT_USER_LIST:
      return resetCurrentUserList(state, action)
    case actionTypes.RESET_CURRENT_USER_VALUES:
      return resetCurrentUserValues(state, action)
    case actionTypes.SET_CURRENT_USER_LIST:
      return setCurrentUserList(state, action)
    case actionTypes.SET_ALL_CURRENT_USER_VALUES:
      return setAllCurrentUserValues(state, action)
    default:
      return state
  }
}

export default reducer
