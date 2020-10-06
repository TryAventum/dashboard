import * as actionTypes from './actionTypes'
import axios from '../../axios'

export const loading = payload => {
  return {
    type: actionTypes.SET_NOTIFICATIONS_LOADING,
    payload
  }
}

export const setNotificationsPage = (notifications, pagination) => {
  return {
    type: actionTypes.SET_NOTIFICATIONS_PAGE,
    notifications,
    pagination
  }
}

export const setNotificationStatus = payload => {
  return {
    type: actionTypes.SET_NOTIFICATION_STATUS,
    payload
  }
}

export const getNotifications = payload => {
  return dispatch => {
    dispatch(loading(true))
    const url = `notifications?page=${payload.page}`

    axios.get(url).then(
      response => {
        dispatch(loading(false))
        dispatch(
          setNotificationsPage(
            response.data.notifications,
            response.data.pagination
          )
        )
      },
      error => {
        dispatch(loading(false))
      }
    )
  }
}

export const changeNotificationStatus = payload => {
  return dispatch => {
    dispatch(loading(payload.id))

    axios.patch(`notifications/${payload.id}`, payload).then(
      response => {
        dispatch(loading(false))
        dispatch(setNotificationStatus(response.data.notification))
      },
      error => {
        dispatch(loading(false))
      }
    )
  }
}
