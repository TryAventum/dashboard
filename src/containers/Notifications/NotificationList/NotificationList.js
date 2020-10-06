import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions/index'
import NotificationListItem from './NotificationListItem/NotificationListItem'
import { useTranslation } from 'react-i18next'

export function NotificationList ({
  getNotifications,
  pagination,
  loading,
  notifications
}) {
  const { t } = useTranslation()
  const [activePage, setActivePage] = useState(1)
  const listWrapper = useRef()

  useEffect(() => {
    getNotifications({ page: activePage })
  }, [])

  const loadMore = (event) => {
    event.persist()
    const newPage = activePage + 1
    const totalPages = pagination.totalPages ? pagination.totalPages : null

    if (loading || (totalPages && newPage > totalPages)) {
      return
    }

    var scrollAmount = event.target.scrollTop
    var documentHeight = event.target.scrollHeight
    var windowHeight = listWrapper.current.clientHeight

    if (scrollAmount / (documentHeight - windowHeight) > 0.95) {
      setActivePage(newPage)
      getNotifications({ page: newPage })
    }
  }

  return (
    <div
      ref={listWrapper}
      className="overflow-auto max-h-80 bg-white rounded-md py-4"
      onScroll={loadMore}
    >
      <div>
        {notifications && notifications.length ? (
          notifications.map((n) => {
            return <NotificationListItem key={n.id} {...n} />
          })
        ) : (
          <div className="text-cool-gray-600 text-center">{t('Nonosf!')}</div>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.notification.loading,
    notifications: state.notification.notifications,
    pagination: state.notification.pagination
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getNotifications: (payload) => dispatch(actions.getNotifications(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList)
