import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import OptionsLayout from '../Layout'

class GeneralOption extends Component {
  render () {
    return (
      <OptionsLayout
        match={this.props.match}
        location={this.props.location}
        history={this.props.history}
        sections={[
          {
            key: 1,
            fields: [
              {
                id: 'DEFAULT_ROLE',
                label: this.props.t('DefaultRole'),
                placeholder: 'subscriber',
                name: 'DEFAULT_ROLE',
                popup: this.props.t('TheNewRegisteredUserRole'),
                value: '',
                type: 'select',
                clearable: false,
                options: this.props.roles.map(e => {
                  return { label: e.label, value: e.name }
                }),
                repeatable: false,
                required: true
              },
              {
                id: 'BUSINESS_NAME',
                label: this.props.t('BusinessName'),
                placeholder: '',
                name: 'BUSINESS_NAME',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'ENABLE_REGISTRATION',
                label: this.props.t('EnableRegistration'),
                name: 'ENABLE_REGISTRATION',
                value: false,
                type: 'boolean',
                repeatable: false,
                required: true
              },
              {
                id: 'APP_URI',
                label: this.props.t('BackendAppURI'),
                placeholder: 'http://localhost:3030',
                name: 'APP_URI',
                popup: this.props.t('BackendAppURI'),
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'FRONTEND_URL',
                label: this.props.t('FrontendAppURI'),
                placeholder: 'http://localhost:3030',
                name: 'FRONTEND_URL',
                popup: this.props.t('FrontendAppURIPop'),
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'JWT_SECRET',
                label: this.props.t('JSONWebTokenSecret'),
                placeholder: '',
                name: 'JWT_SECRET',
                popup: this.props.t('JSONWebTokenSecretPop'),
                value: '',
                type: 'password',
                repeatable: false,
                required: true
              },
              {
                id: 'UPLOADS_PUBLIC_PATH',
                label: this.props.t('UploadsPublicPath'),
                placeholder: 'public/content/uploads/',
                name: 'UPLOADS_PUBLIC_PATH',
                popup: this.props.t('UploadsPublicPathPop'),
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'UPLOADS_PUBLIC_URL',
                label: this.props.t('UploadsPublicURL'),
                placeholder: 'http://localhost:3030',
                name: 'UPLOADS_PUBLIC_URL',
                popup: this.props.t('UploadsPublicURLPop'),
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'DASHBOARD_ABS_PATH',
                label: this.props.t('DashboardAbsolutePath'),
                placeholder: '/path/to/folder',
                name: 'DASHBOARD_ABS_PATH',
                popup: this.props.t('DashboardAbsolutePathPop'),
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
    roles: state.role.roles
  }
}

export default connect(mapStateToProps)(withTranslation()(GeneralOption))
