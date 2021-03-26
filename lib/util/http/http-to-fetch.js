







import { utf8 } from '../encoding.js'







// The specific server type `makeFetch` expects:






/**
 * Wraps a simple request / response function in the fetch API.
 */
export function makeFetch(server) {
  return function fetch(
    uri,
    opts = {}
  ) {
    try {
      const { body = new ArrayBuffer(0), method = 'GET', headers = {} } = opts

      const request = {
        method,
        path: uri.replace(new RegExp('https?://[^/]*'), ''),
        version: 'HTTP/1.1',
        headers,
        body: typeof body === 'string' ? getArrayBuffer(utf8.parse(body)) : body
      }
      return server(request).then(makeFetchResponse)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

/**
 * Turns a simple response into a fetch-style Response object.
 */
export function makeFetchResponse(response) {
  const { body = '', headers = {}, status = 200 } = response
  // Use a promise wrapper to make all exceptions async:
  const bodyPromise = Promise.resolve(body)

  const out = {
    headers: makeFetchHeaders(headers),
    ok: status >= 200 && status < 300,
    status,

    arrayBuffer() {
      return bodyPromise.then(body =>
        typeof body === 'string' ? utf8.parse(body).buffer : body
      )
    },

    json() {
      return out.text().then(text => JSON.parse(text))
    },

    text() {
      return bodyPromise.then(body =>
        typeof body === 'string' ? body : utf8.stringify(new Uint8Array(body))
      )
    }
  }
  return out
}

/**
 * Turns a simple key-value map into a fetch-style Headers object.
 */
function makeFetchHeaders(headers) {
  const out = {
    forEach(callback, thisArg) {
      Object.keys(headers).forEach(name =>
        callback.call(thisArg, headers[name], name, out)
      )
    },

    get(name) {
      if (!out.has(name)) return null
      return headers[name]
    },

    has(name) {
      return Object.prototype.hasOwnProperty.call(headers, name)
    }
  }
  return out
}

/**
 * Grabs the ArrayBuffer backing a TypedArray, making a copy if needed.
 */
function getArrayBuffer(view) {
  return view.byteOffset === 0 && view.byteLength === view.buffer.byteLength
    ? view.buffer
    : view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength)
}
