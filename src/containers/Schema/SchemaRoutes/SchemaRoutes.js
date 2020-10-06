import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loader from '../../../components/UI/Loader/Loader'

const EditSchema = React.lazy(() => import('../EditSchema/EditSchema'))

const SchemaList = React.lazy(() => import('../SchemaList/SchemaList'))

class Schema extends Component {
  render() {
    return (
      <Suspense fallback={<Loader className="w-6 text-gray-400" />}>
        <Switch>
          <Route
            path="/schemas/new"
            render={props => <EditSchema {...props} />}
          />
          <Route
            path="/schemas/list"
            render={props => <SchemaList {...props} />}
          />
          <Route
            path="/schemas/:schema/edit"
            render={props => <EditSchema {...props} />}
          />
        </Switch>
      </Suspense>
    )
  }
}

export default Schema
