import React, { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaUserCircle, FaBell } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import * as actions from '../../store/actions/index'
import aventum from '../../aventum'
import NotificationList from '../Notifications/NotificationList/NotificationList'
import Loader from '../../components/UI/Loader/Loader'
import DynamicContentList from '../../components/DynamicContentList/DynamicContentList'

const ConfirmYourEmailMessage = ({
  sent,
  resendConfEmail,
  loading,
  sentError,
  className,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={`${className} bg-yellow-50 ltr:border-l-4 rtl:border-r-4 border-yellow-400 p-4`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ltr:ml-3 rtl:mr-3">
          <p className="text-sm leading-5 text-yellow-700">
            {t('conf', { context: 'notConfirmed' })}{' '}
            <span
              onClick={!sentError && !sent ? resendConfEmail : () => null}
              className={`${
                sent || sentError ? 'cursor-auto' : 'cursor-pointer'
              } font-medium underline text-yellow-700 hover:text-yellow-600 transition ease-in-out duration-150`}
            >
              {!sent && !sentError && t('ResendConfirmationEmail')}
              {sent && t('CheckYouInbox')}
              {sentError && t('error.unspecific').toLowerCase()}
            </span>
            {loading && (
              <span className="px-0.5">
                <Loader props={{ width: '12px' }} className="inline-block" />
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

const Stats = ({ activeDashboardExtensions, allUsersCount, schemas }) => {
  const { t } = useTranslation()

  return (
    <div className="bg-cool-gray-50 pt-12 sm:pt-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl leading-9 font-extrabold text-cool-gray-700 sm:text-4xl sm:leading-10">
            {t('Coolfactsaboutyourawesomeapp')}
          </h2>
        </div>
      </div>
      <div className="mt-10 pb-12 bg-white sm:pb-16">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-cool-gray-50"></div>
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                <div className="flex flex-col border-b border-cool-gray-100 p-6 text-center sm:border-0 sm:ltr:border-r sm:rtl:border-l">
                  <dt
                    className="order-2 mt-2 text-lg leading-6 font-medium text-cool-gray-500"
                    id="item-1"
                  >
                    {t('Schemas')}
                  </dt>
                  <dd
                    className="order-1 text-5xl leading-none font-extrabold text-indigo-600"
                    aria-describedby="item-1"
                  >
                    {schemas.length ? schemas.length : 0}
                  </dd>
                </div>
                <div className="flex flex-col border-t border-b border-cool-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-cool-gray-500">
                    {t('Users')}
                  </dt>
                  <dd className="order-1 text-5xl leading-none font-extrabold text-indigo-600">
                    {allUsersCount}
                  </dd>
                </div>
                <div className="flex flex-col border-t border-cool-gray-100 p-6 text-center sm:border-0 sm:ltr:border-l sm:rtl:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-cool-gray-500">
                    {t('ActiveExtensions')}
                  </dt>
                  <dd className="order-1 text-5xl leading-none font-extrabold text-indigo-600">
                    {activeDashboardExtensions.length
                      ? activeDashboardExtensions.length
                      : 0}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Contents = () => {
  const schemas = useSelector((state) => state.schema.schemas)
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap">
      {schemas.length
        ? schemas.map((schema) => (
            <div key={schema.id} className="my-6 w-1/2 px-3">
              <h2 className="text-base leading-9 font-extrabold text-cool-gray-600">
                {t('Recent$Content', {
                  content: t(schema.title),
                })}
              </h2>
              <DynamicContentList
                filter={false}
                content={schema.name}
                perPage={5}
              />
            </div>
          ))
        : null}
    </div>
  )
}

export function Dashboard({
  resendConfirmationEmail,
  activeDashboardExtensions,
  getAllUsersCount,
  allUsersCount,
  currentUser,
  schemas,
  fields,
}) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [sentError, setSentError] = useState(false)

  const resendConfEmail = () => {
    if (sent || loading) {
      return
    }

    setLoading(true)
    resendConfirmationEmail()
  }

  useEffect(() => {
    const resendConfirmationEmailSubscription = (response) => {
      setLoading(false)
      if (response.status === 200) {
        setSent(true)
        setSentError(false)
      } else {
        setSent(false)
        setSentError(true)
      }
    }

    aventum.hooks.addAction(
      'resendConfirmationEmail',
      'Aventum/core/Dashboard/DidMount',
      resendConfirmationEmailSubscription
    )

    getAllUsersCount()
    return () => {
      aventum.hooks.removeAction(
        'resendConfirmationEmail',
        'Aventum/core/Dashboard/DidMount'
      )
    }
  }, [])

  return (
    <div className="p-4">
      <div className={'flex py-10'}>
        <div className="w-2/3 px-10">
          <h2 className="flex flex-col items-center text-3xl leading-9 font-extrabold text-cool-gray-700 sm:text-4xl sm:leading-10">
            <FaUserCircle />
            <span className="py-4">{t('HiThere')}</span>
          </h2>
          <div className="justify-center flex">
            <div>
              {currentUser
                ? currentUser.firstName + ' ' + currentUser.lastName
                : ''}
            </div>
            {', '}
            <div className="flex items-center">
              {currentUser && currentUser.emailConfirmation && (
                <FaCheckCircle
                  className="text-green-400"
                  title={t('conf', { context: 'confirmed' })}
                />
              )}
              {currentUser ? currentUser.email : ''}
            </div>
            {', '}
            <Link className="underline lowercase" to="/users/profile">
              {t('YourProfile')}
            </Link>
          </div>
          <ConfirmYourEmailMessage
            sent={sent}
            sentError={sentError}
            resendConfEmail={resendConfEmail}
            loading={loading}
            className="my-4"
          />
        </div>
        <div className="px-6 w-1/3">
          <h2 className="flex flex-col items-center text-3xl leading-9 font-extrabold text-cool-gray-700 sm:text-4xl sm:leading-10">
            <FaBell />
            <span className="py-4">{t('Notifications')}</span>
          </h2>
          <NotificationList />
        </div>
      </div>
      <Stats
        activeDashboardExtensions={activeDashboardExtensions}
        schemas={schemas}
        allUsersCount={allUsersCount}
      />
      <Contents />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    fields: state.field.fields,
    schemas: state.schema.schemas,
    allUsersCount: state.user.allUsersCount,
    activeDashboardExtensions: state.extension.activeDashboardExtensions,
    currentUser: state.auth.currentUser,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUsersCount: () => dispatch(actions.getAllUsersCount()),
    resendConfirmationEmail: () => dispatch(actions.resendConfirmationEmail()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
