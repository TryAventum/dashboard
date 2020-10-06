import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  currentUser: null,
  token: null,
  loading: false
}

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.token,
    currentUser: action.currentUser
  })
}

const updateCurrentUser = (state, action) => {
  return updateObject(state, {
    currentUser: action.currentUser
  })
}

const authLogout = (state, action) => {
  return updateObject(state, { token: null, currentUser: null })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action)
    case actionTypes.UPDATE_CURRENT_USER:
      return updateCurrentUser(state, action)
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action)
    default:
      return state
  }
}

export default reducer
