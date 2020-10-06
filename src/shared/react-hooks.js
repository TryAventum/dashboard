import { useEffect, useRef, useReducer, useState } from 'react'
import { v1 } from 'uuid'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getObjectByName } from './utility'
import * as fieldsHelpers from './fieldsHelpers'
import SchemaFieldValidator from './SchemaFieldValidator'

export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function undoReducer(state, action) {
  switch (action.type) {
    case 'addToUndo':
      return {
        undoList: [...state.undoList, action.payload],
        dismissList: state.dismissList,
        deleted: state.deleted,
      }
    case 'addToDismiss':
      return {
        undoList: state.undoList.filter((i) => i.id !== action.payload.id),
        dismissList: [...state.dismissList, action.payload],
        deleted: state.deleted,
      }
    case 'deleteFromAll':
      return {
        undoList: state.undoList.filter((i) => i.id !== action.payload.id),
        dismissList: state.dismissList.filter(
          (i) => i.id !== action.payload.id
        ),
        deleted: [...state.deleted, action.payload],
      }
    case 'undo':
      const itm = state.undoList.find((l) => l.id === action.payload.id)
      itm && clearTimeout(itm.timer)
      return {
        undoList: state.undoList.filter((i) => i.id !== action.payload.id),
        dismissList: state.dismissList,
        deleted: state.deleted,
      }
    default:
      throw new Error()
  }
}

export function useUndo(deleteItem) {
  const [state, dispatch] = useReducer(undoReducer, {
    undoList: [],
    dismissList: [],
    deleted: [],
  })
  const currentState = useRef()

  currentState.current = state

  const removeWithUndo = (item) => {
    const timer = setTimeout(() => {
      if (
        currentState.current.undoList.find((i) => i.id === item.id) ||
        currentState.current.dismissList.find((i) => i.id === item.id)
      ) {
        deleteItem(item)
        dispatch({ type: 'deleteFromAll', payload: item })
      }
    }, 3000)
    item.timer = timer

    dispatch({ type: 'addToUndo', payload: item })
  }

  const onUndo = (item) => {
    dispatch({ type: 'undo', payload: item })
  }

  const onDismiss = (item) => {
    dispatch({ type: 'addToDismiss', payload: item })
  }

  return {
    allUndoLists: [...state.undoList, ...state.dismissList, ...state.deleted],
    undoList: state.undoList,
    removeWithUndo,
    onUndo,
    onDismiss,
  }
}

function notificationReducer(state, action) {
  switch (action.type) {
    case 'addNotification':
      return {
        notificationList: [...state.notificationList, action.payload],
      }
    case 'updateNotification':
      return {
        notificationList: state.notificationList.map((n) => {
          if (n.id === action.payload.id) {
            return action.payload
          }

          return n
        }),
      }
    case 'dismiss':
      return {
        notificationList: state.notificationList.filter(
          (i) => i.id !== action.payload.id
        ),
      }
    case 'deleteNotification':
      return {
        notificationList: state.notificationList.filter(
          (i) => i.id !== action.payload.id
        ),
      }
    default:
      throw new Error()
  }
}

export function useNotification() {
  const [state, dispatch] = useReducer(notificationReducer, {
    notificationList: [],
  })

  const onDismiss = (item) => {
    dispatch({ type: 'dismiss', payload: item })
  }

  const addNotification = (item, options = {}) => {
    options.id = v1()

    if (item instanceof Promise) {
      // Show loading
      options.loading = true
      item
        .then((r) => {
          options.loading = false
          // On success green and wait for three seconds
          options.success = true
          const timer = setTimeout(() => {
            dispatch({ type: 'deleteNotification', payload: options })
          }, 3000)
          item.timer = timer
          dispatch({ type: 'updateNotification', payload: options })
        })
        .catch((e) => {
          options.loading = false
          // On error red and wait for three seconds
          options.error = true
          const timer = setTimeout(() => {
            dispatch({ type: 'deleteNotification', payload: options })
          }, 3000)
          item.timer = timer
          dispatch({ type: 'updateNotification', payload: options })
        })
    } else {
      const timer = setTimeout(() => {
        dispatch({ type: 'deleteNotification', payload: options })
      }, 3000)
      item.timer = timer
    }

    dispatch({ type: 'addNotification', payload: options })
  }

  return {
    notificationList: state.notificationList,
    addNotification,
    onDismiss,
  }
}

