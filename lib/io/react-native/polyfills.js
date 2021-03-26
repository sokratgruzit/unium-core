// 

/**
 * Object.assign
 */
function assign(out) {
  if (out == null) {
    throw new TypeError('Cannot convert undefined or null to object')
  }
  out = Object(out)

  for (let i = 1; i < arguments.length; ++i) {
    const from = arguments[i]
    if (from == null) continue

    for (const key in from) {
      if (Object.prototype.hasOwnProperty.call(from, key)) {
        out[key] = from[key]
      }
    }
  }
  return out
}

/**
 * Array.fill
 */
function fill(value, start, end) {
  const length = this.length
  function clamp(endpoint) {
    return endpoint < 0
      ? Math.max(length + endpoint, 0)
      : Math.min(endpoint, length)
  }
  const first = clamp(start != null ? start : 0)
  const last = clamp(end != null ? end : length)

  for (let i = first; i < last; ++i) {
    this[i] = value
  }
  return this
}

/**
 * Array.find
 */
function find(
  test,
  testThis
) {
  for (let i = 0; i < this.length; ++i) {
    const value = this[i]
    if (test.call(testThis, value, i, this)) {
      return value
    }
  }
}

/**
 * Array.includes
 */
function includes(target) {
  return Array.prototype.indexOf.call(this, target) >= 0
}

/**
 * Adds a non-enumerable method to an object.
 */
function safeAdd(object, name, value) {
  if (typeof object[name] !== 'function') {
    Object.defineProperty(object, name, {
      configurable: true,
      writable: true,
      value
    })
  }
}

// Perform the polyfill:
safeAdd(Object, 'assign', assign)
safeAdd(Array.prototype, 'fill', fill)
safeAdd(Array.prototype, 'find', find)
safeAdd(Array.prototype, 'includes', includes)
safeAdd(Uint8Array.prototype, 'fill', Array.prototype.fill)
