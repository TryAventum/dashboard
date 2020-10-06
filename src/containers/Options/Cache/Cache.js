import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import OptionsLayout from '../Layout'

class CacheOptions extends Component {
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
                id: 'flushAllCache',
                label: this.props.t('FlushAllCache'),
                placeholder: this.props.t('FlushAllCache'),
                successMessageHeader: this.props.t('CacClearSucc'),
                name: 'flushAllCache',
                value: '',
                type: 'Button',
                repeatable: false,
                method: 'get',
                url: 'options/flushAllCache',
                required: true
              }
            ]
          }
        ]}
      />
    )
  }
}

export default withTranslation()(CacheOptions)
