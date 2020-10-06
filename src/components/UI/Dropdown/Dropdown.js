import React, { useState, useRef, useEffect } from 'react'
import isEqual from 'lodash/isEqual'
import {
  usePrevious,
  useClickOutsideOrInside,
} from '../../../shared/react-hooks'

export default function Dropdown({
  label,
  placeholder,
  search,
  inline,
  clearable,
  options,
  value,
  onChange,
  className,
  multiple,
}) {
  const [open, setOpen] = useState(false)
  const { ref } = useClickOutsideOrInside(() => setOpen(false))

  const [selected, setSelected] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const oldSelected = usePrevious(selected)
  const oldValue = usePrevious(value)

  const onSelect = (opt) => {
    setSelected((_sel) => {
      const newSel = _sel.find((u) => u.value === opt.value)
        ? _sel.filter((i) => i.value !== opt.value)
        : multiple
        ? [..._sel, opt]
        : [opt]
      return newSel
    })

    if (!multiple) {
      setOpen(false)
    }
  }

  useEffect(() => {
    if (selected.length && !isEqual(selected, oldSelected)) {
      // Emit the values only
      if (multiple) {
        // TODO we do it like this for backward compatibility, we were using Semantic UI React Dropdown before
        onChange({}, { value: selected.map((i) => i.value) })
      } else {
        onChange({}, { value: selected[0].value })
      }
    }
  }, [multiple, oldSelected, onChange, selected])

  useEffect(() => {
    if (!isEqual(value, oldValue)) {
      if (multiple) {
        setSelected(options.filter((op) => value.includes(op.value)))
      } else {
        const sel = options.find((op) => value === op.value)
        setSelected(sel ? [sel] : [])
      }
    }
  }, [multiple, oldValue, options, value])

  let filteredOptions
  if (searchTerm) {
    filteredOptions = options.filter((op) => {
      return op.label.includes(searchTerm)
    })
  } else {
    filteredOptions = options
  }

  return (
    <div
      ref={ref}
      data-testid-dropdown-label={label}
      data-testid-dropdown-placeholder={placeholder}
      className={`flex flex-col items-center dropdown ${className}`}
    >
      <div className="w-full">
        <div className="flex flex-col items-center relative">
          <div className="w-full">
            <div
              tabIndex={0}
              onKeyPress={(e) => (e.which === 13 ? setOpen((oo) => !oo) : null)}
              className={`${inline ? 'justify-center' : 'border'} ${
                open ? 'outline-none border-gray-300 shadow-outline-gray' : ''
              } p-1 flex border-gray-200 bg-white rounded focus:outline-none focus:border-gray-300 focus:shadow-outline-gray`}
            >
              <div
                className={`${
                  inline ? '' : 'flex-auto'
                } flex flex-wrap break-all`}
              >
                {selected.map((s) => {
                  return (
                    <div
                      key={s.value}
                      className={`${
                        inline || !multiple
                          ? 'text-gray-900 '
                          : 'bg-red-100 border text-red-700'
                      } flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full border-red-300`}
                    >
                      <div
                        className={`${
                          inline || !multiple ? '' : 'text-xs'
                        } font-normal leading-none max-w-full flex-initial`}
                      >
                        {s.label}
                      </div>
                      {clearable && (
                        <div className="flex flex-auto flex-row-reverse">
                          <div>
                            <svg
                              onClick={(e) =>
                                setSelected((_sel) => {
                                  const newSel = _sel.filter(
                                    (p) => p.value !== s.value
                                  )
                                  return newSel
                                })
                              }
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              height="100%"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-4 h-4 ltr:ml-2 rtl:mr-2"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {search ? (
                  <div className="flex-1">
                    <input
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setOpen(true)
                      }}
                      onClick={() => setOpen(true)}
                      placeholder={!selected.length ? placeholder : ''}
                      className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                    />
                  </div>
                ) : !selected.length ? (
                  <span className="flex items-center text-gray-400">
                    {placeholder}
                  </span>
                ) : (
                  ''
                )}
              </div>
              <div
                className={`${
                  inline ? '' : 'ltr:border-l rtl:border-r'
                } text-gray-300 w-8 py-1 ltr:pl-2 rtl:pr-2 ltr:pr-1 rtl:pl-1 flex items-center border-gray-200`}
              >
                <button
                  onClick={() => setOpen((_open) => !_open)}
                  className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                >
                  {open ? (
                    <svg
                      version="1.1"
                      className="fill-current h-4 w-4"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M17.418,6.109c0.272-0.268,0.709-0.268,0.979,0s0.271,0.701,0,0.969l-7.908,7.83
	c-0.27,0.268-0.707,0.268-0.979,0l-7.908-7.83c-0.27-0.268-0.27-0.701,0-0.969c0.271-0.268,0.709-0.268,0.979,0L10,13.25
	L17.418,6.109z"
                      />
                    </svg>
                  ) : (
                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                      <path
                        d="M2.582,13.891c-0.272,0.268-0.709,0.268-0.979,0s-0.271-0.701,0-0.969l7.908-7.83
	c0.27-0.268,0.707-0.268,0.979,0l7.908,7.83c0.27,0.268,0.27,0.701,0,0.969c-0.271,0.268-0.709,0.268-0.978,0L10,6.75L2.582,13.891z
	"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          {open && (
            <div className="absolute shadow top-full bg-white z-40 w-full ltr:left-0 rtl:right-0 rounded max-h-60 overflow-y-auto">
              <div className="flex flex-col w-full options ltr:text-left rtl:text-right">
                {filteredOptions.map((opt) => {
                  const isSelected = selected.find((k) => k.value === opt.value)
                  return (
                    <div
                      key={opt.value}
                      tabIndex={0}
                      onKeyPress={(e) =>
                        e.which === 13 ? onSelect(opt) : null
                      }
                      onClick={(e) => onSelect(opt)}
                      className={`${
                        isSelected ? 'selected' : ''
                      } cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-red-100  focus:bg-red-100 focus:outline-none`}
                    >
                      <div
                        className={`${
                          isSelected ? 'border-red-600' : 'hover:border-red-100'
                        } flex w-full items-center p-2 ltr:pl-2 rtl:pr-2 border-transparent ltr:border-l-2 rtl:border-r-2 relative`}
                      >
                        <div className="w-full items-center flex">
                          <div className="mx-2 leading-6  option-label">
                            {opt.label}{' '}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
