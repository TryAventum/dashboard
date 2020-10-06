import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import Joi from '@hapi/joi'
import { boolean } from 'boolean'
import aventum from '../../../aventum'
import { validate } from '../../../shared/utility'
import * as actions from '../../../store/actions/index'
import AuthFormLayout from '../../../hoc/AuthFormsLayout/AuthFormsLayout'
import { FaGoogle, FaFacebook } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import Input from '../../../components/UI/Input/Input'
import Message from '../../../components/UI/Message/Message'
import Button from '../../../components/UI/Button/Button'

const ProviderLoginButton = ({ onClick, ariaLabel, Icon }) => {
  return (
    <div>
      <span className="w-full inline-flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={onClick}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition duration-150 ease-in-out"
          aria-label={ariaLabel}
        >
          <Icon className="h-5 fill-current" />
        </button>
      </span>
    </div>
  )
}

function LoginForm ({ getPublicOptions, signIn, publicOptions, loading }) {
  const { t } = useTranslation()
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    const signInSubscription = (response) => {
      if (response.status === 200) {
        setMessage(t('messages.SuccessfullySignedIn'))
        setMessageType('success')

        resetFormStatusAfter(3000, () => {
          history.push('/')
        })
      } else if (response.status === 429) {
        setMessage(response.data.message)
        setMessageType('error')

        resetFormStatusAfter()
      } else {
        setMessage(t('error.IncorrectEmailOrPassword'))
        setMessageType('error')

        resetFormStatusAfter()
      }
    }

    // Get login page settings
    getPublicOptions()
    aventum.hooks.addAction(
      'signIn',
      'Aventum/core/LoginForm/DidMount',
      signInSubscription
    )
    return () => {
      aventum.hooks.removeAction('signIn', 'Aventum/core/LoginForm/DidMount')
    }
  }, [getPublicOptions, history, t])

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false }, minDomainSegments: 2 })
      .required()
      .messages({
        'string.empty': t('email', { context: 'isEmpty' }),
        'string.email': t('email', { context: 'isEmail' }),
        'any.required': t('email', { context: 'isEmpty' })
      }),
    password: Joi.string()
      .required()
      .messages({
        'string.empty': t('PasswordIsRequired'),
        'any.required': t('PasswordIsRequired')
      })
  })

  const resetFormStatusAfter = (time = 3000, fn = null) => {
    setTimeout(() => {
      setMessage('')
      setMessageType('')

      if (fn) {
        fn()
      }
    }, time)
  }

  const handleSubmit = (event) => {
    const result = validate(schema, { email, password }, ['email', 'password'])

    event.preventDefault()

    if (!submitted) {
      setSubmitted(true)
    }

    if (!result) {
      // handle actual form submission here

      const form = {
        email,
        password
      }

      signIn(form)
    }
  }

  const googleLogin = (e) => {
    window.location.href = process.env.REACT_APP_BASE_URL + 'users/auth/google'
  }

  const facebookLogin = (e) => {
    window.location.href =
      process.env.REACT_APP_BASE_URL + 'users/auth/facebook'
  }

  const enableFacebookLogin = publicOptions.length
    ? boolean(
      publicOptions.find((e) => e.name === 'ENABLE_FACEBOOK_LOGIN').value
    )
    : false

  const enableRegistration = publicOptions.length
    ? boolean(publicOptions.find((e) => e.name === 'ENABLE_REGISTRATION').value)
    : false

  const enableGoogleLogin = publicOptions.length
    ? boolean(publicOptions.find((e) => e.name === 'ENABLE_GOOGLE_LOGIN').value)
    : false

  // if the form has been submitted at least once then check validity every time we render
  const validation = submitted
    ? validate(schema, { email, password }, ['email', 'password'])
    : {}

  return (
    <AuthFormLayout title={t('Signin')} onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        label={t('Email')}
        id="email"
        help={validation && validation.email ? validation.email : ''}
        error={!!(validation && validation.email)}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        label={t('Password')}
        id="password"
        value={password}
        help={validation && validation.password ? validation.password : ''}
        error={!!(validation && validation.password)}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-6"
      />

      <div className="mt-6 flex items-center justify-between">
        {enableRegistration && (
          <div className="text-sm leading-5">
            <Link
              className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
              to={'/register'}
            >
              {t('SignUp')}
            </Link>
          </div>
        )}
        <div className="text-sm leading-5">
          <Link
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
            to={'/forgot-password'}
          >
            {t('ResetPassword')}
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <Message
          error={messageType === 'error'}
          success={messageType === 'success'}
          header={message}
        />
      </div>

      <div className="mt-6">
        <Button loading={loading} label={t('Login')} />
      </div>

      {(enableGoogleLogin || enableFacebookLogin) && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm leading-5">
              <span className="px-2 bg-white text-gray-500">{t('ocw')}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {enableFacebookLogin && (
              <ProviderLoginButton
                onClick={facebookLogin}
                ariaLabel={'Sign in with Facebook'}
                Icon={FaFacebook}
              />
            )}

            {enableGoogleLogin && (
              <ProviderLoginButton
                onClick={googleLogin}
                ariaLabel={'Sign in with Google'}
                Icon={FaGoogle}
              />
            )}
          </div>
        </div>
      )}
    </AuthFormLayout>
  )
}

const mapStateToProps = (state) => {
  return {
    publicOptions: state.option.publicOptions,
    loading: state.shared.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (payload) => dispatch(actions.signIn(payload)),
    getPublicOptions: () => dispatch(actions.getPublicOptions())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
