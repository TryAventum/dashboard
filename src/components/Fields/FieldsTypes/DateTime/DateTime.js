import React from 'react'
import DatePicker from 'react-datepicker'
import { withTranslation } from 'react-i18next'
import aventum from '../../../../aventum'
import { format, parse, parseISO, formatISO } from 'date-fns'
import Input from '../../../UI/Input/Input'

const DateTime = (props) => {
  var dateTimeField = null
  switch (props.type) {
    case 'time':
      {
        const tmp = props.value
          ? aventum.db.type === 'mongodb'
            ? new Date(props.value)
            : parse(props.value, 'HH:mm:ss', new Date())
          : null

        dateTimeField = (
          <DatePicker
            selected={tmp}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={props.timeIntervals || 15}
            timeCaption={props.t('Time')}
            dateFormat={props.format || 'h:mm aa'}
            timeFormat={props.calendarFormat || 'p'}
            customInput={<Input className="mt-1" />}
            onChange={(date) => {
              if (date) {
                props.onChange(
                  aventum.db.type === 'mongodb'
                    ? date
                    : format(date, 'HH:mm:ss')
                )
              }
            }}
          />
        )
      }
      break
    case 'date':
      {
        const tmp1 = props.value
          ? aventum.db.type === 'mongodb'
            ? new Date(props.value)
            : parseISO(props.value)
          : null

        dateTimeField = (
          <DatePicker
            selected={tmp1}
            peekNextMonth
            dateFormatCalendar={props.calendarFormat || 'LLLL yyyy'}
            dateFormat={props.format || 'MMMM d, yyyy'}
            showMonthDropdown={props.showMonthDropdown}
            showYearDropdown={props.showYearDropdown}
            dropdownMode={props.dropdownMode}
            customInput={<Input className="mt-1" />}
            onChange={(date) => {
              if (date) {
                props.onChange(
                  aventum.db.type === 'mongodb' ? date : formatISO(date)
                )
              }
            }}
          />
        )
      }
      break
    default:
    case 'dateTime':
      {
        const tmp2 = props.value
          ? aventum.db.type === 'mongodb'
            ? new Date(props.value)
            : parseISO(props.value)
          : null

        dateTimeField = (
          <DatePicker
            selected={tmp2}
            showTimeSelect
            customInput={<Input className="mt-1" />}
            timeFormat={props.calendarTimeFormat || 'HH:mm'}
            dateFormatCalendar={props.calendarDateFormat || 'LLLL yyyy'}
            peekNextMonth
            showMonthDropdown={props.showMonthDropdown}
            showYearDropdown={props.showYearDropdown}
            dropdownMode={props.dropdownMode}
            timeIntervals={props.timeIntervals || 15}
            timeCaption={props.t('Time')}
            dateFormat={props.format || 'MMMM d, yyyy h:mm aa'}
            onChange={(date) => {
              if (date) {
                props.onChange(
                  aventum.db.type === 'mongodb' ? date : formatISO(date)
                )
              }
            }}
          />
        )
      }
      break
  }

  // const isError = !!props.errors

  const validationMessage = props.errors ? (
    <p className={'text-red-600 mt-2 text-sm'}>
      {props.errors.join(', ') + '!'}
    </p>
  ) : null

  return (
    <div className="flex flex-col">
      {props.label && (
        <label htmlFor={props.htmlID}>
          {props.label}{' '}
          {props.required && <span style={{ color: 'red' }}>*</span>}
        </label>
      )}
      {props.popup ? (
        <div>
          {dateTimeField}
          <p className={'text-gray-600 mt-2 text-sm'}>{props.popup}</p>
        </div>
      ) : (
        dateTimeField
      )}
      {validationMessage}
    </div>
  )
}

export default withTranslation()(DateTime)
