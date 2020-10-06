import axios from '../../axios'
import { loading } from './index'
import * as actionTypes from './actionTypes'
import aventum from '../../aventum'

export const loadingUser = (payload) => {
  return {
    type: actionTypes.LOADING_USER,
    payload
  }
}

export const setAllCurrentUserValues = (user) => {
  return {
    type: actionTypes.SET_ALL_CURRENT_USER_VALUES,
    user
  }
}

export const setAllUsersCount = (count) => {
  return {
    type: actionTypes.SET_ALL_USERS_COUNT,
    count
  }
}

export const setCurrentUserList = (users, pagination) => {
  return {
    type: actionTypes.SET_CURRENT_USER_LIST,
    users,
    pagination
  }
}

export const setCurrentUserValues = (payload) => {
  return {
    type: actionTypes.SET_CURRENT_USER_VALUES,
    payload
  }
}

export const resetCurrentUserList = () => {
  return {
    type: actionTypes.RESET_CURRENT_USER_LIST
  }
}

export const resetCurrentUserValues = () => {
  return {
    type: actionTypes.RESET_CURRENT_USER_VALUES
  }
}

export const removeUser = (payload) => {
  return {
    type: actionTypes.DELETE_USER,
    payload
  }
}

export const saveUser = (form) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.post('users', form)
      dispatch(loading(false))
      aventum.hooks.doActionSync('userSaved', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('userSaved', error.response)
      throw error
    }
  }
}

export const updateUser = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.patch(`users/${payload.id}`, payload.form)
      dispatch(loading(false))
      aventum.hooks.doActionSync('userUpdated', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('userUpdated', error.response)
      throw error
    }
  }
}

export const deleteUser = (payload) => {
  return (dispatch) => {
    dispatch(loadingUser(true))

    axios.delete(`users/${payload.id}`).then(
      (response) => {
        dispatch(loadingUser(false))
        dispatch(removeUser(payload.id))
        aventum.hooks.doActionSync('userDeleted', response)
      },
      (error) => {
        dispatch(loadingUser(false))
        aventum.hooks.doActionSync('userDeleted', error.response)
      }
    )
  }
}

export const getUserPage = (payload) => {
  return (dispatch) => {
    dispatch(loadingUser(true))
    const url = `users?page=${payload.page}${
      payload.url ? '&' + payload.url : ''
    }`
    axios.get(url).then(
      (response) => {
        dispatch(loadingUser(false))
        dispatch(
          setCurrentUserList(response.data.users, response.data.pagination)
        )
        aventum.hooks.doActionSync('getUserPage', response)
      },
      (error) => {
        dispatch(loadingUser(false))
        aventum.hooks.doActionSync('getUserPage', error.response)
      }
    )
  }
}

export const getCurrentUser = (id) => {
  return (dispatch) => {
    dispatch(loadingUser(true))
    axios.get(`users/${id}`).then(
      (response) => {
        dispatch(loadingUser(false))
        dispatch(setAllCurrentUserValues(response.data.user))
        aventum.hooks.doActionSync('getCurrentUser', response)
      },
      (error) => {
        dispatch(loadingUser(false))
        aventum.hooks.doActionSync('getCurrentUser', error.response)
      }
    )
  }
}

export const getAllUsersCount = () => {
  return (dispatch) => {
    axios.get('users/count').then(
      (response) => {
        dispatch(setAllUsersCount(response.data.count))
        /**
         * Run after allUsersCount Redux action completed.
         *
         * @hook
         * @name allUsersCount
         * @type doActionSync
         * @since 1.0.0
         *
         * @param {Object} response/error The server response(we use [Axios](https://github.com/axios/axios)),
         * on success all users count will be at response.data.count
         */
        aventum.hooks.doActionSync('allUsersCount', response)
      },
      (error) => {
        aventum.hooks.doActionSync('allUsersCount', error)
      }
    )
  }
}
