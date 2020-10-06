import * as AventumHooks from '@aventum/hooks'
import React from 'react'
import * as ReactRouterDom from 'react-router-dom'
import pjs from '../package.json'

window.aventum = {}
window.aventum.db = {}
window.aventum.version = pjs.version
window.aventum.hooks = AventumHooks.createHooks()

window.React = React
window.aventum.router = {}

for (const propr in ReactRouterDom) {
  window.aventum.router[propr] = ReactRouterDom[propr]
}

export default window.aventum
