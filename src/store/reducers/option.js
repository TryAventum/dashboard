import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  loadingOptions: false,
  loadingActions: {},
  publicOptions: [],
  options: [],
}

const resetOptions = (state, action) => {
  return updateObject(state, {
    options: [],
  })
}

const setAllOptions = (state, action) => {
  return updateObject(state, {
    options: action.payload,
  })
}

const updateOptions = (state, action) => {
  return updateObject(state, {
    options: state.options.map((o) => {
      const uo = action.payload.find((i) => i.name === o.name)

      if (uo) {
        o.value = uo.value
      }
      return o
    }),
  })
}

const setLoginOptions = (state, action) => {
  return updateObject(state, {
    publicOptions: action.payload,
  })
}

const setLoadingOptions = (state, action) => {
  return updateObject(state, { loadingOptions: action.payload })
}

const setLoadingActions = (state, action) => {
  const oldValue = { ...state.loadingActions }

  oldValue[action.payload.name] = action.payload.payload

  return updateObject(state, { loadingActions: oldValue })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING_OPTIONS:
      return setLoadingOptions(state, action)
    case actionTypes.LOADING_ACTIONS:
      return setLoadingActions(state, action)
    case actionTypes.UPDATE_OPTIONS:
      return updateOptions(state, action)
    case actionTypes.SET_All_OPTIONS:
      return setAllOptions(state, action)
    case actionTypes.SET_LOGIN_OPTIONS:
      return setLoginOptions(state, action)
    case actionTypes.RESET_OPTIONS:
      return resetOptions(state, action)
    default:
      return state
  }
}

export default reducer
