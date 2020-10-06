import * as actionTypes from './actionTypes'
import aventum from '../../aventum'
import axios from '../../axios'

export const setUploads = (uploads, pagination) => {
  return {
    type: actionTypes.SET_UPLOADS,
    uploads,
    pagination
  }
}

export const setSelectedUploads = uploads => {
  return {
    type: actionTypes.SET_SELECTED_UPLOADS,
    uploads
  }
}

export const addUpload = payload => {
  return {
    type: actionTypes.ADD_UPLOAD,
    payload
  }
}

export const setLoadingUploads = payload => {
  return {
    type: actionTypes.SET_UPLOADS_LOADING,
    payload
  }
}

export const removeUpload = payload => {
  return {
    type: actionTypes.DELETE_UPLOAD,
    payload
  }
}

export const getUploads = payload => {
  return dispatch => {
    dispatch(setLoadingUploads(true))
    const url = `uploads?page=${payload.page}${
      payload.url ? '&' + payload.url : ''
    }`

    axios.get(url).then(
      response => {
        dispatch(setLoadingUploads(false))
        if (!payload.emit) {
          dispatch(setUploads(response.data.uploads, response.data.pagination))
        }
        aventum.hooks.doActionSync(
          `${payload.id ? payload.id : ''}getUploads`,
          response
        )
      },
      error => {
        dispatch(setLoadingUploads(false))
        aventum.hooks.doActionSync(
          `${payload.id ? payload.id : ''}getUploads`,
          error.response
        )
      }
    )
  }
}

export const deleteUpload = payload => {
  return dispatch => {
    dispatch(setLoadingUploads(true))

    axios.delete(`uploads/${payload.id}`).then(
      response => {
        dispatch(setLoadingUploads(false))
        dispatch(removeUpload(payload.id))
        aventum.hooks.doActionSync('deleteUpload', response)
      },
      error => {
        dispatch(setLoadingUploads(false))
        aventum.hooks.doActionSync('deleteUpload', error.response)
      }
    )
  }
}
