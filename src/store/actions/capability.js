import axios from '../../axios'
import { loading } from './index'
import aventum from '../../aventum'
import * as actionTypes from './actionTypes'

export const loadingCapabilities = (payload) => {
  return {
    type: actionTypes.LOADING_CAPABILITIES,
    payload
  }
}

export const setCurrentCapabilityValues = (payload) => {
  return {
    type: actionTypes.SET_CURRENT_CAPABILITY_VALUES,
    payload
  }
}

export const setAllCapabilities = (capabilities) => {
  return {
    type: actionTypes.SET_ALL_CAPABILITIES,
    capabilities
  }
}

export const resetCurrentCapabilityValues = () => {
  return {
    type: actionTypes.RESET_CURRENT_CAPABILITY_VALUES
  }
}

export const setAllCurrentCapabilityValues = (capability) => {
  return {
    type: actionTypes.SET_ALL_CURRENT_CAPABILITY_VALUES,
    capability
  }
}

export const removeCapability = (capability) => {
  return {
    type: actionTypes.DELETE_CAPABILITY,
    capability
  }
}

export const saveCapability = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.post('capabilities', payload)
      dispatch(loading(false))
      aventum.hooks.doActionSync('capabilitySaved', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('capabilitySaved', error.response)
      throw error
    }
  }
}

export const updateCapability = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.patch(`capabilities/${payload.id}`, payload.form)
      dispatch(loading(false))
      aventum.hooks.doActionSync('capabilityUpdated', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('capabilityUpdated', error.response)
      throw error
    }
  }
}

export const deleteCapability = (payload) => {
  return (dispatch) => {
    dispatch(loadingCapabilities(true))

    axios.delete(`capabilities/${payload.id}`).then(
      (response) => {
        dispatch(loadingCapabilities(false))
        dispatch(removeCapability(payload.id))
        aventum.hooks.doActionSync('deleteCapability', response)
      },
      (error) => {
        dispatch(loadingCapabilities(false))
        aventum.hooks.doActionSync('deleteCapability', error.response)
      }
    )
  }
}

export const getCurrentCapability = (id) => {
  return (dispatch) => {
    dispatch(loadingCapabilities(true))
    axios.get(`capabilities/${id}`).then(
      (response) => {
        dispatch(loadingCapabilities(false))
        dispatch(setAllCurrentCapabilityValues(response.data.capability))
        aventum.hooks.doActionSync('getCurrentCapability', response)
      },
      (error) => {
        dispatch(loadingCapabilities(false))
        aventum.hooks.doActionSync('getCurrentCapability', error.response)
      }
    )
  }
}

export const getAllCapabilities = () => {
  return (dispatch) => {
    dispatch(loadingCapabilities(true))

    axios.get('capabilities/all').then(
      (response) => {
        dispatch(loadingCapabilities(false))
        dispatch(setAllCapabilities(response.data.capabilities))
        aventum.hooks.doActionSync('getAllCapabilities', response)
      },
      (error) => {
        dispatch(loadingCapabilities(false))
        aventum.hooks.doActionSync('getAllCapabilities', error.response)
      }
    )
  }
}