export const useSchemaFieldHelper = ({
  objects,
  objectName,
  setCurrentEditedSchemaOrField,
  schemas,
  saveMethod,
  updateMethod,
}) => {
  const { t } = useTranslation()

  const getCurrentObject = () => {
    return getObjectByName(objects, objectName)
  }

  const [acl, setAcl] = useState(() =>
    getCurrentObject() ? getCurrentObject().acl : null
  )
  const [icon, setIcon] = useState(() =>
    getCurrentObject() ? getCurrentObject().icon : ''
  )
  const [name, setName] = useState(() =>
    getCurrentObject() ? getCurrentObject().name : ''
  )
  const [title, setTitle] = useState(() =>
    getCurrentObject() ? getCurrentObject().title : ''
  )
  const [fields, setFields] = useState(() =>
    getCurrentObject() ? getCurrentObject().fields : []
  )

  const [nameErrors, setNameErrors] = useState([])
  const [titleErrors, setTitleErrors] = useState([])
  const [singularTitle, setSingularTitle] = useState(() =>
    getCurrentObject() ? getCurrentObject().singularTitle : ''
  )
  const [singularTitleErrors, setSingularTitleErrors] = useState([])

  const { notificationList, addNotification, onDismiss } = useNotification()

  const dispatch = useDispatch()

  const saveData = (event) => {
    const preparedFields = fieldsHelpers.prepareForSave({
      fields,
      acl,
      icon,
      name,
      title,
      singularTitle,
      id: getCurrentObject() ? getCurrentObject().id : null,
    })

    const isNotValid = SchemaFieldValidator.validate(preparedFields, schemas)

    setValidationErrors(isNotValid)

    if (isNotValid) {
      addNotification(
        {},
        {
          errorHeader: t('error.Pctve!'),
          error: true,
        }
      )
      return
    }

    let result
    if (!objectName) {
      result = dispatch(saveMethod(preparedFields))
    } else {
      result = dispatch(
        updateMethod({
          id: getCurrentObject().id,
          object: preparedFields,
        })
      )
    }

    addNotification(result, {
      successHeader: t('messages.DataSavedSuccessfully'),
    })
  }

  const resetState = () => {
    setName('')
    setIcon('')
    setTitle('')
    setSingularTitle('')
    setFields([])
    setAcl(null)
    setCurrentEditedSchemaOrField({})
  }

  useEffect(() => {
    setCurrentEditedSchemaOrField({ fields })
    return () => {
      setCurrentEditedSchemaOrField({})
    }
  }, [])

  useEffect(() => {
    if (objectName) {
      setName(getCurrentObject().name)
      setIcon(getCurrentObject().icon)
      setTitle(getCurrentObject().title)
      setSingularTitle(getCurrentObject().singularTitle)
      setFields(getCurrentObject().fields)
      setAcl(getCurrentObject().acl)
      setCurrentEditedSchemaOrField({ fields })
    } else {
      resetState()
    }
  }, [objectName, objects.length])

  const addFieldSettingsItem = (item) => {
    setFields((of) => [...of, fieldsHelpers.getField(item)])
  }

  const reorderFieldsSettingsListItems = (newList) => {
    setFields(newList)
    setCurrentEditedSchemaOrField({ fields: newList })
  }

  const setFieldData = (id, name, event, data) => {
    let fieldIndex = null
    const currentFields = fields
    const modifiedField = currentFields.find((i, index) => {
      fieldIndex = index
      return i.id === id
    })

    /**
     * Here we modify by reference and there is no issue here because we will use
     * the spread operator later
     */
    // eslint-disable-next-line
    let subField = modifiedField.fields.find((i) => i.name === name)

    subField = fieldsHelpers.setSchemaSubFieldValue(subField, event, data)

    const currentList = [...fields]

    // From fieldIndex remove one item
    currentList.splice(fieldIndex, 1)

    // Remove nothing and insert the draggableId
    currentList.splice(fieldIndex, 0, modifiedField)

    const tmp = [...currentList]

    setFields(tmp)
    setCurrentEditedSchemaOrField({ fields: tmp })
  }

  const setValidationErrors = (result) => {
    const newFields = fields.map((field) => {
      const isNotValid =
        result && result.fields
          ? result.fields.find((f) => f.id === field.id)
          : false
      if (isNotValid) {
        return { ...field, errors: isNotValid.errors }
      }
      delete field.errors
      return field
    })

    const _newFields = [...newFields]

    setFields(_newFields)

    if (result && result.nameErrors) {
      setNameErrors(result.nameErrors)
    } else {
      setNameErrors(undefined)
    }

    if (result && result.titleErrors) {
      setTitleErrors(result.titleErrors)
    } else {
      setTitleErrors(undefined)
    }

    if (result && result.singularTitleErrors) {
      setSingularTitleErrors(result.singularTitleErrors)
    } else {
      setSingularTitleErrors(undefined)
    }

    setCurrentEditedSchemaOrField({ fields: _newFields })
  }

  const removeItem = (id) => {
    const newList = fields.filter((i) => i.id !== id)
    setFields(newList)
    setCurrentEditedSchemaOrField({ fields: newList })
  }

  return {
    getCurrentObject,
    acl,
    icon,
    name,
    title,
    fields,
    setIcon,
    setAcl,
    setName,
    setTitle,
    setFields,
    nameErrors,
    setNameErrors,
    titleErrors,
    setTitleErrors,
    singularTitle,
    singularTitleErrors,
    setSingularTitle,
    setSingularTitleErrors,
    resetState,
    addFieldSettingsItem,
    reorderFieldsSettingsListItems,
    setFieldData,
    setValidationErrors,
    removeItem,
    notificationList,
    addNotification,
    onDismiss,
    saveData,
  }
}

export const useClickOutsideOrInside = (
  onClickOutside = null,
  onClickInside = null
) => {
  const ref = useRef(null)

  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      if (onClickOutside) {
        onClickOutside()
      }
    } else if (ref.current && ref.current.contains(event.target)) {
      if (onClickInside) {
        onClickInside()
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  })

  return { ref }
}
