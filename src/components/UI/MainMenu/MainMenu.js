import React, { useState, useReducer } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from '../../../axios'
import * as actions from '../../../store/actions/index'
import { useTranslation } from 'react-i18next'
import Transition from '../../../shared/Transition'
import { FaGlobe } from 'react-icons/fa'
import { useClickOutsideOrInside } from '../../../shared/react-hooks'

// import classes from './MainMenu.module.css'

const ProfilePicture = ({ currentUser, className }) => {
  if (!currentUser) {
    return null
  }
  return currentUser.picture ? (
    <img
      src={currentUser.picture}
      className={className}
      alt={currentUser.firstName + ' ' + currentUser.lastName}
    />
  ) : (
    <span className={`${className} flex items-center justify-center`}>
      {currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)}
    </span>
  )
}

const LanguageList = ({
  languages,
  changeLanguage,
  className,
  currentLang,
}) => {
  return languages.map((l) => (
    <span
      key={l.code}
      onClick={() => changeLanguage(l)}
      className={`${className} ltr:text-left rtl:text-right ${
        currentLang === l.code ? 'font-bold text-brand-red' : ''
      }`}
    >
      {l.label}
    </span>
  ))
}

function reducer(state, action) {
  switch (action.type) {
    case 'language':
      return { language: !state.language, profile: false }
    case 'profile':
      return { language: false, profile: !state.profile }
    default:
      throw new Error()
  }
}

function MainMenu({ logout, currentUser }) {
  const [state, dispatch] = useReducer(reducer, {
    profile: false,
    language: false,
  })
  const { ref: langRef } = useClickOutsideOrInside(() =>
    dispatch({ type: 'language' })
  )
  const { ref: profRef } = useClickOutsideOrInside(() =>
    dispatch({ type: 'profile' })
  )
  const [isMobMenuOpen, setIsMobMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()

  const languages = [
    {
      label: 'English',
      code: 'en',
    },
    { label: 'عربي', code: 'ar' },
  ]

  const changeLanguage = async (language) => {
    await i18n.changeLanguage(language.code)
    axios.defaults.headers.common['accept-language'] = language.code
  }

  const dropDownProfileLinkClasses =
    'block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out'
  const mobileProfileLinkClasses =
    'block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:text-gray-800 focus:bg-gray-100 transition duration-150 ease-in-out'

  return (
    <nav className="bg-white shadow w-full z-10 fixed ">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-11">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="block h-8 w-auto"
                src="/logo.svg"
                alt={t('AventumLogo')}
              />
            </div>
          </div>
          <div className="hidden sm:ltr:ml-6 sm:rtl:mr-6 sm:flex sm:items-center">
            <div className="relative inline-block ltr:text-left rtl:text-right">
              <div>
                <button
                  onClick={() => dispatch({ type: 'language' })}
                  className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                >
                  <FaGlobe className="h-5 w-5" />
                </button>
              </div>

              <Transition
                show={state.language}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div
                  ref={langRef}
                  className={`ltr:right-0 rtl:left-0 ltr:origin-top-right rtl:origin-top-left absolute mt-2 w-56 rounded-md shadow-lg`}
                >
                  <div className="rounded-md bg-white shadow-xs">
                    <div className="py-1">
                      <LanguageList
                        languages={languages}
                        changeLanguage={changeLanguage}
                        currentLang={i18n.language}
                        className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <div className="ltr:ml-3 rtl:mr-3 relative">
              <div>
                <button
                  onClick={() => dispatch({ type: 'profile' })}
                  className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
                  id="user-menu"
                  aria-label="User menu"
                  aria-haspopup="true"
                >
                  <ProfilePicture
                    currentUser={currentUser}
                    className="h-8 w-8 rounded-full"
                  />
                </button>
              </div>

              <Transition
                show={state.profile}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div
                  ref={profRef}
                  className={`ltr:right-0 rtl:left-0 ltr:origin-top-right rtl:origin-top-left absolute mt-2 w-48 rounded-md shadow-lg`}
                >
                  <div
                    className="py-1 rounded-md bg-white shadow-xs"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      to="/users/profile"
                      className={dropDownProfileLinkClasses}
                    >
                      {t('YourProfile')}
                    </Link>
                    <span
                      onClick={logout}
                      className={`${dropDownProfileLinkClasses} cursor-pointer`}
                    >
                      {t('Signout')}
                    </span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          <div className="ltr:-mr-2 rtl:-ml-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobMenuOpen((ov) => !ov)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              aria-label="Main menu"
              aria-expanded="false"
            >
              <svg
                className={`${isMobMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <svg
                className={`${isMobMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
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
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <ProfilePicture
                currentUser={currentUser}
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="ltr:ml-3 rtl:mr-3">
              <div className="text-base font-medium leading-6 text-gray-800">
                {currentUser
                  ? currentUser.firstName + ' ' + currentUser.lastName
                  : ''}
              </div>
              <div className="text-sm font-medium leading-5 text-gray-500">
                {currentUser ? currentUser.email : ''}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Link to="/users/profile" className={mobileProfileLinkClasses}>
              {t('YourProfile')}
            </Link>
            <span
              onClick={logout}
              className={`${mobileProfileLinkClasses} mt-1 cursor-pointer`}
            >
              {t('Signout')}
            </span>
          </div>
        </div>

        <div className="pt-4 pb-3 border-t border-gray-200">
          <LanguageList
            languages={languages}
            currentLang={i18n.language}
            changeLanguage={changeLanguage}
            className={`${mobileProfileLinkClasses} cursor-pointer`}
          />
        </div>
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)
