import axios from '../../axios'
import * as actionTypes from './actionTypes'
import aventum from '../../aventum'

export const loadingOptions = (payload) => {
  return {
    type: actionTypes.LOADING_OPTIONS,
    payload
  }
}

export const loadingActions = (payload) => {
  return {
    type: actionTypes.LOADING_ACTIONS,
    payload
  }
}

export const setAllOptions = (payload) => {
  return {
    type: actionTypes.SET_All_OPTIONS,
    payload
  }
}

export const setUpdatedOptions = (payload) => {
  return {
    type: actionTypes.UPDATE_OPTIONS,
    payload,
  }
}

export const setLoginOptions = (payload) => {
  return {
    type: actionTypes.SET_LOGIN_OPTIONS,
    payload
  }
}

export const resetOptions = () => {
  return {
    type: actionTypes.RESET_OPTIONS
  }
}

export const updateOptions = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(setUpdatedOptions(payload.options))
      dispatch(loadingOptions(true))
      response = await axios.patch('options', payload)
      dispatch(loadingOptions(false))
      aventum.hooks.doActionSync('optionsUpdated', response)
      return response
    } catch (error) {
      dispatch(loadingOptions(false))
      aventum.hooks.doActionSync('optionsUpdated', error.response)
      throw error
    }
  }
}

export const callEndPoint = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loadingActions({ name: payload.actionName, payload: true }))
      if (payload.method === 'get') {
        response = await axios.get(payload.url)
        dispatch(loadingActions({ name: payload.actionName, payload: false }))
        aventum.hooks.doActionSync(`do${payload.actionName}`, response)
        return response
      } else {
        response = await axios.post(payload.url, payload.payload)
        dispatch(loadingActions({ name: payload.actionName, payload: false }))
        aventum.hooks.doActionSync(`do${payload.actionName}`, response)
        return response
      }
    } catch (error) {
      throw error
    }
  }
}

export const getOptions = () => {
  return (dispatch) => {
    dispatch(loadingOptions(true))

    const url = 'options/all'

    axios.get(url).then(
      (response) => {
        dispatch(loadingOptions(false))
        aventum.db.type = response.data.options.find(
          (o) => o.name === 'DB_TYPE'
        ).value

        dispatch(setAllOptions(response.data.options))

        /**
         * Run after getOptions Redux action completed.
         *
         * @hook
         * @name getOptions
         * @type doActionSync
         * @since 1.0.0
         *
         * @param {Object} response/error The server response(we use [Axios](https://github.com/axios/axios)),
         * on success the options will be at response.data.options
         */
        aventum.hooks.doActionSync('getOptions', response)
      },
      (error) => {
        dispatch(loadingOptions(false))
        aventum.hooks.doActionSync('getOptions', error)
      }
    )
  }
}

export const getPublicOptions = () => {
  return (dispatch) => {
    dispatch(loadingOptions(true))

    const url = 'options/public'

    axios.get(url).then(
      (response) => {
        dispatch(loadingOptions(false))
        dispatch(setLoginOptions(response.data.options))
        aventum.hooks.doActionSync('getPublicOptions', response)
      },
      (error) => {
        dispatch(loadingOptions(false))
        aventum.hooks.doActionSync('getPublicOptions', error)
      }
    )
  }
}
