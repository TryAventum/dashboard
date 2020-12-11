import React from 'react'
import createPaginationItems from './createPaginationItems/createPaginationItems'
import { useTranslation } from 'react-i18next'
import Loader from '../Loader/Loader'

const PageItem = ({
  active,
  type,
  value,
  onClick,
  children,
  totalPages,
  activePage,
}) => {
  return (
    <button
      disabled={
        (type === 'nextItem' && activePage === totalPages) ||
        (type === 'prevItem' && activePage === 1)
      }
      onClick={(e) => onClick(e, { activePage: value })}
      type="button"
      className={`${active ? 'bg-gray-200' : 'bg-white'} ${
        type === 'lastItem' ? 'ltr:rounded-r-md rtl:rounded-l-md' : ''
      } ${
        type === 'firstItem'
          ? 'ltr:rounded-l-md rtl:rounded-r-md firstItem'
          : ''
      } ${
        type === 'nextItem' ? 'next' : 'prev'
      } ltr:-ml-px rtl:-mr-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
    >
      {children || value}
    </button>
  )
}

const NextPrevItem = ({ active, type, value, onClick }) => {
  const { t } = useTranslation()
  return (
    <button
      onClick={(e) => onClick(e, { activePage: value })}
      className={`${
        type === 'nextItem' ? 'mobileNext' : 'mobilePrev'
      } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
    >
      {type === 'nextItem' ? t('Next') : t('Previous')}
    </button>
  )
}

const EllipsisItem = () => {
  return (
    <span className="ltr:-ml-px rtl:-mr-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700">
      ...
    </span>
  )
}

export default function Pagination({
  activePage,
  onPageChange,
  totalPages,
  loading,
  className,
}) {
  const items = createPaginationItems({
    activePage,
    boundaryRange: 2,
    hideEllipsis: false,
    siblingRange: 3,
    totalPages,
  })

  // const [pageInput, setPageInput] = useState()

  const prev = items.find((i) => i.type === 'prevItem')
  const next = items.find((i) => i.type === 'nextItem')

  const nextItem = <NextPrevItem onClick={onPageChange} {...next} />
  const prevItem = <NextPrevItem onClick={onPageChange} {...prev} />

  return (
    <div
      className={`pagination relative flex items-center justify-between ${className}`}
    >
      {loading && (
        <div
          className={`absolute flex justify-center items-center inset-0 bg-cool-gray-100 opacity-75 z-10`}
        >
          <Loader className="w-6 text-gray-400" />
        </div>
      )}
      <div className="flex-1 flex justify-between sm:hidden">
        {prevItem}
        {nextItem}
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <nav className="relative z-0 inline-flex shadow-sm">
            {items.map((item) => {
              switch (item.type) {
                case 'prevItem':
                  return (
                    <PageItem
                      totalPages={totalPages}
                      activePage={activePage}
                      key={item.value + item.type}
                      onClick={onPageChange}
                      {...item}
                    >
                      ⟨
                    </PageItem>
                  )

                case 'firstItem':
                  return (
                    <PageItem
                      totalPages={totalPages}
                      activePage={activePage}
                      key={item.value + item.type}
                      onClick={onPageChange}
                      {...item}
                    >
                      «
                    </PageItem>
                  )

                case 'nextItem':
                  return (
                    <PageItem
                      totalPages={totalPages}
                      activePage={activePage}
                      key={item.value + item.type}
                      onClick={onPageChange}
                      {...item}
                    >
                      ⟩
                    </PageItem>
                  )

                case 'lastItem':
                  return (
                    <PageItem
                      totalPages={totalPages}
                      activePage={activePage}
                      key={item.value + item.type}
                      onClick={onPageChange}
                      {...item}
                    >
                      »
                    </PageItem>
                  )

                case 'ellipsisItem':
                  return <EllipsisItem key={item.value + item.type} />

                default:
                case 'pageItem':
                  return (
                    <PageItem
                      totalPages={totalPages}
                      activePage={activePage}
                      key={item.value + item.type}
                      onClick={onPageChange}
                      {...item}
                    />
                  )
              }
            })}
          </nav>
        </div>
      </div>
      {/* <div>Page <input type="number" value={pageInput || activePage} onChange={(e) => setPageInput(e.target.value)} onKeyDown={e => e.key === 'Enter' ? onPageChange(e, { activePage: pageInput }) : null} onBlur={e => onPageChange(e, { activePage: pageInput })} /> of 10</div> */}
    </div>
  )
}
