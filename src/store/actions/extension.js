import axios from '../../axios'
import { loading } from './index'
import aventum from '../../aventum'
import * as actionTypes from './actionTypes'
import { v1 as uuidv1 } from 'uuid'

export const loadingExtensions = (payload) => {
  return {
    type: actionTypes.LOADING_EXTENSIONS,
    payload,
  }
}

export const activateExtensionLoading = (payload) => {
  return {
    type: actionTypes.ACTIVATE_EXTENSION_LOADING,
    payload,
  }
}

export const deleteExtensionLoading = (payload) => {
  return {
    type: actionTypes.DELETE_EXTENSION_LOADING,
    payload,
  }
}

export const loadingActiveDashboardExtensions = (payload) => {
  return {
    type: actionTypes.LOADING_ACTIVE_DASHBOARD_EXTENSIONS,
    payload,
  }
}

export const setAllExtensions = (extensions) => {
  return {
    type: actionTypes.SET_ALL_EXTENSIONS,
    extensions,
  }
}

export const setAllActiveDashboardExtensions = (payload) => {
  return {
    type: actionTypes.SET_ALL_ACTIVE_DASHBOARD_EXTENSIONS,
    payload,
  }
}

export const updateExtension = (payload) => {
  return {
    type: actionTypes.UPDATE_EXTENSION,
    payload,
  }
}

export const removeExtension = (extension) => {
  return {
    type: actionTypes.DELETE_EXTENSION,
    extension,
  }
}

export const installExtensionFromRemote = (payload) => {
  return (dispatch) => {
    dispatch(loading(true))

    axios.post('exts/remote-install', payload).then(
      (response) => {
        dispatch(loading(false))
        dispatch(addExtension(response.data.extension))
        aventum.hooks.doActionSync(
          'InstallExtensionFromRemoteSuccessResponse',
          response,
          payload
        )
      },
      (error) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync(
          'InstallExtensionFromRemoteErrorResponse',
          error,
          payload
        )
      }
    )
  }
}

export const activateExtension = (payload) => {
  return (dispatch) => {
    dispatch(activateExtensionLoading(payload.name))

    axios.patch('exts', { extension: payload }).then(
      (response) => {
        dispatch(activateExtensionLoading(false))
        dispatch(updateExtension(response.data.extension))
        aventum.hooks.doActionSync('AfterActivateExtension', response, payload)
      },
      (error) => {
        dispatch(activateExtensionLoading(false))
        aventum.hooks.doActionSync('AfterActivateExtension', error, payload)
      }
    )
  }
}

export const addExtension = (payload) => {
  return {
    type: actionTypes.ADD_EXTENSION,
    payload,
  }
}

export const getAllExtensions = () => {
  return (dispatch) => {
    dispatch(loadingExtensions(true))

    axios.get('exts/all').then(
      (response) => {
        dispatch(loadingExtensions(false))
        dispatch(
          setAllExtensions(
            response.data.map((i) => {
              i.id = uuidv1()
              return i
            })
          )
        )
        aventum.hooks.doActionSync('getAllExtensions', response)
      },
      (error) => {
        dispatch(loadingExtensions(false))
        aventum.hooks.doActionSync('getAllExtensions', error.response)
      }
    )
  }
}

export const getAllActiveDashboardExtensions = () => {
  return (dispatch) => {
    dispatch(loadingActiveDashboardExtensions(true))

    axios.get('exts/active-dashboard').then(
      (response) => {
        dispatch(loadingActiveDashboardExtensions(false))
        dispatch(setAllActiveDashboardExtensions(response.data))
        aventum.hooks.doActionSync('getAllActiveDashboardExtensions', response)
      },
      (error) => {
        dispatch(loadingActiveDashboardExtensions(false))
        aventum.hooks.doActionSync(
          'getAllActiveDashboardExtensions',
          error.response
        )
      }
    )
  }
}

export const deleteExtension = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(deleteExtensionLoading(payload.name))
      response = await axios.delete(
        `exts?name=${encodeURIComponent(payload.name)}`
      )
      dispatch(deleteExtensionLoading(false))
      dispatch(removeExtension(payload.name))
      aventum.hooks.doActionSync(
        'DeleteExtensionSuccess',
        response,
        payload.name
      )
      return response
    } catch (error) {
      dispatch(deleteExtensionLoading(false))
      aventum.hooks.doActionSync('ErrorDeleteExtension', error, payload.name)
      throw error
    }
  }
}
