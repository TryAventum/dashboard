import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loader from '../../../components/UI/Loader/Loader'

const EditUser = React.lazy(() => import('../EditUser/EditUser'))

const UserList = React.lazy(() => import('../UserList/UserList'))

const Profile = React.lazy(() => import('../Profile/Profile'))

class User extends Component {
  render() {
    return (
      <Suspense fallback={<Loader className="w-6 text-gray-400" />}>
        <Switch>
          <Route
            path="/users/new"
            render={props => <EditUser {...props} />}
          />
          <Route
            path="/users/list"
            render={props => <UserList {...props} />}
          />
          <Route
            path="/users/:user/edit"
            render={props => <EditUser {...props} />}
          />
          <Route
            path="/users/profile"
            render={props => <Profile {...props} />}
          />
        </Switch>
      </Suspense>
    )
  }
}

export default User
