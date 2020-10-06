import React from 'react'

export default function TextareaField (props) {
  const field = (
    <textarea
      id={props.id}
      className="form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 focus:border-gray-300 focus:shadow-outline-gray mt-1"
      rows="7"
      placeholder={props.placeholder}
      defaultValue={props.value}
      onChange={(e) => {
        props.onChange(e.target.value)
      }}
    />
  )

  const validationMessage = props.errors ? (
    <p className={'text-red-600 mt-2 text-sm'}>
      {props.errors.join(', ') + '!'}
    </p>
  ) : null

  // const error = !!props.errors

  return (
    <div>
      {props.label && (
        <label htmlFor={props.id}>
          {props.label}{' '}
          {props.required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}
      {props.popup ? (
        <div>
          {field}
          <p className={'text-gray-600 mt-2 text-sm'}>{props.popup}</p>
        </div>
      ) : (
        field
      )}
      {validationMessage}
    </div>
  )
}
