import React from 'react'

const getType = (success, error, warning, info) => {
  if (success) {
    return 'success'
  }
  if (error) {
    return 'error'
  }
  if (warning) {
    return 'warning'
  }
  if (info) {
    return 'info'
  }
}

const wrapperClass = (type) => {
  switch (type) {
    case 'error':
      return 'bg-red-50'

    case 'success':
      return 'bg-green-50'

    case 'warning':
      return 'bg-yellow-50'

    case 'info':
    default:
      return 'bg-blue-50'
  }
}

const headerClass = (type) => {
  switch (type) {
    case 'error':
      return 'text-red-800'

    case 'success':
      return 'text-green-800'

    case 'warning':
      return 'text-yellow-800'

    case 'info':
    default:
      return 'text-blue-800'
  }
}

const contentClass = (type) => {
  switch (type) {
    case 'error':
      return 'text-red-700'

    case 'success':
      return 'text-green-700'

    case 'warning':
      return 'text-yellow-700'

    case 'info':
    default:
      return 'text-blue-700'
  }
}

export default function Message ({
  error,
  success,
  warning,
  info,
  header,
  content
}) {
  if (!content && !header) {
    return null
  }

  const type = getType(success, error, warning, info)

  return (
    <div className={`rounded-md p-4 ${wrapperClass(type)}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {error && (
            <svg
              className={'h-5 w-5 text-red-400'}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {success && (
            <svg
              className="h-5 w-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {warning && (
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
          )}
          {info && (
            <svg
              className="h-5 w-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="ml-3">
          {header && (
            <h3
              className={`text-sm leading-5 font-medium ${headerClass(type)} msg`}
            >
              {header}
            </h3>
          )}
          {content && (
            <div className={`${contentClass(type)} mt-2 text-sm leading-5`}>
              <p>{content}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
