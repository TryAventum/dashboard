import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import * as actions from '../../../store/actions/index'
import aventum from '../../../aventum'
// import classes from './ProviderLogin.module.css'

export class ProviderLogin extends Component {
  state = {
    error: false,
    success: false
  }

  redirectAfter(to = '/login', time = 3000) {
    setTimeout(() => {
      this.props.history.push(to)
    }, time)
  }

  signInSubscription = response => {
    if (response.status === 200) {
      this.setState({
        error: false,
        success: true
      })

      this.redirectAfter('/')
    } else if (response.status === 429) {
      this.setState({
        error: true,
        success: false
      })

      this.redirectAfter()
    } else {
      this.setState({
        error: true,
        success: false
      })

      this.redirectAfter()
    }
  }

  componentDidMount() {
    // console.log(this.props.match.params)
    aventum.hooks.addAction(
      'providerLogin',
      'Aventum/core/ProviderLogin/DidMount',
      this.signInSubscription
    )

    if (this.props.match.params.token && this.props.match.params.provider) {
      this.props.providerLogin({
        token: this.props.match.params.token,
        provider: this.props.match.params.provider
      })
    }
  }

  componentWillUnmount() {
    aventum.hooks.removeAction(
      'providerLogin',
      'Aventum/core/ProviderLogin/DidMount'
    )
  }

  render() {
    return (
      <div
        className={`flex h-screen flex-col justify-center items-center`}
      >
        <img
          className={`w-64`}
          src="/logo.svg"
          alt={this.props.t('AventumLogo')}
        />
        <h2 className={`text-gray-600 mt-2`}>
          {this.props.loading && this.props.t('messages.LoggingIn')}
          {this.state.success && this.props.t('error.YouJustLoggedIn')}
          {this.state.error && this.props.t('error.ProviderLoginNotSuccess')}
        </h2>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.shared.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    providerLogin: payload => dispatch(actions.providerLogin(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ProviderLogin))
