import React, { useState, useEffect, useMemo } from 'react'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'
import Joi from '@hapi/joi'
import { connect, useDispatch } from 'react-redux'
import { withTranslation } from 'react-i18next'
import * as actions from '../../../store/actions/index'
// import aventum from '../../../aventum'
import { arrayUniqueByID, validate } from '../../../shared/utility'
import SaveButtons from '../../../components/UI/SaveButtons/SaveButtons'
import Notification from '../../../components/UI/Notification/Notification'
import Input from '../../../components/UI/Input/Input'
import Dropdown from '../../../components/UI/Dropdown/Dropdown'
import { useNotification } from '../../../shared/react-hooks'

const EditUser = (props) => {
  const schemaShape = {
    firstName: Joi.string()
      .required()
      .messages({
        'string.empty': props.t('error.fnir'),
        'any.required': props.t('error.fnir'),
      }),
    lastName: Joi.string()
      .required()
      .messages({
        'string.empty': props.t('error.lnir'),
        'any.required': props.t('error.lnir'),
      }),
    email: Joi.string()
      .email({ tlds: { allow: false }, minDomainSegments: 2 })
      .required()
      .messages({
        'string.empty': props.t('email', { context: 'isEmpty' }),
        'string.email': props.t('email', { context: 'isEmail' }),
        'any.required': props.t('email', { context: 'isEmpty' }),
      }),
  }

  if (!props.match.params.user) {
    schemaShape.password = Joi.string()
      .required()
      .min(6)
      .max(30)
      .messages({
        'string.empty': props.t('PasswordIsRequired'),
        'string.min': props.t('error.IncorrectPasswordLength'),
        'string.max': props.t('error.IncorrectPasswordLength'),
        'any.required': props.t('PasswordIsRequired'),
      })
  } else {
    schemaShape.password = Joi.string()
      .min(6)
      .max(30)
      .messages({
        'string.empty': props.t('PasswordIsRequired'),
        'string.min': props.t('error.IncorrectPasswordLength'),
        'string.max': props.t('error.IncorrectPasswordLength'),
        'any.required': props.t('PasswordIsRequired'),
      })
  }

  schemaShape.passwordConfirmation = Joi.when('password', {
    is: Joi.exist(),
    then: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'string.empty': props.t('error.PasswordConfirmationRequired'),
        'any.only': props.t('error.PasswordConfirmationNotMatch'),
        'any.required': props.t('error.PasswordConfirmationRequired'),
      }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': props.t('error.putpff'),
    }),
  })

  const schema = Joi.object(schemaShape)

  const [submitted, setSubmitted] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [messageType, setMessageType] = useState('')
  const [message, setMessage] = useState('')
  const [roles, setRoles] = useState([])
  const [capabilities, setCapabilities] = useState([])

  const { notificationList, addNotification, onDismiss } = useNotification()
  const dispatch = useDispatch()

  const resetState = () => {
    setSubmitted(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setPasswordConfirmation('')
    setMessage('')
    setMessageType('')
    setRoles([])
    setCapabilities([])
  }

  useEffect(() => {
    return () => {
      props.resetCurrentUserValues()
    }
  }, [])

  useEffect(() => {
    if (!props.match.params.user) {
      resetState()
      props.resetCurrentUserValues()
    }

    if (props.match.params.user) {
      props.getCurrentUser(props.match.params.user)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.user])

  useEffect(() => {
    if (props.currentUserValues.firstName && !firstName) {
      setFirstName(props.currentUserValues.firstName)
      setLastName(props.currentUserValues.lastName)
      setEmail(props.currentUserValues.email)
      setCapabilities(props.currentUserValues.capabilities)
      setRoles(props.currentUserValues.roles)
    }
  }, [firstName, props.currentUserValues])

  const onCancel = (event) => {
    props.history.push('/users/list')
  }

  const values = pickBy(
    {
      firstName,
      lastName,
      email,
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
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
        capabilities: capabilities,
        roles: roles,
      }

      if (!props.match.params.user) {
        result = dispatch(actions.saveUser(form))
      } else {
        result = dispatch(
          actions.updateUser({ id: props.match.params.user, form })
        )
      }

      addNotification(result, {
        successHeader: props.t('messages.DataSavedSuccessfully'),
      })
    }
  }

  // if the form has been submitted at least once then check validity every time we render
  const validation = submitted
    ? validate(schema, values, [
        'firstName',
        'lastName',
        'email',
        'password',
        'passwordConfirmation',
      ])
    : {}

  const cc = arrayUniqueByID(
    props.roles.reduce(
      (accumulator, currentValue) => [
        ...accumulator,
        ...currentValue.capabilities,
      ],
      []
    )
  ).map((c) => {
    return { label: c.name, value: c.id }
  })

  const cr = props.roles.map((r) => {
    return { label: r.name, value: r.id }
  })

  const rolesDropdown = useMemo(() => {
    return (
      <Dropdown
        onChange={(e, d) => setRoles(d.value)}
        value={roles}
        placeholder={props.t('Roles')}
        multiple
        search
        clearable
        options={cr}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles])

  const capabilitiesDropdown = useMemo(() => {
    return (
      <Dropdown
        onChange={(e, d) => setCapabilities(d.value)}
        value={capabilities}
        placeholder={props.t('Capabilities')}
        className="mb-6"
        multiple
        clearable
        search
        options={cc}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capabilities])

  return (
    <div className="flex">
      <div className="w-5/6 px-4">
        <Input
          placeholder={props.t('fn')}
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName || ''}
          id="firstName"
          help={validation && validation.firstName ? validation.firstName : ''}
          error={!!(validation && validation.firstName)}
          className="mb-6"
        />
        <Input
          placeholder={props.t('ln')}
          onChange={(e) => setLastName(e.target.value)}
          value={lastName || ''}
          id="lastName"
          help={validation && validation.lastName ? validation.lastName : ''}
          error={!!(validation && validation.lastName)}
          className="mb-6"
        />
        <Input
          placeholder={props.t('Email')}
          onChange={(e) => setEmail(e.target.value)}
          value={email || ''}
          id="email"
          help={validation && validation.email ? validation.email : ''}
          error={!!(validation && validation.email)}
          className="mb-6"
        />
        <Input
          placeholder={props.t('Password')}
          onChange={(e) => setPassword(e.target.value)}
          value={password || ''}
          id="password"
          type="password"
          help={validation && validation.password ? validation.password : ''}
          error={!!(validation && validation.password)}
          className="mb-6"
        />
        <Input
          placeholder={props.t('PasswordConfirmation')}
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
        {capabilitiesDropdown}
        {rolesDropdown}
      </div>
      <div className="w-2/12 px-4">
        <SaveButtons
          onSave={saveContent}
          onCancel={onCancel}
          loading={props.saving}
        />
      </div>
      <Notification notifyList={notificationList} onDismiss={onDismiss} />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    loading: state.user.loadingUsers,
    users: state.user.users,
    currentUserValues: state.user.currentUserValues,
    roles: state.role.roles,
    saving: state.shared.loading,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCurrentUser: (payload) => dispatch(actions.getCurrentUser(payload)),
    resetCurrentUserValues: (payload) =>
      dispatch(actions.resetCurrentUserValues()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(EditUser))
