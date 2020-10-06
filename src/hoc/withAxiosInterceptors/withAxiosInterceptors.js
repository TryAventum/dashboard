import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../store/actions/index'

const withAxiosInterceptors = (WrappedComponent, axios) => {
  const classWithAxiosInterceptors = class extends Component {
    constructor (props) {
      super(props)
      this.resInterceptor = axios.interceptors.response.use(
        function (response) {
          return response
        },
        function (error) {
          /**
           * I made this check
           * !(['/change-email', '/change-password'].includes(props.location))
           * because the user will logged out if the user tried to change the email or
           * the password and entered incorrect password because the server's
           * error.response.status will be equal to 401
           */
          if (
            error.response.status === 401 &&
            !['/change-email', '/change-password'].includes(props.location)
          ) {
            axios.defaults.headers.common['x-access-token'] = ''
            props.logout()
          } else if (
            error.response.status === 503 ||
            error.response.status === 502
          ) {
            props.history.push('/maintenance')
          }
          return Promise.reject(error)
        }
      )
    }

    componentWillUnmount () {
      axios.interceptors.response.eject(this.resInterceptor)
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      logout: () => dispatch(actions.logout())
    }
  }

  return connect(
    null,
    mapDispatchToProps
  )(classWithAxiosInterceptors)
}

export default withAxiosInterceptors
