import React from 'react'
import { useSelector } from 'react-redux'

export default function FieldWrapper (props) {
  let errors = useSelector((state) =>
    state.form.errors ? state.form.errors[props.id] : null
  )

  errors = errors ? (
    <span className="text-red-500 inline-block mt-2 capitalize">
      {errors.join(', ') + '!'}
    </span>
  ) : null

  return (
    <div
      className={`${
        errors ? 'border-red-400' : ''
      } border border-solid p-4 mb-4 shadow-sm rounded-md bg-white`}
      data-testid-name={props.name}
    >
      {props.children}
      {errors}
    </div>
  )
}
