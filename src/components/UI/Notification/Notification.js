import React, { useState, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import Loader from '../Loader/Loader'
import {
  stringClassesToArray,
  removeClasses,
  addClasses
} from '../../../shared/utility'

const enter = 'transform ease-out duration-300 transition'
const enterFrom = 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
const enterTo = 'translate-y-0 opacity-100 sm:translate-x-0'
const leave = 'transition ease-in duration-100'
const leaveFrom = 'opacity-100'
const leaveTo = 'opacity-0'

const enterClasses = stringClassesToArray(enter)
const enterFromClasses = stringClassesToArray(enterFrom)
const enterToClasses = stringClassesToArray(enterTo)
const leaveClasses = stringClassesToArray(leave)
const leaveFromClasses = stringClassesToArray(leaveFrom)
const leaveToClasses = stringClassesToArray(leaveTo)

export default function Notification ({
  time = 3000,
  onNotify,
  notifyList,
  placement = 'top',
  onDismiss
}) {
  const { t } = useTranslation()

  const [stateNotificationList, setStateNotificationList] = useState([])

  useEffect(() => {
    setStateNotificationList(notifyList)
  }, [notifyList])

  return (
    <TransitionGroup>
      {stateNotificationList.map((item, index) => {
        return (
          <CSSTransition
            key={item.id}
            timeout={1000}
            onEnter={(node) => {
              addClasses(node, [...enterClasses, ...enterFromClasses])
            }}
            onEntering={(node) => {
              removeClasses(node, enterFromClasses)
              addClasses(node, enterToClasses)
            }}
            onEntered={(node) => {
              removeClasses(node, [...enterToClasses, ...enterClasses])
            }}
            onExit={(node) => {
              addClasses(node, [...leaveClasses, ...leaveFromClasses])
            }}
            onExiting={(node) => {
              removeClasses(node, leaveFromClasses)
              addClasses(node, leaveToClasses)
            }}
            onExited={(node) => {
              removeClasses(node, [...leaveToClasses, ...leaveClasses])
            }}
          >
            <div
              className="fixed ltr:right-3 rtl:left-3 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto"
              style={{ [placement]: `${(index + 1) * 5.5}rem` }}
            >
              <div className="rounded-lg shadow-xs overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {item.error && (
                        <svg
                          fill="currentColor"
                          className="h-6 w-6 text-red-400"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                      )}

                      {item.success && (
                        <svg
                          className="h-6 w-6 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      {item.loading && <Loader className="w-6 text-gray-400" />}
                    </div>
                    <div className="ltr:ml-3 rtl:mr-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm leading-5 font-medium text-gray-900 notification-header-msg">
                        {item.success ? item.successHeader || t('Success') : ''}
                        {item.error
                          ? item.errorHeader || t('error.unspecific')
                          : ''}
                        {item.loading ? t('Processing...') : ''}
                      </p>
                      {((item.success && item.successContent) ||
                        (item.error && item.errorContent)) && (
                        <p className="mt-1 text-sm leading-5 text-gray-500">
                          {item.success ? item.successContent : ''}
                          {item.error ? item.errorContent : ''}
                        </p>
                      )}
                    </div>
                    <div className="ltr:ml-4 rtl:mr-4 flex-shrink-0 flex">
                      <button
                        onClick={() => onDismiss(item)}
                        className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                      >
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CSSTransition>
        )
      })}
    </TransitionGroup>
  )
}
