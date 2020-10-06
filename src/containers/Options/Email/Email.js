import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import OptionsLayout from '../Layout'

class EditOption extends Component {
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
                id: 'SMTP_HOST',
                label: this.props.t('SMTPHOST'),
                placeholder: 'smtp.yourdomain.com',
                name: 'SMTP_HOST',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'SMTP_FROM_NAME',
                label: this.props.t('SMTPFROMNAME'),
                placeholder: this.props.t('JohnDoe'),
                name: 'SMTP_FROM_NAME',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'SMTP_FROM_EMAIL',
                label: this.props.t('SMTPFROMEMAIL'),
                placeholder: 'noreply@example.com',
                name: 'SMTP_FROM_EMAIL',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'SMTP_REPLYTO_EMAIL',
                label: this.props.t('SMTPREPLYTOEMAIL'),
                placeholder: 'info@example.com',
                name: 'SMTP_REPLYTO_EMAIL',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'SMTP_AUTH_USERNAME',
                label: this.props.t('SMTPAUTHUSERNAME'),
                placeholder: 'noreply@example.com',
                name: 'SMTP_AUTH_USERNAME',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'SMTP_AUTH_PASSWORD',
                label: this.props.t('SMTPAUTHPASSWORD'),
                placeholder: this.props.t('YourStrongPassword'),
                name: 'SMTP_AUTH_PASSWORD',
                value: '',
                type: 'string',
                repeatable: false,
                required: true
              },
              {
                id: 'SMTP_PORT',
                label: this.props.t('SMTPPORT'),
                placeholder: '465',
                name: 'SMTP_PORT',
                value: '',
                type: 'bigInteger',
                repeatable: false,
                required: true
              },
              {
                id: 'SMTP_SECURE',
                label: this.props.t('SMTPSECURE'),
                name: 'SMTP_SECURE',
                value: false,
                type: 'boolean',
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

export default withTranslation()(EditOption)
