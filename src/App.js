import aventum from './aventum'
import React, { Component, Suspense } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import * as actions from './store/actions/index'
import './App.css'
import withAxiosInterceptors from './hoc/withAxiosInterceptors/withAxiosInterceptors'
import axios from './axios'
import Loader from './components/UI/Loader/Loader'
import { Helmet } from 'react-helmet'

const RegisterForm = React.lazy(() =>
  import('./containers/Auth/RegisterForm/RegisterForm')
)
const RestPasswordForm = React.lazy(() =>
  import('./containers/Auth/RestPasswordForm/RestPasswordForm')
)
const LoginForm = React.lazy(() =>
  import('./containers/Auth/LoginForm/LoginForm')
)
const ProviderLogin = React.lazy(() =>
  import('./containers/Auth/ProviderLogin/ProviderLogin')
)
const EmailConfirmation = React.lazy(() =>
  import('./containers/Auth/EmailConfirmation/EmailConfirmation')
)
const ForgetPasswordForm = React.lazy(() =>
  import('./containers/Auth/ForgetPasswordForm/ForgetPasswordForm')
)
const Layout = React.lazy(() => import('./hoc/Layout/Layout'))

class App extends Component {
  /**
   * App component state.
   *
   * @hook
   * @name AppState
   * @type applyFiltersSync
   * @since 1.0.0
   *
   * @param {Object} state The state.
   * @param {Object} $this The App component.
   */
  state = aventum.hooks.applyFiltersSync(
    'AppState',
    {
      dashboardNotExistMessage: '',
      fetchingCurrentUser: true,
      loadingOptions: true,
      loadingAllRoles: true
    },
    this
  )

  authCheckStateSubscription = response => {
    if (response.status === 200) {
      this.setState(
        (state, props) => {
          return { fetchingCurrentUser: false }
        },
        () => {
          this.props.getAllRoles()
          this.props.getOptions()
        }
      )
    } else {
      this.setState({
        fetchingCurrentUser: false,
        loadingAllRoles: false,
        loadingOptions: false
      })
    }
  }

  getAllRolesSubscription = response => {
    this.setState({ loadingAllRoles: false })
    // if (response.status === 200) {
    //   this.props.getAllRoles()
    //   this.props.getOptions()
    // }
  }

  getOptionsSubscription = response => {
    this.setState({ loadingOptions: false })
    // if (response.status === 200) {
    //   this.props.getAllRoles()
    //   this.props.getOptions()
    // }
  }

  onChangeLanguage = lng => {
    window.location.reload()
  }

  componentDidMount() {
    /**
     * App component just mount.
     *
     * @hook
     * @name AppDidMount
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The App component.
     */
    aventum.hooks.doActionSync('AppDidMount', this)
    this.props.i18n.on('languageChanged', this.onChangeLanguage)
    this.props.getAllActiveDashboardExtensions()
    this.props.authCheckState()
    aventum.hooks.addAction(
      'authCheckState',
      'Aventum/core/App/DidMount',
      this.authCheckStateSubscription
    )

    aventum.hooks.addAction(
      'signUp',
      'Aventum/core/App/DidMount',
      this.authCheckStateSubscription
    )

    aventum.hooks.addAction(
      'signIn',
      'Aventum/core/App/DidMount',
      this.authCheckStateSubscription
    )

    aventum.hooks.addAction(
      'providerLogin',
      'Aventum/core/App/DidMount',
      this.authCheckStateSubscription
    )

    aventum.hooks.addAction(
      'getAllRoles',
      'Aventum/core/App/DidMount',
      this.getAllRolesSubscription
    )

    aventum.hooks.addAction(
      'getOptions',
      'Aventum/core/App/DidMount',
      this.getOptionsSubscription
    )

    this.props.getAllTranslations()
  }

  setTranslations = () => {
    let resourceBundles = this.props.translations.reduce(
      (acc, cur) => {
        acc.ar[cur.key] = cur.ar
        acc.en[cur.key] = cur.en

        return acc
      },
      { ar: {}, en: {} }
    )
    this.props.i18n.addResourceBundle('ar', 'translation', resourceBundles.ar)
    this.props.i18n.addResourceBundle('en', 'translation', resourceBundles.en)
  }

  componentWillUnmount() {
    /**
     * App component will unmount.
     *
     * @hook
     * @name AppWillUnmount
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The App component.
     */
    aventum.hooks.doActionSync('AppWillUnmount', this)
    this.props.i18n.off('languageChanged', this.onChangeLanguage)
    aventum.hooks.removeAction('authCheckState', 'Aventum/core/App/DidMount')
    aventum.hooks.removeAction('signIn', 'Aventum/core/App/DidMount')
    aventum.hooks.removeAction('signUp', 'Aventum/core/App/DidMount')
    aventum.hooks.removeAction('providerLogin', 'Aventum/core/App/DidMount')
    aventum.hooks.removeAction('getAllRoles', 'Aventum/core/App/DidMount')
    aventum.hooks.removeAction('getOptions', 'Aventum/core/App/DidMount')
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    /**
     * The App component updated.
     *
     * @hook
     * @name AppDidUpdate
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} prevProps App component previous props.
     * @param {Object} prevState App component previous state.
     * @param {*} snapshot See [componentDidUpdate](https://reactjs.org/docs/react-component.html#componentdidupdate).
     */
    aventum.hooks.doActionSync(
      'AppDidUpdate',
      prevProps,
      prevState,
      snapshot,
      this
    )

    if (prevProps.translations.length !== this.props.translations.length) {
      this.setTranslations()
    }
  }

