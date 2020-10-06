import React, { useEffect, useState } from 'react'
import Joi from '@hapi/joi'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { boolean } from 'boolean'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import aventum from '../../../aventum'
import * as actions from '../../../store/actions/index'
import { validate } from '../../../shared/utility'
import AuthFormLayout from '../../../hoc/AuthFormsLayout/AuthFormsLayout'
import Input from '../../../components/UI/Input/Input'
import Message from '../../../components/UI/Message/Message'
import Button from '../../../components/UI/Button/Button'

function RegisterForm ({ getPublicOptions, publicOptions, signUp, loading }) {
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()

  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .messages({
        'string.empty': t('error.fnir'),
        'any.required': t('error.fnir')
      }),
    lastName: Joi.string()
      .required()
      .messages({
        'string.empty': t('error.lnir'),
        'any.required': t('error.lnir')
      }),
    email: Joi.string()
      .email({ tlds: { allow: false }, minDomainSegments: 2 })
      .required()
      .messages({
        'string.empty': t('email', { context: 'isEmpty' }),
        'string.email': t('email', { context: 'isEmail' }),
        'any.required': t('email', { context: 'isEmpty' })
      }),
    password: Joi.string()
      .min(6)
      .max(30)
      .required()
      .messages({
        'string.empty': t('PasswordIsRequired'),
        'string.min': t('error.IncorrectPasswordLength'),
        'string.max': t('error.IncorrectPasswordLength'),
        'any.required': t('PasswordIsRequired')
      }),
    passwordConfirmation: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .messages({
        'string.empty': t('error.PasswordConfirmationRequired'),
        'any.only': t('error.PasswordConfirmationNotMatch'),
        'any.required': t('error.PasswordConfirmationRequired')
      })
  })

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const signUpSubscription = (response) => {
      if (response.status === 200) {
        setMessage(t('messages.SuccessfullyRegistered'))
        setMessageType('success')

        resetFormStatusAfter(3000, () => {
          history.push('/')
        })
      } else if (response.status === 429) {
        setMessage(response.data.message)
        setMessageType('error')

        resetFormStatusAfter()
      } else if (response.status === 409) {
        setMessage(t('messages.SystemAlreadySetup'))
        setMessageType('error')

        resetFormStatusAfter()
      } else {
        setMessage(t('error.unspecific'))
        setMessageType('error')
        resetFormStatusAfter()
      }
    }

    getPublicOptions()
    aventum.hooks.addAction(
      'signUp',
      'Aventum/core/RegisterForm/DidMount',
      signUpSubscription
    )
    return () => {
      aventum.hooks.removeAction('signUp', 'Aventum/core/RegisterForm/DidMount')
    }
  }, [getPublicOptions, history, t])

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
    const result = validate(
      schema,
      { firstName, lastName, email, password, passwordConfirmation },
      ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation']
    )

    event.preventDefault()

    if (!submitted) {
      setSubmitted(true)
    }

    if (!result) {
      // handle actual form submission here

      const { pathname } = location

      const form = {
        firstName,
        lastName,
        email,
        password,
        passwordConfirmation
      }

      signUp({ form, pathname })
    }
  }

  let enableRegistration = true

  if (publicOptions.length && location.pathname === '/register') {
    enableRegistration = boolean(
      publicOptions.find((e) => e.name === 'ENABLE_REGISTRATION').value
    )
  }

  // if the form has been submitted at least once then check validity every time we render
  const validation = submitted
    ? validate(
      schema,
      { firstName, lastName, email, password, passwordConfirmation },
      ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation']
    )
    : {}

  return (
    <AuthFormLayout title={t('Registration')} onSubmit={handleSubmit}>
      {!enableRegistration && (
        <Message
          info
          header={t('RegistrationDisabled!')}
          content={t('Utrhbdotw!')}
        />
      )}
      <Input
        value={firstName}
        label={t('fn')}
        id="firstName"
        disabled={!enableRegistration}
        help={validation && validation.firstName ? validation.firstName : ''}
        error={!!(validation && validation.firstName)}
        onChange={(e) => setFirstName(e.target.value)}
        className="mt-6"
      />
      <Input
        value={lastName}
        label={t('ln')}
        id="lastName"
        disabled={!enableRegistration}
        help={validation && validation.lastName ? validation.lastName : ''}
        error={!!(validation && validation.lastName)}
        onChange={(e) => setLastName(e.target.value)}
        className="mt-6"
      />
      <Input
        type="email"
        value={email}
        label={t('Email')}
        id="email"
        disabled={!enableRegistration}
        help={validation && validation.email ? validation.email : ''}
        error={!!(validation && validation.email)}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-6"
      />
      <Input
        type="password"
        label={t('Password')}
        id="password"
        value={password}
        disabled={!enableRegistration}
        help={validation && validation.password ? validation.password : ''}
        error={!!(validation && validation.password)}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-6"
      />
      <Input
        type="password"
        label={t('PasswordConfirmation')}
        id="passwordConfirmation"
        value={passwordConfirmation}
        disabled={!enableRegistration}
        help={
          validation && validation.passwordConfirmation
            ? validation.passwordConfirmation
            : ''
        }
        error={!!(validation && validation.passwordConfirmation)}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        className="mt-6"
      />

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm leading-5">
          <Link
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
            to={'/login'}
          >
            {t('Login')}
          </Link>
        </div>

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
        <Button
          loading={loading}
          disabled={!enableRegistration}
          label={t('Register')}
        />
      </div>
    </AuthFormLayout>
  )
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    publicOptions: state.option.publicOptions,
    loadingOptions: state.option.loadingOptions,
    loading: state.shared.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (payload) => dispatch(actions.signUp(payload)),
    getPublicOptions: () => dispatch(actions.getPublicOptions())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)
