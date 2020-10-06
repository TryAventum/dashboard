import React, { useEffect, useState } from 'react'
import { useDispatch, connect } from 'react-redux'
import Panel from '../../components/UI/Panel/Panel'

import { useTranslation } from 'react-i18next'
import Notification from '../../components/UI/Notification/Notification'
// import aventum from '../../aventum'
import * as actions from '../../store/actions/index'
import RenderNormalFields from '../../components/Fields/RenderFields/RenderNormalFieldsV2/RenderNormalFields'
import SaveButtons from '../../components/UI/SaveButtons/SaveButtons'
import { useNotification } from '../../shared/react-hooks'

function OptionsLayout({
  sections,
  options,
  loading,
  loadingActions,
  showSaveButtons,
  getOptions,
  ...props
}) {
  const { t } = useTranslation()

  const { notificationList, addNotification, onDismiss } = useNotification()

  const dispatch = useDispatch()

  const [fields, setFields] = useState(() =>
    sections.reduce(
      (accumulator, currentValue) => [...accumulator, ...currentValue.fields],
      []
    )
  )

  const updateOptions = (event) => {
    const options = [...fields].map((e) => {
      // let option = options.find(i => i.name === e.name)

      return {
        name: e.name,
        value: e.value,
        id: e.id,
      }
    })

    const result = dispatch(actions.updateOptions({ options }))

    addNotification(result, {
      successHeader: t('messages.DataSavedSuccessfully'),
    })
  }

  const handleChange = (
    value,
    fieldType,
    name,
    propsIndex,
    index,
    repeatable,
    event,
    data
  ) => {
    const _fields = [...fields].map((e) => {
      if (e.name === name) {
        e.value = value
      }

      return e
    })

    setFields(_fields)
  }

  const handleClick = (payload, name, propsIndex, index, repeatable) => (
    event,
    data
  ) => {
    if (loadingActions[name]) {
      return
    }

    const proo = dispatch(
      actions.callEndPoint({
        actionName: name,
        method: payload.method,
        payload: payload.payload,
        url: payload.url,
      })
    )

    addNotification(proo, {
      successHeader: payload.successMessageHeader,
    })
  }

  useEffect(() => {
    const setUpFields = () => {
      if (options.length) {
        const _fields = [...fields].map((e) => {
          const option = options.find((i) => i.name === e.name)
          if (option) {
            e.value = option.value
            e.id = option.id
          }

          return e
        })

        setFields(_fields)
      }
    }

    if (!options.length && !loading) {
      getOptions()
    }
    setUpFields()
  }, [fields.length, loading, options, options.length, t])

  sections = sections.map((s) => {
    const sectionFieldsNames = s.fields.map((f) => f.name)

    return (
      <div style={{ marginBottom: '1rem' }} key={s.key}>
        <Panel>
          {s.label && <Panel.Header>{s.label}</Panel.Header>}
          <Panel.Content>
            <RenderNormalFields
              {...props}
              fields={fields.filter((f) => sectionFieldsNames.includes(f.name))}
              handleChange={handleChange}
              handleClick={handleClick}
              index={0}
            />
          </Panel.Content>
        </Panel>
        <Notification
          notifyList={notificationList}
          onDismiss={onDismiss}
          placement="bottom"
        />
      </div>
    )
  })

  return (
    <div>
      <div className="flex">
        <div className="w-4/5">{sections}</div>
        {showSaveButtons && (
          <div className="w-1/5 ltr:pl-6 rtl:pr-6">
            <SaveButtons onSave={updateOptions} loading={loading} onlySaveBtn />
          </div>
        )}
      </div>
      <Notification
        notifyList={notificationList}
        onDismiss={onDismiss}
        placement="bottom"
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    loadingActions: state.option.loadingActions,
    currentOptionValues: state.option.currentOptionValues,
    options: state.option.options,
    loading: state.option.loadingOptions,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getOptions: () => dispatch(actions.getOptions()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionsLayout)