  render() {
    /**
     * Fire at the beginning of the render function of the App component.
     *
     * @hook
     * @name AppBeforeRender
     * @type doActionSync
     * @since 1.0.0
     *
     * @param {Object} $this The App component.
     */
    aventum.hooks.doActionSync('AppBeforeRender', this)

    var renderResult = null
    if (
      !this.state.fetchingCurrentUser &&
      !this.state.loadingOptions &&
      !this.state.loadingAllRoles
    ) {

      let htmlAttributes = {
        lang: this.props.i18n.language,
        dir: this.props.i18n.dir()
      }
      /**
       * The HTML attributes for the Helmet component in the App component.
       *
       * @hook
       * @name HelmetAppHtmlAttributes
       * @type applyFiltersSync
       * @since 1.0.0
       *
       * @param {Object} htmlAttributes The HTML attributes object that will be passed to htmlAttributes property
       *                                of the Helmet component.
       * @param {Object} $this The App component.
       */
      htmlAttributes = aventum.hooks.applyFiltersSync(
        'HelmetAppHtmlAttributes',
        htmlAttributes,
        this
      )

      let fallback = <Loader className="w-6 text-gray-400" />
      /**
       * The fallback of the suspense of the App component.
       *
       * @hook
       * @name AppSuspenseFallback
       * @type applyFiltersSync
       * @since 1.0.0
       *
       * @param {Object} fallback The fallback
       * @param {Object} $this The App component.
       */
      fallback = aventum.hooks.applyFiltersSync(
        'AppSuspenseFallback',
        fallback,
        this
      )

      let routes = [
        <Route
          key="/setup"
          path="/setup"
          render={props => <RegisterForm {...props} />}
        />,
        <Route
          path="/register"
          key="/register"
          render={props => <RegisterForm {...props} />}
        />,
        <Route
          path="/reset-password/:token"
          key="/reset-password/:token"
          render={props => <RestPasswordForm {...props} />}
        />,
        <Route
          key="/login/:provider/:token"
          path="/login/:provider/:token"
          render={props => <ProviderLogin {...props} />}
        />,
        <Route
          key="/email-confirmation/:token"
          path="/email-confirmation/:token"
          render={props => <EmailConfirmation {...props} />}
        />,
        <Route
          key="/login"
          path="/login"
          render={props => <LoginForm {...props} />}
        />,
        <Route
          key="/forgot-password"
          path="/forgot-password"
          render={props => <ForgetPasswordForm {...props} />}
        />,
        <Route key="/" path="/" render={props => <Layout {...props} />} />
      ]
      /**
       * The routes in the App component
       *
       * @hook
       * @name AppRoutes
       * @type applyFiltersSync
       * @since 1.0.0
       *
       * @param {Route[]} routes Array of routes from react-router-dom package
       * @param {Object} $this The App component.
       */
      routes = aventum.hooks.applyFiltersSync('AppRoutes', routes, this)

      renderResult = (
        <>
          <Helmet htmlAttributes={htmlAttributes} />
          <Suspense fallback={fallback}>
            <Switch>{routes}</Switch>
          </Suspense>
        </>
      )
    }

    /**
     * What the App component will render(return from the App render method)
     *
     * @hook
     * @name AppRenderComponents
     * @type applyFiltersSync
     * @since 1.0.0
     *
     * @param {Object} renderResult The final result from the render function that will be rendered.
     * @param {Object} $this The App component
     */
    renderResult = aventum.hooks.applyFiltersSync(
      'AppRenderComponents',
      renderResult,
      this
    )

    return renderResult
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    loading: state.shared.loading,
    translations: state.translation.translations,
    options: state.option.options
  }
}

const mapDispatchToProps = dispatch => {
  return {
    authCheckState: () => dispatch(actions.authCheckState()),
    getAllRoles: () => dispatch(actions.getAllRoles()),
    getAllActiveDashboardExtensions: () =>
      dispatch(actions.getAllActiveDashboardExtensions()),
    getOptions: () => dispatch(actions.getOptions()),
    getAllTranslations: () => dispatch(actions.getAllTranslations())
  }
}

export default withRouter(
  withAxiosInterceptors(
    connect(mapStateToProps, mapDispatchToProps)(withTranslation()(App)),
    axios
  )
)
