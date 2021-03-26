// 

import { makeReactNativeDisklet } from 'disklet'
import { NativeModules } from 'react-native'
import { scrypt } from 'react-native-fast-crypto'
import { bridgifyObject } from 'yaob'

import { NetworkError } from '../../types/types.js'






const randomBytes = NativeModules.RNRandomBytes.randomBytes

/**
 * Turns XMLHttpRequest headers into a more JSON-like structure.
 */
function extractHeaders(headers) {
  const pairs = headers.split('\r\n')

  const out = {}
  for (const pair of pairs) {
    const index = pair.indexOf(': ')
    if (index < 0) continue
    out[pair.slice(0, index).toLowerCase()] = pair.slice(index + 2)
  }
  return out
}

/**
 * Fetches data from the React Native side, where CORS doesn't apply.
 */
function fetchCors(
  uri,
  opts = {}
) {
  const { body, headers = {}, method = 'GET' } = opts

  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest()

    // Event handlers:
    function handleError() {
      reject(new NetworkError(`Could not reach ${uri}`))
    }

    function handleLoad() {
      const headers = xhr.getAllResponseHeaders()
      resolve({
        body: xhr.response,
        headers: extractHeaders(headers == null ? '' : headers),
        status: xhr.status
      })
    }

    // Set up the request:
    xhr.open(method, uri, true)
    xhr.responseType = 'arraybuffer'
    xhr.onerror = handleError
    xhr.ontimeout = handleError
    xhr.onload = handleLoad
    for (const name of Object.keys(headers)) {
      xhr.setRequestHeader(name, headers[name])
    }
    xhr.send(body)
  })
}

export function makeClientIo() {
  return new Promise((resolve, reject) => {
    randomBytes(32, (error, base64String) => {
      if (error != null) return reject(error)

      const out = {
        // Crypto:
        entropy: base64String,
        scrypt,

        // Local IO:
        console: bridgifyObject({
          info: (...args) => console.info(...args),
          error: (...args) => console.error(...args),
          warn: (...args) => console.warn(...args)
        }),
        disklet: bridgifyObject(makeReactNativeDisklet()),

        // Networking:
        fetchCors
      }
      resolve(bridgifyObject(out))
    })
  })
}
