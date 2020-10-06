import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loader from '../../../components/UI/Loader/Loader'

const ExtensionList = React.lazy(() => import('../ExtensionList/ExtensionList'))

class Role extends Component {
  render() {
    return (
      <Suspense fallback={<Loader className="w-6 text-gray-400" />}>
        <Switch>
          <Route
            path="/extensions/list"
            render={props => <ExtensionList {...props} />}
          />
        </Switch>
      </Suspense>
    )
  }
}

export default Role
