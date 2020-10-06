import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loader from '../../../components/UI/Loader/Loader'

const ContentEdit = React.lazy(() => import('../ContentEdit/ContentEdit'))
const ContentList = React.lazy(() => import('../ContentList/ContentList'))

class Content extends Component {
  render() {
    return (
      <Suspense fallback={<Loader className="w-6 text-gray-400" />}>
        <Switch>
          <Route
            path="/contents/:content/new"
            render={props => <ContentEdit {...props} />}
          />
          <Route
            path="/contents/:content/:id/edit"
            render={props => <ContentEdit {...props} />}
          />
          <Route
            path="/contents/:content/list"
            render={props => <ContentList {...props} />}
          />
        </Switch>
      </Suspense>
    )
  }
}

export default Content
