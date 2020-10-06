import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  translations: [],
  loading: false
}

const setTranslationList = (state, action) => {
  return updateObject(state, {
    translations: action.translations
  })
}

const setLoadingTranslations = (state, action) => {
  return updateObject(state, { loading: action.payload })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ALL_TRANSLATIONS:
      return setTranslationList(state, action)
    case actionTypes.LOADING_TRANSLATIONS:
      return setLoadingTranslations(state, action)
    default:
      return state
  }
}

export default reducer
