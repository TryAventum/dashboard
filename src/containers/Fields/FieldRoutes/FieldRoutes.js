import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loader from '../../../components/UI/Loader/Loader'

const EditField = React.lazy(() => import('../EditField/EditField'))
const FieldList = React.lazy(() => import('../FieldList/FieldList'))

class Field extends Component {
  render() {
    return (
      <Suspense fallback={<Loader className="w-6 text-gray-400" />}>
        <Switch>
          <Route
            path="/fields/new"
            render={props => <EditField {...props} />}
          />
          <Route
            path="/fields/list"
            render={props => <FieldList {...props} />}
          />
          <Route
            path="/fields/:field/edit"
            render={props => <EditField {...props} />}
          />
        </Switch>
      </Suspense>
    )
  }
}

export default Field
