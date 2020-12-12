import React, { useEffect, useState } from 'react'
import Panel from '../../components/UI/Panel/Panel'
import { connect, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
// import aventum from '../../aventum'
import * as actions from '../../store/actions/index'
import RenderNormalField from '../../components/Fields/RenderFields/RenderNormalFieldsV2/RenderNormalField/RenderNormalField'
import SaveButtons from '../../components/UI/SaveButtons/SaveButtons'
import Notification from '../../components/UI/Notification/Notification'
import { useNotification, usePrevious } from '../../shared/react-hooks'

const TranslationsTranslation = ({
  getAllTranslations,
  translations,
  history,
  location,
  match,
  saving,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { notificationList, addNotification, onDismiss } = useNotification()
  const prevTranslations = usePrevious(translations)
  const [touched, setTouched] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    getAllTranslations()
  }, [])

  useEffect(() => {
    if (
      (prevTranslations &&
        translations &&
        prevTranslations.length !== translations.length) ||
      (!touched && translations.length)
    ) {
      setData(translations.sort((a, b) => a.order - b.order))
      setTouched(true)
    }
  }, [prevTranslations, touched, translations])

  const handleChange = (newData) => {
    setData(newData)
  }

  const updateTranslations = () => {
    const translations = data.map((t, index) => {
      t.order = index
      return t
    })

    const result = dispatch(actions.updateTranslations({ translations }))

    addNotification(result, {
      successHeader: t('messages.DataSavedSuccessfully'),
    })
  }

  return (
    <div className="flex">
      <div className="w-4/5">
        <Panel>
          <Panel.Content>
            <RenderNormalField
              match={match}
              location={location}
              history={history}
              handleChange={handleChange}
              value={data}
              columns={[
                {
                  Header: t('Key'),
                  accessor: 'key',
                  canFilter: true,
                  canSort: true,
                },
                {
                  Header: t('English'),
                  accessor: 'en',
                  canFilter: true,
                  canSort: true,
                },
                {
                  Header: t('Arabic'),
                  accessor: 'ar',
                  canFilter: true,
                  canSort: true,
                },
              ]}
              type="dynamictable"
              id="dynamictable"
              label={t('DynamicTable')}
              placeholder={t('DynamicTable')}
              name="DynamicTable"
              required={true}
            />
          </Panel.Content>
        </Panel>
      </div>
      <div className="w-1/5 ltr:pl-6 rtl:pr-6">
        <SaveButtons onSave={updateTranslations} loading={saving} onlySaveBtn />
      </div>
      <Notification notifyList={notificationList} onDismiss={onDismiss} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.translation.loading,
    translations: state.translation.translations,
    saving: state.shared.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllTranslations: () => dispatch(actions.getAllTranslations()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslationsTranslation)
