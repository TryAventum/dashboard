import React, { useState, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useTranslation } from 'react-i18next'
import {
  stringClassesToArray,
  removeClasses,
  addClasses,
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

export default function Undo({ time = 3000, onUndo, undoList, onDismiss }) {
  const { t } = useTranslation()

  const [stateUndoList, setStateUndoList] = useState([])

  useEffect(() => {
    setStateUndoList(undoList)
  }, [undoList])

  return (
    <TransitionGroup>
      {stateUndoList.map((item, index) => {
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
              className="z-10 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto fixed rtl:left-3 ltr:right-3 ltr:text-left rtl:text-right"
              style={{ top: `${(index + 1) * 4 + 0.5}rem` }}
            >
              <div className="rounded-lg shadow-xs overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center">
                    <div className="w-0 flex-1 flex justify-between">
                      <p className="w-0 flex-1 text-sm leading-5 font-medium text-gray-900">
                        {t('Deleted!')}
                      </p>
                      <button
                        onClick={() => onUndo(item)}
                        className="ltr:ml-3 rtl:mr-3 flex-shrink-0 text-sm leading-5 font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                      >
                        {t('Undo')}
                      </button>
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
