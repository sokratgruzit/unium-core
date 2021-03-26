const _jsxFileName = "src/react-native.js";// 

import { makeReactNativeDisklet } from 'disklet'
import React, { } from 'react'

import { parseReply } from './core/login/login-fetch.js'
import { EdgeCoreBridge } from './io/react-native/react-native-webview.js'
import {







  NetworkError
} from './types/types.js'
import { timeout } from './util/promise.js'

export { makeFakeIo } from './core/fake/fake-io.js'
export * from './types/types.js'

function onErrorDefault(e) {
  console.error(e)
}

export function MakeEdgeContext(props





) {
  const { debug, nativeIo, onError = onErrorDefault, onLoad } = props
  if (onLoad == null) {
    throw new TypeError('No onLoad passed to MakeEdgeContext')
  }
  console.log('fuck', props)

  return (
    React.createElement(EdgeCoreBridge, {
      debug: debug,
      nativeIo: nativeIo,
      onError: onError,
      onLoad: (nativeIo, root) =>
        root.makeEdgeContext(nativeIo, props.options).then(onLoad)
      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}
    )
  )
}

export function MakeFakeEdgeWorld(props





) {
  const { debug, nativeIo, onError = onErrorDefault, onLoad } = props
  if (onLoad == null) {
    throw new TypeError('No onLoad passed to MakeFakeEdgeWorld')
  }

  return (
    React.createElement(EdgeCoreBridge, {
      debug: debug,
      nativeIo: nativeIo,
      onError: onError,
      onLoad: (nativeIo, root) =>
        root.makeFakeEdgeWorld(nativeIo, props.users).then(onLoad)
      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
    )
  )
}

/**
 * Fetches any login-related messages for all the users on this device.
 */
export async function fetchLoginMessages(
  apiKey
) {
  const disklet = makeReactNativeDisklet()

  // Load the login stashes from disk:
  const loginMap = {} // loginId -> username
  const listing = await disklet.list('logins')
  const files = await Promise.all(
    Object.keys(listing)
      .filter(path => listing[path] === 'file')
      .map(path => disklet.getText(path).catch(() => '{}'))
  )
  for (const text of files) {
    try {
      const { username, loginId } = JSON.parse(text)
      if (loginId == null || username == null) continue
      loginMap[loginId] = username
    } catch (e) {}
  }

  const uri = 'https://auth.airbitz.co/api/v2/messages'
  const opts = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      authorization: `Token ${apiKey}`
    },
    body: JSON.stringify({ loginIds: Object.keys(loginMap) })
  }

  return timeout(
    window.fetch(uri, opts),
    30000,
    new NetworkError('Could not reach the auth server: timeout')
  ).then(response => {
    if (!response.ok) {
      throw new Error(`${uri} return status code ${response.status}`)
    }

    return response.json().then(json => {
      const reply = parseReply(json)
      const out = {}
      for (const message of reply) {
        const username = loginMap[message.loginId]
        if (username != null) out[username] = message
      }
      return out
    })
  })
}
