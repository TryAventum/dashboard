import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  notifications: [],
  pagination: {},
  loading: ''
}

const setLoading = (state, action) => {
  return updateObject(state, { loading: action.payload })
}

const setNotificationsPage = (state, action) => {
  return updateObject(state, {
    notifications: [...state.notifications, ...action.notifications],
    pagination: action.pagination
  })
}

const setNotificationStatus = (state, action) => {
  let newNotifications = [...state.notifications]

  newNotifications = newNotifications.map(n => {
    if (n.id === action.payload.id) {
      n.status = action.payload.status
      n.touched = action.payload.touched
    }

    return n
  })

  return updateObject(state, {
    notifications: newNotifications
  })
}

// const removeNotification = (state, action) => {
//   let notifications = state.notifications.filter(n => n.route !== action.payload)
//   return updateObject(state, {
//     notifications
//   })
// }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_NOTIFICATIONS_LOADING:
      return setLoading(state, action)
    case actionTypes.SET_NOTIFICATIONS_PAGE:
      return setNotificationsPage(state, action)
    case actionTypes.SET_NOTIFICATION_STATUS:
      return setNotificationStatus(state, action)
    default:
      return state
  }
}

export default reducer
