import axios from '../../axios'
import { loading } from './index'
import aventum from '../../aventum'
import * as actionTypes from './actionTypes'

export const loadingFields = (payload) => {
  return {
    type: actionTypes.LOADING_FIELDS,
    payload
  }
}

export const setFields = (fields) => {
  return {
    type: actionTypes.SET_FIELD_LIST,
    fields
  }
}

export const removeField = (field) => {
  return {
    type: actionTypes.DELETE_FIELD,
    field
  }
}

export const saveField = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.post('fields', payload)
      dispatch(loading(false))
      aventum.hooks.doActionSync('saveField', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('saveField', error.response)
      throw error
    }
  }
}

export const updateField = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.patch(`fields/${payload.id}`, payload.object)
      dispatch(loading(false))
      aventum.hooks.doActionSync('updateField', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('updateField', error.response)
      throw error
    }
  }
}

export const getFields = () => {
  return (dispatch) => {
    dispatch(loadingFields(true))

    axios.get('fields/all').then(
      (response) => {
        dispatch(loadingFields(false))
        dispatch(setFields(response.data.fields))
        aventum.hooks.doActionSync('getFields', response)
      },
      (error) => {
        dispatch(loadingFields(false))
        aventum.hooks.doActionSync('getFields', error.response)
      }
    )
  }
}

export const deleteField = (payload) => {
  return (dispatch) => {
    dispatch(loadingFields(true))

    axios.delete(`fields/${payload.id}`).then(
      (response) => {
        dispatch(loadingFields(false))
        dispatch(removeField(payload.id))
        aventum.hooks.doActionSync('deleteField', response)
      },
      (error) => {
        dispatch(loadingFields(false))
        aventum.hooks.doActionSync('deleteField', error.response)
      }
    )
  }
}
