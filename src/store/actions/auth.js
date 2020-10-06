import aventum from '../../aventum'
import axios from '../../axios'
import { loading } from './index'

import * as actionTypes from './actionTypes'

export const authSuccess = (token, currentUser) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    currentUser: currentUser
  }
}

export const updateCurrentUser = (currentUser) => {
  return {
    type: actionTypes.UPDATE_CURRENT_USER,
    currentUser: currentUser
  }
}

export const logout = () => {
  localStorage.removeItem('x-access-token')
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const authCheckState = () => {
  return (dispatch) => {
    axios.get('users/me').then(
      (response) => {
        const currentUser = response.data
        dispatch(
          authSuccess(
            axios.defaults.headers.common['x-access-token'],
            currentUser
          )
        )
        aventum.hooks.doActionSync('authCheckState', response)
      },
      (error) => {
        dispatch(logout())
        aventum.hooks.doActionSync('authCheckState', error.response)
      }
    )
  }
}

export const signUp = (payload) => {
  return (dispatch) => {
    dispatch(loading(true))

    const url =
      payload.pathname === '/register' ? 'users/register' : 'users/setup'

    axios.post(url, payload.form).then(
      (response) => {
        dispatch(loading(false))
        const token = response.headers['x-access-token']
        const currentUser = response.data
        axios.defaults.headers.common['x-access-token'] = token || ''
        dispatch(authSuccess(token, currentUser))
        localStorage.setItem('x-access-token', token)
        aventum.hooks.doActionSync('signUp', response)
      },
      (error) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync('signUp', error.response)
      }
    )
  }
}

export const signIn = (payload) => {
  return (dispatch) => {
    dispatch(loading(true))

    axios.post('users/login', payload).then(
      (response) => {
        dispatch(loading(false))
        const token = response.headers['x-access-token']
        const currentUser = response.data
        axios.defaults.headers.common['x-access-token'] = token || ''
        dispatch(authSuccess(token, currentUser))
        localStorage.setItem('x-access-token', token)
        aventum.hooks.doActionSync('signIn', response)
      },
      (error) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync('signIn', error.response)
      }
    )
  }
}

export const emailConfirmation = (payload) => {
  return (dispatch) => {
    dispatch(loading(true))

    axios.post('users/emailConfirmation', payload).then(
      (response) => {
        dispatch(loading(false))

        /**
         * Fires after the server response to the email confirmation request on the email confirmation page
         * after the user clicks on the confirmation link in the email.
         *
         * @hook
         * @name emailConfirmation
         * @type doActionSync
         * @since 1.0.0
         *
         * @param {Object} response/error The server response(we use [Axios](https://github.com/axios/axios)),
         * on success the current user data will be at response.data and the new authentication token at
         * response.headers['x-access-token']
         *
         * @param {Object} payload the payload that sent to the server, it should contain the token at
         * payload.token
         */
        aventum.hooks.doActionSync('emailConfirmation', response, payload)
      },
      (error) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync('emailConfirmation', error, payload)
      }
    )
  }
}

export const providerLogin = (payload) => {
  return (dispatch) => {
    dispatch(loading(true))

    axios.defaults.headers.common['x-access-token'] = payload.token
      ? payload.token
      : ''

    axios.post(`users/login/${payload.provider}/provider`).then(
      (response) => {
        dispatch(loading(false))
        const token = response.headers['x-access-token']
        const currentUser = response.data
        axios.defaults.headers.common['x-access-token'] = token || ''
        dispatch(authSuccess(token, currentUser))
        localStorage.setItem('x-access-token', token)
        aventum.hooks.doActionSync('providerLogin', response)
      },
      (error) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync('providerLogin', error.response)
      }
    )
  }
}

export const forgetPassword = (payload) => {
  return (dispatch) => {
    dispatch(loading(true))

    axios.post('users/forgotPassword', payload).then(
      (response) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync('forgetPassword', response)
      },
      (error) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync('forgetPassword', error.response)
      }
    )
  }
}

export const resetPassword = (payload) => {
  return (dispatch) => {
    dispatch(loading(true))
    axios.defaults.headers.common['x-access-token'] = payload.token
      ? payload.token
      : ''
    axios.post('users/resetPassword', payload.form).then(
      (response) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync('resetPassword', response)
      },
      (error) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync('resetPassword', error.response)
      }
    )
  }
}

export const resendConfirmationEmail = () => {
  return (dispatch) => {
    dispatch(loading(true))

    axios.post('users/resendConfirmationEmail').then(
      (response) => {
        dispatch(loading(false))
        /**
         * Fires after running resendConfirmationEmail redux action which dispatched when the
         * user request to resend confirmation email.
         *
         * @hook
         * @name resendConfirmationEmail
         * @type doActionSync
         * @since 1.0.0
         *
         * @param {Object} response/error The server response(we use [Axios](https://github.com/axios/axios))
         * on success means the email was sent.
         */
        aventum.hooks.doActionSync('resendConfirmationEmail', response)
      },
      (error) => {
        dispatch(loading(false))
        aventum.hooks.doActionSync('resendConfirmationEmail', error)
      }
    )
  }
}

export const updateProfile = (payload) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.patch('users/profile', payload)
      dispatch(loading(false))
      aventum.hooks.doActionSync('profileUpdated', response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync('profileUpdated', error.response)
      throw error
    }
  }
}
