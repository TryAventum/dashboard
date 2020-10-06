import React, { Component, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import * as actions from '../../store/actions/index'
import Loader from '../../components/UI/Loader/Loader'
import "react-datepicker/dist/react-datepicker.css"
import '../../react-datepicker'

// import classes from './Layout.module.css'
import MainMenu from '../../components/UI/MainMenu/MainMenu'
import SideBar from '../../components/UI/SideBar/SideBar'

const Dashboard = React.lazy(() =>
  import('../../containers/Dashboard/Dashboard')
)
const SchemaRoutes = React.lazy(() =>
  import('../../containers/Schema/SchemaRoutes/SchemaRoutes')
)

const UserRoutes = React.lazy(() =>
  import('../../containers/Users/UserRoutes/UserRoutes')
)

const RoleRoutes = React.lazy(() =>
  import('../../containers/Roles/RoleRoutes/RoleRoutes')
)

const ExtensionRoutes = React.lazy(() =>
  import('../../containers/Extensions/ExtensionRoutes/ExtensionRoutes')
)

const Translation = React.lazy(() =>
  import('../../containers/Translation/Translation')
)

const CapabilityRoutes = React.lazy(() =>
  import('../../containers/Capabilities/CapabilityRoutes/CapabilityRoutes')
)

const OptionRoutes = React.lazy(() =>
  import('../../containers/Options/OptionRoutes/OptionRoutes')
)

const ContentRoutes = React.lazy(() =>
  import('../../containers/Content/ContentRoutes/ContentRoutes')
)

const FieldRoutes = React.lazy(() =>
  import('../../containers/Fields/FieldRoutes/FieldRoutes')
)

const Uploads = React.lazy(() => import('../../containers/Uploads/Uploads'))

class Layout extends Component {
  constructor(props) {
    super(props)

    if (!props.isAuthenticated && !props.loading) {
      props.history.push('/login')
    }
  }

  componentDidMount() {
    this.props.getFields()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.isAuthenticated && !nextProps.loading) {
      nextProps.history.push('/login')
      return false
    }
    return true
  }

  render() {
    return (
      <div className={`flex flex-col h-screen relative bg-cool-gray-100`}>
        <MainMenu />
        <div className="flex flex-1 justify-center">
          <SideBar {...this.props} />
          <div className="w-full flex flex-col max-w-screen-lg">
            <div className="pt-16 px-10 pb-12 flex-1">
              <Suspense fallback={<Loader className="w-6 text-gray-400" />}>
                <Switch>
                  <Route
                    path="/"
                    exact
                    render={props => <Dashboard {...props} />}
                  />
                  <Route
                    path="/contents"
                    render={props => <ContentRoutes {...props} />}
                  />
                  <Route
                    path="/schemas"
                    render={props => <SchemaRoutes {...props} />}
                  />
                  <Route
                    path="/users"
                    render={props => <UserRoutes {...props} />}
                  />
                  <Route
                    path="/roles"
                    render={props => <RoleRoutes {...props} />}
                  />
                  <Route
                    path="/capabilities"
                    render={props => <CapabilityRoutes {...props} />}
                  />
                  <Route
                    path="/options"
                    render={props => <OptionRoutes {...props} />}
                  />
                  <Route
                    path="/fields"
                    render={props => <FieldRoutes {...props} />}
                  />
                  <Route
                    path="/uploads"
                    render={props => <Uploads {...props} />}
                  />
                  <Route
                    path="/extensions"
                    render={props => <ExtensionRoutes {...props} />}
                  />
                  <Route
                    path="/translation"
                    render={props => <Translation {...props} />}
                  />
                </Switch>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    loading: state.shared.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getFields: () => dispatch(actions.getFields())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Layout))
