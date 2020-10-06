import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/UI/Button/Button'
import { FaPlus, FaMinus, FaBars } from 'react-icons/fa'

function RepeatableControls (props) {
  const { t } = useTranslation()
  const args = props.args ? props.args : [props.index]

  return (
    <div className="flex items-center justify-center py-5">
      <div className={`w-4/5 ${props.childrenWrapperClass}`}>
        {props.children}
      </div>
      <div className="flex justify-center items-center w-1/5">
        <div className="flex justify-center items-center">
          <span
            className="text-green-400 cursor-pointer mx-3 plus"
            onClick={(event) => props.plusClicked(...args)}
          >
            <FaPlus />
          </span>
          <span
            className="text-red-600 cursor-pointer mx-3 minus"
            onClick={(event) => props.minusClicked(...args)}
          >
            <FaMinus />
          </span>
        </div>

        <span {...props.dragHandleProps} className={'mx-4'}>
          <FaBars
            title={t('DragToReorder')}
            className={'fill-current text-gray-500'}
          />
        </span>
      </div>
    </div>
  )
}

export default RepeatableControls
