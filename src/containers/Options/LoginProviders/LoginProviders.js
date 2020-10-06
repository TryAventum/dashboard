import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import OptionsLayout from '../Layout'
import classes from './LoginProviders.module.css'

class LoginProviders extends Component {
  render () {
    var APP_URI = this.props.options.length
      ? this.props.options.find(e => e.name === 'APP_URI').value
      : ''

    var facebookRedirectURL = APP_URI + '/users/auth/facebook/callback'
    var googleRedirectURL = APP_URI + '/users/auth/google/callback'

    return (
      <OptionsLayout
        match={this.props.match}
        location={this.props.location}
        history={this.props.history}
        sections={[
          {
            key: 1,
            label: this.props.t('FacebookLoginSettings'),
            fields: [
              {
                id: 'ENABLE_FACEBOOK_LOGIN',
                label: this.props.t('EnableFacebookLogin'),
                name: 'ENABLE_FACEBOOK_LOGIN',
                popup: (
                  <span>
                    {this.props.t('InTheFacebookApp')}
                    <code className={classes.CodeBackground}>
                      {APP_URI}
                    </code>{' '}
                    {this.props.t('AsSiteURLAnd')}{' '}
                    <code className={classes.CodeBackground}>
                      {facebookRedirectURL}
                    </code>{' '}
                    {this.props.t('AsaRedirectURL')}
                  </span>
                ),
                value: false,
                type: 'boolean',
                repeatable: false,
                required: true
              },
              {
                id: 'FACEBOOK_PROVIDER_CLIENT_ID',
                label: this.props.t('FacebookClientID'),
                placeholder: '',
                name: 'FACEBOOK_PROVIDER_CLIENT_ID',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'FACEBOOK_PROVIDER_CLIENT_SECRET',
                label: this.props.t('FacebookClientSecret'),
                placeholder: '',
                name: 'FACEBOOK_PROVIDER_CLIENT_SECRET',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              }
            ]
          },
          {
            key: 2,
            label: 'Google Login Settings',
            fields: [
              {
                id: 'ENABLE_GOOGLE_LOGIN',
                label: this.props.t('EnableGoogleLogin'),
                name: 'ENABLE_GOOGLE_LOGIN',
                popup: (
                  <span>
                    {this.props.t('InTheGoogleAppSettings')}
                    <code className={classes.CodeBackground}>
                      {APP_URI}
                    </code>{' '}
                    {this.props.t('AsSiteURLAnd')}{' '}
                    <code className={classes.CodeBackground}>
                      {googleRedirectURL}
                    </code>{' '}
                    {this.props.t('AsaRedirectURL')}
                  </span>
                ),
                value: false,
                type: 'boolean',
                repeatable: false,
                required: true
              },
              {
                id: 'GOOGLE_PROVIDER_CLIENT_ID',
                label: this.props.t('GoogleClientID'),
                placeholder: '',
                name: 'GOOGLE_PROVIDER_CLIENT_ID',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'GOOGLE_PROVIDER_CLIENT_SECRET',
                label: this.props.t('GoogleClientSecret'),
                placeholder: '',
                name: 'GOOGLE_PROVIDER_CLIENT_SECRET',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              }
            ]
          }
        ]}
        showSaveButtons={true}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    options: state.option.options
  }
}

export default connect(mapStateToProps)(withTranslation()(LoginProviders))
