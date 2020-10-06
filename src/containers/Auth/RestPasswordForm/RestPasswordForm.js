import React, { useState, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Joi from '@hapi/joi'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import aventum from '../../../aventum'
import * as actions from '../../../store/actions/index'
import { validate } from '../../../shared/utility'
import AuthFormLayout from '../../../hoc/AuthFormsLayout/AuthFormsLayout'
import Input from '../../../components/UI/Input/Input'
import Message from '../../../components/UI/Message/Message'
import Button from '../../../components/UI/Button/Button'

function RestPasswordForm ({ resetPassword, loading }) {
  const { t } = useTranslation()
  const history = useHistory()
  const { token } = useParams()

  const schema = Joi.object({
    password: Joi.string().min(6)
      .max(30).required().messages({
        'string.empty': t('PasswordIsRequired'),
        'string.min': t('error.IncorrectPasswordLength'),
        'string.max': t('error.IncorrectPasswordLength'),
        'any.required': t('PasswordIsRequired')
      }),
    passwordConfirmation: Joi.string().required().valid(Joi.ref('password')).messages({
      'string.empty': t('error.PasswordConfirmationRequired'),
      'any.only': t('error.PasswordConfirmationNotMatch'),
      'any.required': t('error.PasswordConfirmationRequired')
    })
  })

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    const resetPasswordSubscription = response => {
      if (response.status === 200) {
        setMessage(t('messages.PassChaSuc'))
        setMessageType('success')

        resetFormStatusAfter(3000, () => {
          history.push('/login')
        })
      } else if (response.status === 429) {
        setMessage(response.data.message)
        setMessageType('error')

        resetFormStatusAfter()
      } else {
        setMessage(t('error.unspecific'))
        setMessageType('error')

        resetFormStatusAfter()
      }
    }

    aventum.hooks.addAction(
      'resetPassword',
      'Aventum/core/RestPasswordForm/DidMount',
      resetPasswordSubscription
    )
    return () => {
      aventum.hooks.removeAction(
        'resetPassword',
        'Aventum/core/RestPasswordForm/DidMount'
      )
    }
  }, [history, t])

  const resetFormStatusAfter = (time = 3000, fn = null) => {
    setTimeout(() => {
      setMessage('')
      setMessageType('')

      if (fn) {
        fn()
      }
    }, time)
  }

  const handleSubmit = event => {
    const result = validate(schema, { password, passwordConfirmation }, ['password', 'passwordConfirmation'])

    event.preventDefault()

    if (!submitted) {
      setSubmitted(true)
    }

    if (!result) {
      // handle actual form submission here
      const form = {
        password: password,
        passwordConfirmation: passwordConfirmation
      }

      resetPassword({ form, token })
    }
  }

  // if the form has been submitted at least once then check validity every time we render
  const validation = submitted ? validate(schema, { password, passwordConfirmation }, ['password', 'passwordConfirmation']) : {}

  return (
    <AuthFormLayout title={t('ChangePassword')} onSubmit={handleSubmit}>
      <Input
        type="password"
        label={t('NewPassword')}
        id="password"
        value={password}
        help={validation && validation.password ? validation.password : ''}
        error={!!(validation && validation.password)}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-6"
      />
      <Input
        type="password"
        label={t('NewPassConf')}
        id="passwordConfirmation"
        value={passwordConfirmation}
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
          label={t('ChangePassword')}
        />
      </div>
    </AuthFormLayout>
  )
}

const mapStateToProps = state => {
  return {
    loading: state.shared.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetPassword: payload => dispatch(actions.resetPassword(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestPasswordForm)
