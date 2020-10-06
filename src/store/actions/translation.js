import axios from '../../axios'
import { loading } from './index'
import * as actionTypes from './actionTypes'
import aventum from '../../aventum'

export const loadingTranslations = (payload) => {
  return {
    type: actionTypes.LOADING_TRANSLATIONS,
    payload,
  }
}

export const setAllTranslations = (translations) => {
  return {
    type: actionTypes.SET_ALL_TRANSLATIONS,
    translations,
  }
}

export const updateTranslations = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.put('translations', payload)
      dispatch(loading(false))
      aventum.hooks.doActionSync('translationsUpdated', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('translationsUpdated', error.response)
      throw error
    }
  }
}

export const getAllTranslations = () => {
  return (dispatch) => {
    dispatch(loadingTranslations(true))

    axios.get('translations/all').then(
      (response) => {
        dispatch(loadingTranslations(false))
        dispatch(setAllTranslations(response.data.translations))

        /**
         * Run after getAllTranslations Redux action completed.
         *
         * @hook
         * @name getAllTranslations
         * @type doActionSync
         * @since 1.0.0
         *
         * @param {Object} response/error The server response(we use [Axios](https://github.com/axios/axios)),
         * on success the translations will be at response.data.translations
         */
        aventum.hooks.doActionSync('getAllTranslations', response)
      },
      (error) => {
        dispatch(loadingTranslations(false))
        aventum.hooks.doActionSync('getAllTranslations', error)
      }
    )
  }
}
