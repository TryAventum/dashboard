//First thing instantiate the hooks system
import aventum from './aventum'
import axios from './axios'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import AppLoader from './components/UI/AppLoader/AppLoader'
import i18n from './i18n'

import './tailwind.css'
import 'dropzone/dist/dropzone.css'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import authReducer from './store/reducers/auth'
import contentReducer from './store/reducers/content'
import schemaReducer from './store/reducers/schema'
import userReducer from './store/reducers/user'
import fieldReducer from './store/reducers/field'
import roleReducer from './store/reducers/role'
import extensionReducer from './store/reducers/extension'
import notificationReducer from './store/reducers/notification'
import capabilityReducer from './store/reducers/capability'
import translationReducer from './store/reducers/translation'
import optionReducer from './store/reducers/option'
import sharedReducer from './store/reducers/shared'
import uploadReducer from './store/reducers/upload'
import formReducer from './store/reducers/form'

aventum.i18n = i18n

async function loadActiveExtensions() {
  let activeExtensions = []
  try {
    const response = await axios.get(`exts/active-dashboard`)

    activeExtensions = response.data

    aventum.hooks.doActionSync('getAllActiveDashboardExtensions', response)
  } catch (error) {
    console.error(error)
    aventum.hooks.doActionSync('getAllActiveDashboardExtensions', error)
  }

  //Load extensions
  if (activeExtensions.length) {
    let mustLoadedExtensions = activeExtensions.map((p) => {
      return import(
        /* webpackIgnore: true */ `${p.aventum.path
          .replace('package.json', 'index.js')
          .replace(/\\/g, '/')}`
      )
        .then((r) => p)
        .catch((e) => {
          console.error(
            `Extension ${p.name} not loaded so deactivated, make sure its files available in the dashboard/extensions folder before activating it.`
          )
          axios.patch(`exts/dashboard-not-exist`, { extension: p }).then(
            (response) => {
              aventum.hooks.doActionSync('ExtensionNotExist', response, p)
            },
            (error) => {
              aventum.hooks.doActionSync('ExtensionNotExist', error, p)
            }
          )
        })
    })
    try {
      await Promise.all(mustLoadedExtensions)
    } catch (error) {
      console.log(error)
    }
  }

  return activeExtensions
}

async function run() {
  await loadActiveExtensions()

  const composeEnhancers =
    process.env.NODE_ENV === 'development'
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
      : compose

  const rootReducer = combineReducers({
    auth: authReducer,
    content: contentReducer,
    schema: schemaReducer,
    user: userReducer,
    field: fieldReducer,
    role: roleReducer,
    notification: notificationReducer,
    extension: extensionReducer,
    capability: capabilityReducer,
    translation: translationReducer,
    option: optionReducer,
    upload: uploadReducer,
    shared: sharedReducer,
    form: formReducer,
  })

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  )

  const app = (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<AppLoader />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </Provider>
  )

  ReactDOM.render(app, document.getElementById('root'))

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.unregister()
}
run()
