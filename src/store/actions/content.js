import axios from '../../axios'
import { loading } from './index'
import aventum from '../../aventum'
import * as actionTypes from './actionTypes'

export const loadingContent = (payload) => {
  return {
    type: actionTypes.LOADING_CONTENT,
    payload,
  }
}

export const setAllCurrentContentValues = (content) => {
  return {
    type: actionTypes.SET_ALL_CURRENT_CONTENT_VALUES,
    content,
  }
}

export const setCurrentContentList = (contents, pagination) => {
  return {
    type: actionTypes.SET_CURRENT_CONTENT_LIST,
    contents,
    pagination,
  }
}

export const setCurrentContentValues = (payload) => {
  return {
    type: actionTypes.SET_CURRENT_CONTENT_VALUES,
    payload,
  }
}

export const setDefaultValues = (payload) => {
  return {
    type: actionTypes.SET_DEFAULT_VALUES,
    payload,
  }
}

export const resetCurrentContentList = () => {
  return {
    type: actionTypes.RESET_CURRENT_CONTENT_LIST,
  }
}

export const resetCurrentContentValues = () => {
  aventum.hooks.doActionSync('resetCurrentContentValues')
  return {
    type: actionTypes.RESET_CURRENT_CONTENT_VALUES,
  }
}

export const removeContent = (payload, content) => {
  return {
    type: actionTypes.DELETE_CONTENT,
    payload,
    content,
  }
}

export const saveContent = (form, content) => {
  return async (dispatch) => {
    let response

    try {
      dispatch(loading(true))
      response = await axios.post(content, form)
      dispatch(loading(false))
      aventum.hooks.doActionSync(`${content}ContentSaved`, response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync(`${content}ContentSaved`, error.response)
      throw error
    }
  }
}

export const updateContent = (payload, content) => {
  return async (dispatch) => {
    let response
    try {
      dispatch(loading(true))
      response = await axios.patch(`${content}/${payload.id}`, payload.form)
      dispatch(loading(false))
      aventum.hooks.doActionSync(`${content}ContentUpdated`, response)
      return response
    } catch (error) {
      dispatch(loading(false))
      aventum.hooks.doActionSync(`${content}ContentUpdated`, error.response)
      throw error
    }
  }
}

export const deleteContent = (payload, content) => {
  return (dispatch) => {
    dispatch(loadingContent(true))

    axios.delete(`${content}/${payload.id}`).then(
      (response) => {
        dispatch(loadingContent(false))
        dispatch(removeContent(payload, content))
        aventum.hooks.doActionSync(`cD${payload.uuidv1}`, response, payload)
        aventum.hooks.doActionSync('contentDeleted', response, content, payload)
      },
      (error) => {
        dispatch(loadingContent(false))
        aventum.hooks.doActionSync(`cD${payload.uuidv1}`, error, payload)
        aventum.hooks.doActionSync('contentDeleted', error, content, payload)
      }
    )
  }
}

export const getContentPage = (payload, content) => {
  return (dispatch) => {
    dispatch(loadingContent(true))
    const url = `${content}?page=${payload.page}&perPage=${
      payload.perPage || 20
    }${payload.url ? '&' + payload.url : ''}`

    axios.get(url).then(
      (response) => {
        dispatch(loadingContent(false))
        dispatch(
          setCurrentContentList(
            response.data.contents,
            response.data.pagination
          )
        )
        aventum.hooks.doActionSync('getContentPage', response, content)
        if (payload.id) {
          aventum.hooks.doActionSync(`gCP${payload.id}`, response, content)
        }
      },
      (error) => {
        dispatch(loadingContent(false))
        aventum.hooks.doActionSync('getContentPage', error, content)
        if (payload.id) {
          aventum.hooks.doActionSync(`gCP${payload.id}`, error, content)
        }
      }
    )
  }
}

export const getCurrentContentValues = (id, content) => {
  return (dispatch) => {
    dispatch(loadingContent(true))
    axios.get(`${content}/${id}`).then(
      (response) => {
        dispatch(loadingContent(false))
        dispatch(setAllCurrentContentValues(response.data.content))
        aventum.hooks.doActionSync('getCurrentContentValues', response)
      },
      (error) => {
        dispatch(loadingContent(false))
        aventum.hooks.doActionSync('getCurrentContentValues', error.response)
      }
    )
  }
}
