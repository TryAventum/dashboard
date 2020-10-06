import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loader from '../../../components/UI/Loader/Loader'

const EditCapability = React.lazy(() => import('../EditCapability/EditCapability'))

const CapabilityList = React.lazy(() => import('../CapabilityList/CapabilityList'))

class Capability extends Component {
  render() {
    return (
      <Suspense fallback={<Loader className="w-6 text-gray-400" />}>
        <Switch>
          <Route
            path="/capabilities/new"
            render={props => <EditCapability {...props} />}
          />
          <Route
            path="/capabilities/list"
            render={props => <CapabilityList {...props} />}
          />
          <Route
            path="/capabilities/:capability/edit"
            render={props => <EditCapability {...props} />}
          />
        </Switch>
      </Suspense>
    )
  }
}

export default Capability
