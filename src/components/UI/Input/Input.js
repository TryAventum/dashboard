import React from 'react'
import classes from './Input.module.css'

const Input = React.forwardRef(
  (
    {
      label,
      title,
      id,
      error,
      help,
      value,
      onChange,
      onClick,
      disabled,
      type = 'text',
      required = false,
      className = '',
      placeholder,
      ...args
    },
    ref
  ) => {
    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium leading-5 text-gray-700"
          >
            {label}
            {required && <span className="text-red-700">*</span>}
          </label>
        )}
        <div className={`${label ? 'mt-1' : ''} relative`}>
          <input
            ref={ref}
            id={id}
            type={type}
            title={title}
            value={value}
            onChange={onChange}
            onClick={onClick}
            // required={required}
            disabled={disabled}
            className={`${
              error
                ? 'border-red-200 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red pr-10'
                : 'border-gray-200 text-gray-900 placeholder-gray-300 focus:border-gray-300 focus:shadow-outline-gray'
            } ${classes.Input} form-input block w-full sm:text-sm sm:leading-5`}
            placeholder={placeholder}
            aria-invalid="true"
            aria-describedby="email-error"
            {...args}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className={`${
                  error ? 'text-red-500' : 'text-gray-500'
                } h-5 w-5`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {help && (
          <p
            className={`${
              error ? 'text-red-600' : 'text-gray-600'
            } mt-2 text-sm`}
          >
            {help}
          </p>
        )}
      </div>
    )
    // return (
    //   <div className={className}>
    //     <label
    //       htmlFor={id}
    //       className="block text-sm font-medium leading-5 text-gray-700"
    //     >
    //       {label}
    //     </label>
    //     <div className="mt-1 rounded-md shadow-sm">
    //       <input
    //         id={id}
    //         type={type}
    //         required={required}
    //         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
    //       />
    //     </div>
    //   </div>
    // )
  }
)

export default Input
