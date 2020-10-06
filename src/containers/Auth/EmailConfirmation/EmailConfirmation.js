import React, { Component } from 'react'
import { connect } from 'react-redux'
import aventum from '../../../aventum'
import { withTranslation } from 'react-i18next'

import * as actions from '../../../store/actions/index'

export class EmailConfirmation extends Component {
  state = {
    error: false,
    success: false
  }

  redirectAfter(time = 3000) {
    setTimeout(() => {
      if (this.props.isAuthenticated) {
        this.props.history.push('/')
      } else {
        this.props.history.push('/login')
      }
    }, time)
  }

  emailConfirmationSubscription = response => {
    if (response.status === 200) {
      this.setState({
        error: false,
        success: true
      })

      let updatedCurrentUser = { ...this.props.currentUser }

      updatedCurrentUser.emailConfirmation = true

      this.props.updateCurrentUser(updatedCurrentUser)

      this.redirectAfter()
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
    aventum.hooks.addAction(
      'emailConfirmation',
      'Aventum/core/EmailConfirmation/DidMount',
      this.emailConfirmationSubscription
    )

    if (this.props.match.params.token) {
      this.props.emailConfirmation({
        token: this.props.match.params.token
      })
    }
  }

  componentWillUnmount() {
    aventum.hooks.removeAction(
      'emailConfirmation',
      'Aventum/core/EmailConfirmation/DidMount'
    )
  }

  render() {
    return (
      <div
        className={`flex flex-col items-center justify-center h-screen`}
      >
        <img
          className={`w-64`}
          src="/logo.svg"
          alt={this.props.t('AventumLogo')}
        />
        <h2 className={`text-gray-600 mt-2`}>
          {this.props.loading && this.props.t('Verifying')}
          {this.state.success && this.props.t('Success')}
          {this.state.error && this.props.t('Fail')}
        </h2>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.shared.loading,
    isAuthenticated: state.auth.token !== null,
    currentUser: state.auth.currentUser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    emailConfirmation: payload => dispatch(actions.emailConfirmation(payload)),
    updateCurrentUser: payload => dispatch(actions.updateCurrentUser(payload))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(EmailConfirmation))
