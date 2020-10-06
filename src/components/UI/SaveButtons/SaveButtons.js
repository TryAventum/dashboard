import React from 'react'
import { useTranslation } from 'react-i18next'

const SaveButtons = React.memo((props) => {
  const { t } = useTranslation()

  return (
    <span
      className="sticky inline-flex rounded-md shadow-sm w-full z-0"
      style={{ top: '4rem' }}
    >
      {props.onlySaveBtn ? (
        <button
          onClick={props.onSave}
          type="button"
          data-testid-button-id="save"
          className="active:bg-gray-100 active:text-green-700 bg-white border border-green-300 duration-150 ease-in-out focus:border-blue-300 focus:outline-none focus:shadow-outline-blue focus:z-10 font-medium hover:text-green-500 inline-flex items-center justify-center leading-5 px-4 py-2 relative rounded-md text-green-700 text-sm transition w-full"
        >
          {t('Save')}
        </button>
      ) : (
        <span className="w-full">
          <button
            onClick={props.onSave}
            data-testid-button-id="save"
            type="button"
            className="active:bg-gray-100 active:text-green-700 bg-white border border-green-300 duration-150 ease-in-out focus:border-blue-300 focus:outline-none focus:shadow-outline-blue focus:z-10 font-medium hover:text-green-500 inline-flex items-center justify-center leading-5 px-4 py-2 relative ltr:rounded-l-md rtl:rounded-r-md text-green-700 text-sm transition w-1/2"
          >
            {t('Save')}
          </button>
          <button
            type="button"
            className="ltr:-ml-px rtl:-mr-px active:bg-gray-100 active:text-gray-700 bg-white border border-gray-300 duration-150 ease-in-out focus:border-blue-300 focus:outline-none focus:shadow-outline-blue focus:z-10 font-medium hover:text-gray-500 inline-flex items-center justify-center leading-5 px-4 py-2 relative ltr:rounded-r-md rtl:rounded-l-md text-gray-700 text-sm transition w-1/2"
            onClick={props.onCancel}
          >
            {t('Cancel')}
          </button>
        </span>
      )}
    </span>
  )
})
export default SaveButtons
