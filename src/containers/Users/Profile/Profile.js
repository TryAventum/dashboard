import React, { useState, useEffect } from 'react'
import pickBy from 'lodash/pickBy'
import SelectUploadsModal from '../../../components/UI/SelectUploadsModal/SelectUploadsModal'
import identity from 'lodash/identity'
import Joi from '@hapi/joi'
import Input from '../../../components/UI/Input/Input'
import { connect, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as actions from '../../../store/actions/index'
import { validate } from '../../../shared/utility'
import aventum from '../../../aventum'
import SaveButtons from '../../../components/UI/SaveButtons/SaveButtons'
import Notification from '../../../components/UI/Notification/Notification'
import { useNotification } from '../../../shared/react-hooks'

const Profile = (props) => {
  const { t, i18n } = useTranslation()
  const [submitted, setSubmitted] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [picture, setPicture] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [messageType, setMessageType] = useState('')
  const [message, setMessage] = useState('')

  const { notificationList, addNotification, onDismiss } = useNotification()
  const dispatch = useDispatch()

  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .messages({
        'string.empty': t('error.fnir'),
        'any.required': t('error.fnir'),
      }),
    lastName: Joi.string()
      .required()
      .messages({
        'string.empty': t('error.lnir'),
        'any.required': t('error.lnir'),
      }),
    email: Joi.string()
      .email({ tlds: { allow: false }, minDomainSegments: 2 })
      .required()
      .messages({
        'string.empty': t('email', { context: 'isEmpty' }),
        'string.email': t('email', { context: 'isEmail' }),
        'any.required': t('email', { context: 'isEmpty' }),
      }),
    picture: Joi.string()
      .max(250)
      .messages({
        'string.max': t('error.MPULI250'),
      }),
    password: Joi.string()
      .min(6)
      .max(30)
      .messages({
        'string.empty': t('PasswordIsRequired'),
        'string.min': t('error.IncorrectPasswordLength'),
        'string.max': t('error.IncorrectPasswordLength'),
        'any.required': t('PasswordIsRequired'),
      }),
    passwordConfirmation: Joi.when('password', {
      is: Joi.exist(),
      then: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
          'string.empty': t('error.PasswordConfirmationRequired'),
          'any.only': t('error.PasswordConfirmationNotMatch'),
          'any.required': t('error.PasswordConfirmationRequired'),
        }),
      otherwise: Joi.forbidden().messages({
        'any.unknown': t('error.putpff'),
      }),
    }),
  })

  useEffect(() => {
    if (props.currentUser && props.currentUser.firstName) {
      setFirstName(props.currentUser.firstName)
      setLastName(props.currentUser.lastName)
      setEmail(props.currentUser.email)
      setPicture(props.currentUser.picture || '')
    }
  }, [props.currentUser])

  const onCancel = (event) => {
    props.history.push('/')
  }

  const values = pickBy(
    {
      firstName,
      lastName,
      email,
      picture,
      password,
      passwordConfirmation,
    },
    identity
  )

  const saveContent = (event) => {
    let result = validate(schema, values, [
      'firstName',
      'lastName',
      'email',
      'picture',
      'password',
      'passwordConfirmation',
    ])

    if (!submitted) {
      setSubmitted(true)
    }

    if (!result) {
      // handle actual form submission here
      const form = {
        firstName,
        lastName,
        email,
        picture,
        password,
        passwordConfirmation,
      }

      result = dispatch(actions.updateProfile(form))

      addNotification(result, {
        successHeader: t('messages.DataSavedSuccessfully'),
      })
    }
  }

  // if the form has been submitted at least once then check validity every time we render
  const validation = submitted
    ? validate(schema, values, [
        'firstName',
        'lastName',
        'email',
        'picture',
        'password',
        'passwordConfirmation',
      ])
    : {}

  return (
    <div className="flex">
      <div className="w-5/6 px-4">
        <Input
          placeholder={t('fn')}
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName || ''}
          id="firstName"
          help={validation && validation.firstName ? validation.firstName : ''}
          error={!!(validation && validation.firstName)}
          className="mb-6"
        />
        <Input
          placeholder={t('ln')}
          onChange={(e) => setLastName(e.target.value)}
          value={lastName || ''}
          id="lastName"
          help={validation && validation.lastName ? validation.lastName : ''}
          error={!!(validation && validation.lastName)}
          className="mb-6"
        />
        <Input
          placeholder={t('Email')}
          onChange={(e) => setEmail(e.target.value)}
          value={email || ''}
          id="email"
          help={validation && validation.email ? validation.email : ''}
          error={!!(validation && validation.email)}
          className="mb-6"
        />

        <div className="relative">
          <Input
            placeholder={t('PPURL')}
            onChange={(e) => setPicture(e.target.value)}
            value={picture || ''}
            id="picture"
            help={validation && validation.picture ? validation.picture : ''}
            error={!!(validation && validation.picture)}
            className="mb-6 relative"
          />
          <SelectUploadsModal
            size="small"
            icon="image"
            labelPosition="left"
            className="absolute"
            style={{
              top: '25%',
              [i18n.dir() === 'ltr' ? 'right' : 'left']: '8px',
            }}
            onChange={(e) => (e.length ? setPicture(e[0].path) : '')}
          />
        </div>
        <Input
          placeholder={t('Password')}
          onChange={(e) => setPassword(e.target.value)}
          value={password || ''}
          id="password"
          type="password"
          help={validation && validation.password ? validation.password : ''}
          error={!!(validation && validation.password)}
          className="mb-6"
        />
        <Input
          placeholder={t('PasswordConfirmation')}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          value={passwordConfirmation || ''}
          id="passwordConfirmation"
          type="password"
          help={
            validation && validation.passwordConfirmation
              ? validation.passwordConfirmation
              : ''
          }
          error={!!(validation && validation.passwordConfirmation)}
          className="mb-6"
        />
      </div>
      <div className="w-2/12 px-4">
        <SaveButtons
          onSave={saveContent}
          onCancel={onCancel}
          loading={props.loading}
          message={message}
          messageType={messageType}
        />
      </div>
      <Notification notifyList={notificationList} onDismiss={onDismiss} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser,
    loading: state.shared.loading,
  }
}

export default connect(mapStateToProps)(Profile)
