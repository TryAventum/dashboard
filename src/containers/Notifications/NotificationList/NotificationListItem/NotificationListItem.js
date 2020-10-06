import React from 'react'
import { FaCheckCircle, FaCircle } from 'react-icons/fa'
import Loader from '../../../../components/UI/Loader/Loader'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formatDistance } from 'date-fns'
import currentLocale from '../../../../date-fns'

import * as actions from '../../../../store/actions/index'

export function NotificationListItem ({
  changeNotificationStatus,
  loading,
  header,
  content,
  createdAt,
  id,
  status
}) {
  const { t, i18n } = useTranslation()

  const changeStatus = (event) => {
    changeNotificationStatus({
      id: id,
      status: status === 'read' ? 'unread' : 'read'
    })
  }

  const Icon = status === 'read' ? FaCircle : FaCheckCircle

  const createdFrom = currentLocale ? formatDistance(new Date(createdAt), new Date(), {
    locale: currentLocale.locale
  }) : formatDistance(new Date(createdAt), new Date())

  return (
    <div className="flex items-center px-2 mb-5">
      <div className={`${i18n.dir() === 'ltr' ? 'pr-5' : 'pl-5'} text-2xl`}>
        {loading !== id ? (
          <Icon
            className="cursor-pointer text-cool-gray-400 hover:text-indigo-400"
            onClick={changeStatus}
            title={
              status === 'read'
                ? t('mark', { context: 'unread' })
                : t('mark', { context: 'read' })
            }
          />
        ) : (
          <Loader className="w-6 text-cool-gray-400" />
        )}
      </div>
      <div>
        <div className="text-cool-gray-400">
          {createdFrom}
        </div>
        <div className="text-cool-gray-700 font-bold py-1">{header}</div>
        <div>{content}</div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.notification.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeNotificationStatus: (payload) =>
      dispatch(actions.changeNotificationStatus(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationListItem)
