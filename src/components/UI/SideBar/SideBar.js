import React, { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import aventum from '../../../aventum'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../../../store/actions/index'
import acl from '../../../shared/acl'
import { useTranslation } from 'react-i18next'
import Transition from '../../../shared/Transition'
import { usePrevious } from '../../../shared/react-hooks'

export function SideBar() {
  const currentUser = useSelector((state) => state.auth.currentUser)
  const schemas = useSelector((state) => state.schema.schemas)
  const roles = useSelector((state) => state.role.roles)
  const dispatch = useDispatch()
  const history = useHistory()

  const iconsClassName =
    'ltr:mr-3 rtl:ml-3 h-6 w-6 text-gray-400 group-hover:text-gray-600 group-focus:text-gray-600 transition ease-in-out duration-150'
  const { t, i18n } = useTranslation()

  const [menu, setMenu] = useState([])
  const [openItems, setOpenItems] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  const location = useLocation()

  useEffect(() => {
    const _activeItem = menu.find((i) =>
      i.items.find((j) => j.link === location.pathname)
    )
    setActiveItem(_activeItem)
  }, [location.pathname])

  const menuSetup = () => {
    let _openItems = null

    let menu = []

    menu.push({
      icon: (
        <svg
          className={iconsClassName}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      title: t(t('Dashboard')),
      items: [
        {
          name: 'Dashboard',
          title: t('Dashboard'),
          link: '/',
        },
      ],
    })

    if (schemas && schemas.length) {
      for (const i of schemas) {
        const singularValue = i.singularTitle
        const canReadContent = acl.canReadContent(currentUser, i, false, roles)
        const canCreateContent = acl.canCreateContent(
          currentUser,
          i,
          false,
          roles
        )

        if (!canReadContent && !canCreateContent) {
          return null
        }

        const contentItems = []

        if (canReadContent) {
          contentItems.push({
            name: i.name,
            title: t(i.title),
            link: `/contents/${i.name}/list`,
          })
        }

        if (canCreateContent) {
          contentItems.push({
            name: t('Add$item', {
              item: t(singularValue),
            }),
            link: `/contents/${i.name}/new`,
          })
        }

        menu.push({
          icon: i.icon
            ? i.icon
            : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>',
          title: t(i.title),
          items: contentItems,
        })
      }
    }

    if (acl.isUserCan(currentUser, ['readUploads'], false, 'EVERY', roles)) {
      menu.push({
        icon: (
          <svg
            className={iconsClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        ),
        title: t(t('Uploads')),
        items: [
          {
            name: 'Uploads',
            title: t('Uploads'),
            link: '/uploads',
          },
        ],
      })
    }

    if (acl.isUserCan(currentUser, ['readSchemas'], false, 'EVERY', roles)) {
      menu.push({
        icon: (
          <svg
            className={iconsClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
        ),
        title: t('Schemas'),
        items: [
          {
            name: 'schemasList',
            title: t('SchemasList'),
            link: '/schemas/list',
          },
          {
            name: 'newSchema',
            title: t('NewSchema'),
            link: '/schemas/new',
          },
        ],
      })
    }

    if (
      acl.isUserCan(currentUser, ['readCustomFields'], false, 'EVERY', roles)
    ) {
      menu.push({
        icon: (
          <svg
            className={iconsClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        ),
        title: t('FieldsBuilder'),
        items: [
          {
            name: 'fieldsList',
            title: t('FieldsList'),
            link: '/fields/list',
          },
          {
            name: 'newField',
            title: t('AddField'),
            link: '/fields/new',
          },
        ],
      })
    }

    if (acl.isUserCan(currentUser, ['readUsers'], false, 'EVERY', roles)) {
      menu.push({
        icon: (
          <svg
            className={iconsClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ),
        title: t('Users'),
        items: [
          {
            name: 'usersList',
            title: t('UsersList'),
            link: '/users/list',
          },
          {
            name: 'newUser',
            title: t('AddUser'),
            link: '/users/new',
          },
        ],
      })
    }

    if (acl.isUserCan(currentUser, ['readRoles'], false, 'EVERY', roles)) {
      menu.push({
        icon: (
          <svg
            className={iconsClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
            />
          </svg>
        ),
        title: t('Roles'),
        items: [
          {
            name: 'rolesList',
            title: t('RolesList'),
            link: '/roles/list',
          },
          {
            name: 'newRole',
            title: t('AddRole'),
            link: '/roles/new',
          },
        ],
      })
    }

    if (
      acl.isUserCan(currentUser, ['readCapabilities'], false, 'EVERY', roles)
    ) {
      menu.push({
        icon: (
          <svg
            className={iconsClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        ),
        title: t('Capabilities'),
        items: [
          {
            name: 'capabilitiesList',
            title: t('CapabilitiesList'),
            link: '/capabilities/list',
          },
          {
            name: 'newCapability',
            title: t('AddCapability'),
            link: '/capabilities/new',
          },
        ],
      })
    }

    if (
      acl.isUserCan(currentUser, ['readTranslations'], false, 'EVERY', roles)
    ) {
      menu.push({
        icon: (
          <svg
            className={iconsClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        title: t('Translation'),
        items: [
          {
            name: 'translation',
            title: t('Translation'),
            link: '/translation',
          },
        ],
      })
    }

    if (acl.isUserCan(currentUser, ['readExtensions'], false, 'EVERY', roles)) {
      menu.push({
        icon: (
          <svg
            className={iconsClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        ),
        title: t('Extensions'),
        items: [
          {
            name: 'extensionsList',
            title: t('ExtensionsList'),
            link: '/extensions/list',
          },
        ],
      })
    }

    if (acl.isUserCan(currentUser, ['readOptions'], false, 'EVERY', roles)) {
      menu.push({
        icon: (
          <svg
            className={iconsClassName}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
        title: t('Options'),
        items: [
          {
            name: 'generalOptions',
            title: t('GeneralOptions'),
            link: '/options/general',
          },
          {
            name: 'emailOptions',
            title: t('EmailOptions'),
            link: '/options/email',
          },
          {
            name: 'loginProviders',
            title: t('LoginProviders'),
            link: '/options/login-providers',
          },
          {
            name: 'cacheOptions',
            title: t('CacheOptions'),
            link: '/options/cache',
          },
        ],
      })
    }

    /**
     * The SideBar menu data
     *
     * @hook
     * @name SideBarMenu
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Array} menu The menu data.
     * @param {Object} $this The SideBar component.
     */
    menu = aventum.hooks.applyFiltersSync('SideBarMenu', menu, this)

    if (menu.length) {
      _openItems = menu.filter((i) =>
        i.items.find((si) => si.link === location.pathname)
      )

      if (!_openItems) {
        _openItems = menu.filter((i) => i.items.find((si) => si.link === '/'))
      }
    }

    /**
     * The active item of SideBar's menu
     *
     * @hook
     * @name SideBarOpenItems
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} _openItems The active item.
     * @param {Object} $this The SideBar component.
     */
    _openItems = aventum.hooks.applyFiltersSync(
      'SideBarOpenItems',
      _openItems,
      this,
      { _openItems, menu },
      { schemas, currentUser, roles }
    )

    if (_openItems) {
      setMenu(menu)
      if (!openItems.length) {
        setActiveItem(_openItems[0])
        setOpenItems(_openItems)
      }
    } else {
      setMenu(menu)
    }
  }

  useEffect(() => {
    dispatch(actions.getSchemas())
    menuSetup()
  }, [])

  useEffect(() => {
    menuSetup()
  }, [
    roles.length,
    currentUser && currentUser.email ? true : false,
    schemas.length,
    location.pathname,
  ])

  const handleItemClick = (menuItem) => {
    const openItemssTitles = openItems.map((i) => i.title)
    if (openItemssTitles.includes(menuItem.title)) {
      setOpenItems(openItems.filter((i) => i.title !== menuItem.title))
    } else {
      setOpenItems([...openItems, menuItem])
    }
  }

  var sideBarMenu = null

  if (menu.length) {
    const openItemssTitles = openItems.map((i) => i.title)
    sideBarMenu = (
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 bg-white">
          {menu.map((menuItem) => {
            const isItemOpen =
              openItems.length && openItemssTitles.includes(menuItem.title)

            const devProps = {}

            const isContentIcon = typeof menuItem.icon === 'string'

            if (isContentIcon) {
              devProps.dangerouslySetInnerHTML = {
                __html: DOMPurify.sanitize(menuItem.icon),
              }
            }

            return (
              <div key={menuItem.title}>
                <button
                  className={`group w-full flex items-center ltr:pl-2 rtl:pr-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md  focus:outline-none hover:bg-gray-50 transition ease-in-out duration-150 ${
                    activeItem && menuItem.title === activeItem.title
                      ? 'bg-gray-100'
                      : ''
                  }`}
                  onClick={() => {
                    handleItemClick(menuItem)
                    if (menuItem.items.length === 1) {
                      // setActiveItem(menuItem.items[0])
                      history.push(menuItem.items[0].link)
                    }
                  }}
                  title={menuItem.title}
                  // {...devProps}
                >
                  {!isContentIcon ? (
                    menuItem.icon
                  ) : (
                    <span className={iconsClassName} {...devProps}></span>
                  )}
                  {menuItem.title}
                  {menuItem.items.length > 1 ? (
                    <svg
                      className={`hhh ltr:ml-auto rtl:mr-auto h-5 w-5 transform group-hover:text-gray-400 group-focus:text-gray-400 transition-colors ease-in-out duration-150 ${
                        isItemOpen
                          ? 'text-gray-400 rotate-90'
                          : `text-gray-300 ${
                              i18n.dir() === 'rtl' ? 'rotate-180' : ''
                            }`
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                    </svg>
                  ) : null}
                </button>
                {menuItem.items.length > 1 ? (
                  <div className="mt-1 space-y-1">
                    {isItemOpen
                      ? menuItem.items.map((i) => (
                          <Link
                            key={i.name}
                            to={i.link}
                            className={`group w-full flex items-center ltr:pl-11 rtl:pr-11 ltr:pr-2 rtl:pl-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition ease-in-out duration-150 ${
                              location.pathname === i.link
                                ? 'text-brand-red'
                                : 'hover:text-gray-900 focus:text-gray-900'
                            }`}
                          >
                            {i.title || i.name}
                          </Link>
                        ))
                      : null}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>
      </div>
    )
  }

  /**
   * The SideBar
   *
   * @hook
   * @name SideBarMenuRender
   * @type applyFiltersSync
   * @since 1.0.0
   *
   * @param {Object} sideBar The returned value from the render method of the sidebar component.
   * @param {Object} $this The SideBar component.
   */
  sideBarMenu = aventum.hooks.applyFiltersSync(
    'SideBarMenuRender',
    sideBarMenu,
    this
  )

  return sideBarMenu
}

const SideBarWrapper = () => {
  const [open, setOpen] = useState(false)
  const [openOverlay, setOpenOverlay] = useState(false)
  const prevOpen = usePrevious(open)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (open && !prevOpen) {
      setOpenOverlay(true)
    } else if (!open && prevOpen) {
      setTimeout(() => {
        setOpenOverlay(false)
      }, 310)
    }
  }, [open, prevOpen])
  return (
    <div
      className="flex flex-col flex-grow ltr:border-r rtl:border-l border-gray-200 pt-5 bg-white overflow-y-auto min-w-max-content"
      style={{ maxWidth: '15rem' }}
    >
      <button
        onClick={(e) => setOpen((oldState) => !oldState)}
        className="md:hidden fixed z-50 flex items-center bg-brand-red text-white justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-brand-dark-red shadow"
        aria-label="Close sidebar"
        style={{
          [i18n.dir() === 'ltr' ? 'right' : 'left']: '20px',
          bottom: '20px',
        }}
      >
        <svg
          className="w-1/2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>
      <div className="md:hidden">
        <div className={`flex fixed inset-0 ${openOverlay ? 'z-40' : ''}`}>
          <Transition
            show={open}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0">
              <div
                onClick={(e) => setOpen(false)}
                className="absolute inset-0 bg-gray-600 opacity-75"
              ></div>
            </div>
          </Transition>
          <Transition
            show={open}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="ltr:-translate-x-full rtl:translate-x-full"
            enterTo="ltr:translate-x-0 rtl:-translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="ltr:translate-x-0 rtl:-translate-x-0"
            leaveTo="ltr:-translate-x-full rtl:translate-x-full"
          >
            <div
              style={{ maxWidth: '15rem' }}
              className="relative flex-1 flex flex-col w-full bg-white"
            >
              <div className="absolute top-0 ltr:right-0 rtl:left-0 ltr:-mr-14 rtl:-ml-14 p-1">
                <button
                  className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
                  aria-label="Close sidebar"
                  onClick={(e) => setOpen(false)}
                >
                  <svg
                    className="h-6 w-6 text-white"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="/logo.svg"
                    alt={t('AventumLogo')}
                  />
                </div>
                <SideBar />
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <p className="text-xs text-cool-gray-500 italic font-mono">
                  {t('Tyfcw')}{' '}
                  <a href="https://aventum.org" className="text-brand-red">
                    {t('Aventum')}
                  </a>
                  .
                  <span className="block ltr:text-right rtl:text-left">
                    {t('ver$version', {
                      version: aventum.version,
                    })}
                  </span>
                </p>
              </div>
            </div>
          </Transition>
          <div className="flex-shrink-0 w-14">
            {/* <!-- Force sidebar to shrink to fit close icon --> */}
          </div>
        </div>
      </div>
      <div
        style={{ maxWidth: '15rem' }}
        className="hidden relative flex-1 md:flex flex-col w-full bg-white"
      >
        <div className="flex-1 h-0 pt-8">
          <SideBar />
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <p className="text-xs text-cool-gray-500 italic font-mono">
            {t('Tyfcw')}{' '}
            <a href="https://aventum.org" className="text-brand-red">
              {t('Aventum')}
            </a>
            .
            <span className="block ltr:text-right rtl:text-left">
              {t('ver$version', {
                version: aventum.version,
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SideBarWrapper
