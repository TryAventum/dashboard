import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Joi from '@hapi/joi'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions/index'
import { validate } from '../../../shared/utility'
import aventum from '../../../aventum'
import { useTranslation } from 'react-i18next'
import AuthFormLayout from '../../../hoc/AuthFormsLayout/AuthFormsLayout'
import Input from '../../../components/UI/Input/Input'
import Message from '../../../components/UI/Message/Message'
import Button from '../../../components/UI/Button/Button'

function ForgetPasswordForm ({ forgetPassword, loading }) {
  const { t } = useTranslation()

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false }, minDomainSegments: 2 })
      .required()
      .messages({
        'string.empty': t('email', { context: 'isEmpty' }),
        'string.email': t('email', { context: 'isEmail' }),
        'any.required': t('email', { context: 'isEmpty' })
      })
  })

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    const forgetPasswordSubscription = (response) => {
      if (response.status === 200) {
        setMessage(t('messages.ResPassReqSentSuccessfully'))
        setMessageType('success')

        resetFormStatusAfter(4000)
      } else if (response.status === 429) {
        setMessage(response.data.message)
        setMessageType('error')

        resetFormStatusAfter(8000)
      } else if (response.status === 400) {
        setMessage(t('error.emailNotExist'))
        setMessageType('error')

        resetFormStatusAfter(8000)
      } else {
        setMessage(t('error.unspecific'))
        setMessageType('error')

        resetFormStatusAfter()
      }
    }

    aventum.hooks.addAction(
      'forgetPassword',
      'Aventum/core/ForgetPasswordForm/DidMount',
      forgetPasswordSubscription
    )
    return () => {
      aventum.hooks.removeAction(
        'forgetPassword',
        'Aventum/core/ForgetPasswordForm/DidMount'
      )
    }
  }, [t])

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
    const result = validate(schema, { email }, ['email'])

    event.preventDefault()

    if (!submitted) {
      setSubmitted(true)
    }

    if (!result) {
      // handle actual form submission here

      const form = {
        email
      }

      forgetPassword(form)
    }
  }

  // if the form has been submitted at least once then check validity every time we render
  const validation = submitted ? validate(schema, { email }, ['email']) : {}

  return (
    <AuthFormLayout title={t('ResetPassword')} onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        label={t('Email')}
        id="email"
        help={validation && validation.email ? validation.email : ''}
        error={!!(validation && validation.email)}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-6"
      />

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm leading-5">
          <Link
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
            to={'/register'}
          >
            {t('SignUp')}
          </Link>
        </div>

        <div className="text-sm leading-5">
          <Link
            className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
            to={'/login'}
          >
            {t('Login')}
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
        <Button loading={loading} label={t('ResetYourPassword')} />
      </div>
    </AuthFormLayout>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.shared.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    forgetPassword: (payload) => dispatch(actions.forgetPassword(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPasswordForm)
