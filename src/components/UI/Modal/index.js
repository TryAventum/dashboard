import React, { useState, useEffect, createContext, useContext } from 'react'
import { usePrevious } from '../../../shared/react-hooks'
import Transition from '../../../shared/Transition'

const ModalContext = createContext()
const { Provider } = ModalContext

const Content = ({ children }) => {
  return (
    <div
      className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ltr:text-left rtl:text-right overflow-auto modal-content"
      style={{ maxHeight: '70vh' }}
    >
      {children}
    </div>
  )
}

const Actions = ({ children }) => {
  return (
    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse modal-actions">
      {children}
    </div>
  )
}

const Header = ({ children, headingTitle, icon }) => {
  const { setIsOpen } = useContext(ModalContext)
  return (
    <div className="px-4 py-3 flex justify-between items-center bg-gray-50">
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          {icon}
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ltr:ml-4 sm:rtl:mr-4 sm:ltr:text-left sm:rtl:text-right">
          {headingTitle && (
            <h3
              className="text-lg leading-6 font-medium text-gray-900"
              id="modal-headline"
            >
              {headingTitle}
            </h3>
          )}
          <div className="mt-2">
            <p className="text-sm leading-5 text-gray-500">{children}</p>
          </div>
        </div>
      </div>
      <div className="hidden sm:block">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(false)
          }}
          type="button"
          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
          aria-label="Close"
        >
          <svg
            className="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

function Modal({ open = false, trigger, onClose, children }) {
  const prevOpen = usePrevious(open)
  const [isOpen, setIsOpen] = useState(false)
  const [addZIndex, setAddZIndex] = useState(false)
  const prevIsOpen = usePrevious(isOpen)

  useEffect(() => {
    if (prevIsOpen && !isOpen) {
      setTimeout(() => {
        setAddZIndex(isOpen)
      }, 200)
    } else {
      setAddZIndex(isOpen)
    }
  }, [isOpen, prevIsOpen])

  useEffect(() => {
    if ((prevOpen && !open) || (prevIsOpen && !isOpen)) {
      onClose()
    }
  }, [open, isOpen])

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  return (
    <>
      {trigger}
      <div
        className={`${
          addZIndex ? 'z-10' : '-z-10'
        } fixed bottom-0 inset-x-0 px-8 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center`}
      >
        {/* Background overlay, show/hide based on modal state. */}
        <Transition
          show={isOpen}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity">
            <div
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              className="absolute inset-0 bg-gray-500 opacity-75"
            ></div>
          </div>
        </Transition>

        {/* Modal panel, show/hide based on modal state. */}
        <Transition
          show={isOpen}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-6xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <Provider value={{ setIsOpen }}>{children}</Provider>
          </div>
        </Transition>
      </div>
    </>
  )
}

Modal.Actions = Actions
Modal.Content = Content
Modal.Header = Header

export default Modal
