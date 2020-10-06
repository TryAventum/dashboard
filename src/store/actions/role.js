import axios from '../../axios'
import { loading } from './index'
import * as actionTypes from './actionTypes'
import aventum from '../../aventum'

export const loadingRoles = (payload) => {
  return {
    type: actionTypes.LOADING_ROLES,
    payload
  }
}

export const setCurrentRoleValues = (payload) => {
  return {
    type: actionTypes.SET_CURRENT_ROLE_VALUES,
    payload
  }
}

export const resetCurrentRoleValues = () => {
  return {
    type: actionTypes.RESET_CURRENT_ROLE_VALUES
  }
}

export const setAllCurrentRoleValues = (role) => {
  return {
    type: actionTypes.SET_ALL_CURRENT_ROLE_VALUES,
    role
  }
}

export const setAllRoles = (roles) => {
  return {
    type: actionTypes.SET_ALL_ROLES,
    roles
  }
}

export const removeRole = (role) => {
  return {
    type: actionTypes.DELETE_ROLE,
    role
  }
}

export const saveRole = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.post('roles', payload)
      dispatch(loading(false))
      aventum.hooks.doActionSync('roleSaved', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('roleSaved', error.response)
      throw error
    }
  }
}

export const updateRole = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.patch(`roles/${payload.id}`, payload.form)
      dispatch(loading(false))
      aventum.hooks.doActionSync('roleUpdated', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('roleUpdated', error.response)
      throw error
    }
  }
}

export const getAllRoles = () => {
  return (dispatch) => {
    dispatch(loadingRoles(true))

    axios.get('roles/all').then(
      (response) => {
        dispatch(loadingRoles(false))
        dispatch(setAllRoles(response.data.roles))

        /**
         * Run after getAllRoles Redux action completed.
         *
         * @hook
         * @name getAllRoles
         * @type doActionSync
         * @since 1.0.0
         *
         * @param {Object} response/error The server response(we use [Axios](https://github.com/axios/axios)),
         * on success the roles will be at response.data.roles
         */
        aventum.hooks.doActionSync('getAllRoles', response)
      },
      (error) => {
        dispatch(loadingRoles(false))
        aventum.hooks.doActionSync('getAllRoles', error)
      }
    )
  }
}

export const deleteRole = (payload) => {
  return (dispatch) => {
    dispatch(loadingRoles(true))

    axios.delete(`roles/${payload.id}`).then(
      (response) => {
        dispatch(loadingRoles(false))
        dispatch(removeRole(payload.id))
        aventum.hooks.doActionSync('deleteRole', response)
      },
      (error) => {
        dispatch(loadingRoles(false))
        aventum.hooks.doActionSync('deleteRole', error.response)
      }
    )
  }
}

export const getCurrentRole = (id) => {
  return (dispatch) => {
    dispatch(loadingRoles(true))
    axios.get(`roles/${id}`).then(
      (response) => {
        dispatch(loadingRoles(false))
        dispatch(setAllCurrentRoleValues(response.data.role))
        aventum.hooks.doActionSync('getCurrentRole', response)
      },
      (error) => {
        dispatch(loadingRoles(false))
        aventum.hooks.doActionSync('getCurrentRole', error.response)
      }
    )
  }
}
