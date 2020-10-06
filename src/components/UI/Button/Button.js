import React from 'react'
import Loader from '../Loader/Loader'

const getSpanClasses = ({ color, size, loading, disabled }) => {
  const classes = 'block rounded-md shadow-sm'

  return classes
}

const getButtonClasses = ({ color, size, loading, disabled }) => {
  let classes =
    'w-full flex justify-center border border-transparent font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out'

  switch (color) {
    case 'red':
    default:
      if (disabled || loading) {
        classes +=
          ' focus:border-red-700 focus:shadow-outline-red active:bg-red-700 cursor-not-allowed bg-red-200'
      } else {
        classes +=
          ' focus:border-red-700 focus:shadow-outline-red active:bg-red-700 hover:bg-red-500 bg-red-600'
      }
      break

    case 'gray':
      if (disabled || loading) {
        classes +=
          ' focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 cursor-not-allowed bg-gray-200'
      } else {
        classes +=
          ' focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 hover:bg-gray-500 bg-gray-600'
      }
      break
  }

  switch (size) {
    case 'normal':
    default:
      classes += ' py-2 px-4 text-sm'
      break

    case 'small':
      classes += ' px-3 text-xs'
      break
  }

  return classes
}

const CustomLoader = ({ size }) => {
  if (size === 'small') {
    return (
      <span className="p-1">
        <Loader props={{ width: '12px' }} />
      </span>
    )
  } else {
    return <Loader className="w-6" />
  }
}

export default function Button({
  type,
  disabled,
  onClick,
  loading,
  label,
  children,
  color,
  id,
  size,
  className,
  style,
  dataTestid,
}) {
  const spanClasses = getSpanClasses({ color, size, loading, disabled })
  const buttonClasses = getButtonClasses({ color, size, loading, disabled })

  return (
    <span className={spanClasses + ' ' + className} style={style}>
      <button
        data-testid={dataTestid}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={buttonClasses}
        data-testid-button-id={id}
      >
        {loading ? <CustomLoader size={size} /> : label || children}
      </button>
    </span>
  )
}
