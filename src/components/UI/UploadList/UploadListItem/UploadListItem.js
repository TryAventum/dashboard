import React, { useState } from 'react'
import Panel from '../../Panel/Panel'
import { FaTrash, FaDownload } from 'react-icons/fa'
import { FcFile } from 'react-icons/fc'
import { RiCheckboxBlankCircleLine, RiCheckboxCircleLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'
import { getFileExtension } from '../../../../shared/utility'
import { formatDistance } from 'date-fns'
import currentLocale from '../../../../date-fns'

import classes from './UploadListItem.module.css'

const UploadListItem = ({ item, picker, select, selected, deleteItem }) => {
  const { t, i18n } = useTranslation()
  const [raised, setRaised] = useState(false)

  const imagesExtensions = ['png', 'jpg', 'tif', 'gif', 'jpeg', 'bmp']

  const videoExtensions = ['avi', 'asf', 'mov', 'mpg', 'mp4', 'wmv', 'flv']

  const mouseLeave = (event) => setRaised(false)
  const mouseEnter = (event) => setRaised(true)

  const isSelected = selected.some((e) => e.id === item.id)
  const createFrom = currentLocale
    ? formatDistance(new Date(item.createdAt), new Date(), {
        locale: currentLocale.locale,
      })
    : formatDistance(new Date(item.createdAt), new Date())

  const isImage = imagesExtensions.includes(getFileExtension(item.path))
  const isVideo = videoExtensions.includes(getFileExtension(item.path))
  const isFile = !isImage && !isVideo

  return (
    <div
      className="w-full md:w-1/4 p-3 max-h-52 relative"
      data-testid-is-selected-upload={isSelected}
      data-testid-upload-name={item.originalName}
    >
      <Panel
        onMouseLeave={mouseLeave}
        onMouseEnter={mouseEnter}
        className={`${classes.uploadItemPanel} overflow-hidden h-full`}
        // raised={this.state.raised}
        // positive={selected.includes(item.id) ? true : false}
        // color={
        //   selected.includes(item.id) ? 'green' : 'grey'
        // }
        style={
          isSelected
            ? {
                boxShadow: '0px 0px 6px 2px rgba(33,186,69,1)',
              }
            : {}
        }
      >
        {isImage && (
          <img
            className="h-full w-full object-cover"
            src={item.path}
            alt={item.originalName}
          />
        )}
        {isFile && (
          <FcFile
            className="h-full w-full object-cover"
            title={item.originalName}
          />
        )}
        {isVideo && (
          <video className="h-full w-full object-cover" controls>
            <source src={item.path} /> To view this video please enable
            JavaScript, and consider upgrading to a web browser that supports
            HTML5 video
          </video>
        )}
        <div
          className={`${classes.name} absolute flex justify-start text-center`}
          style={{
            top: '20px',
            [i18n.dir() === 'ltr' ? 'left' : 'right']: '20px',
          }}
        >
          <h2
            className="bg-brand-red text-white max-w-xs break-words"
            style={{
              maxWidth: '70%',
            }}
          >
            {item.originalName}
          </h2>
        </div>
        <div
          className="absolute"
          style={{
            top: '20px',
            [i18n.dir() === 'ltr' ? 'right' : 'left']: '20px',
          }}
        >
          <div className="flex justify-evenly text-xl mb-1">
            <a
              href={item.path}
              download={item.originalName}
              className={`${classes.downloadButton} bg-transparent hover:bg-indigo-500 text-indigo-700 hover:text-white py-2 px-4 border border-indigo-500 hover:border-transparent text-base mx-1`}
              target="_blank"
            >
              <FaDownload title={t('Download')} />
            </a>
            <button
              onClick={() => deleteItem(item)}
              className={`${classes.deleteButton} bg-transparent hover:bg-red-500 text-red-700 hover:text-white py-2 px-4 border border-red-500 hover:border-transparent text-base mx-1`}
            >
              <FaTrash title={t('Delete')} />
            </button>
          </div>
          <div className="flex justify-center">
            <span className={`${classes.since} bg-brand-red text-white`}>
              {createFrom}
            </span>
          </div>
        </div>
        {picker && (
          <div
            onClick={(event) => select(event, item)}
            className={`${
              !isSelected ? classes.selectBtn : ''
            } absolute text-4xl font-bold text-green-500 cursor-pointer selectBtn`}
            style={{
              bottom: '20px',
              [i18n.dir() === 'ltr' ? 'left' : 'right']: '20px',
            }}
          >
            {!isSelected && (
              <RiCheckboxBlankCircleLine title={t('ClickToSelect')} />
            )}
            {isSelected && (
              <RiCheckboxCircleLine title={t('ClickToDeSelect')} />
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}

export default UploadListItem
