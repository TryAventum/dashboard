import React, { useState } from 'react'
import { v1 } from 'uuid'

export default function Checkbox({
  id: propsId,
  label,
  help,
  checked,
  onChange,
  className,
}) {
  const [id, setId] = useState(() => propsId || v1())

  return (
    <div
      className={`relative flex items-start ${className}`}
      data-testid-type="checkbox"
    >
      <div className="absolute flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            onChange(e, { checked: e.target.checked }) // TODO we do it like this for backward compatibility, we were using Semantic UI React Checkbox before
          }}
          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
        />
      </div>
      <div className="ltr:pl-7 rtl:pr-7 text-sm leading-5">
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-5 text-gray-700"
        >
          {label}
        </label>
        {help && <p className="text-gray-500">{help}</p>}
      </div>
    </div>
  )
}
