import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loader from '../../../components/UI/Loader/Loader'

const General = React.lazy(() => import('../General/General'))
const Email = React.lazy(() => import('../Email/Email'))
const Cache = React.lazy(() => import('../Cache/Cache'))
const LoginProviders = React.lazy(() => import('../LoginProviders/LoginProviders'))

class Option extends Component {
  render() {
    return (
      <Suspense fallback={<Loader className="w-6 text-gray-400" />}>
        <Switch>
          <Route
            path="/options/general"
            render={props => <General {...props} />}
          />
          <Route
            path="/options/email"
            render={props => <Email {...props} />}
          />
          <Route
            path="/options/cache"
            render={props => <Cache {...props} />}
          />
          <Route
            path="/options/login-providers"
            render={props => <LoginProviders {...props} />}
          />
        </Switch>
      </Suspense>
    )
  }
}

export default Option
