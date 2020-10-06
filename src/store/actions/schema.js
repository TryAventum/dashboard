import axios from '../../axios'
import { loading } from './index'
import aventum from '../../aventum'
import * as actionTypes from './actionTypes'

export const loadingSchemas = (payload) => {
  return {
    type: actionTypes.LOADING_SCHEMAS,
    payload
  }
}

export const setSchemas = (schemas) => {
  return {
    type: actionTypes.SET_SCHEMA_LIST,
    schemas
  }
}

export const removeSchema = (schema) => {
  return {
    type: actionTypes.DELETE_SCHEMA,
    schema
  }
}

export const createSchema = (schema) => {
  return {
    type: actionTypes.CREATE_SCHEMA,
    schema,
  }
}

export const saveSchema = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.post('schemas', payload)
      dispatch(loading(false))
      aventum.hooks.doActionSync('saveSchema', response)
      dispatch(createSchema(response.data))
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('saveSchema', error.response)
      throw error
    }
  }
}

export const updateSchema = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.patch(`schemas/${payload.id}`, payload.object)
      dispatch(loading(false))
      aventum.hooks.doActionSync('updateSchema', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('updateSchema', error.response)
      throw error
    }
  }
}

export const getSchemas = () => {
  return (dispatch) => {
    dispatch(loadingSchemas(true))

    axios.get('schemas/all').then(
      (response) => {
        dispatch(loadingSchemas(false))
        dispatch(setSchemas(response.data.schemas))
        aventum.hooks.doActionSync('getSchemas', response)
      },
      (error) => {
        dispatch(loadingSchemas(false))
        aventum.hooks.doActionSync('getSchemas', error.response)
      }
    )
  }
}

export const deleteSchema = (payload) => {
  return (dispatch) => {
    dispatch(loadingSchemas(true))

    axios.delete(`schemas/${payload.id}`).then(
      (response) => {
        dispatch(loadingSchemas(false))
        dispatch(removeSchema(payload.id))
        aventum.hooks.doActionSync('deleteSchema', response)
      },
      (error) => {
        dispatch(loadingSchemas(false))
        aventum.hooks.doActionSync('deleteSchema', error.response)
      }
    )
  }
}
