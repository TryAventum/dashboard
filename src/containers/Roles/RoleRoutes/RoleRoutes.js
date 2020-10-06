import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loader from '../../../components/UI/Loader/Loader'

const EditRole = React.lazy(() => import('../EditRole/EditRole'))

const RoleList = React.lazy(() => import('../RoleList/RoleList'))

class Role extends Component {
  render() {
    return (
      <Suspense fallback={<Loader className="w-6 text-gray-400" />}>
        <Switch>
          <Route
            path="/roles/new"
            render={props => <EditRole {...props} />}
          />
          <Route
            path="/roles/list"
            render={props => <RoleList {...props} />}
          />
          <Route
            path="/roles/:role/edit"
            render={props => <EditRole {...props} />}
          />
        </Switch>
      </Suspense>
    )
  }
}

export default Role
