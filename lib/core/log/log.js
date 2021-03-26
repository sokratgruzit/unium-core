






import { addHiddenProperties } from '../../util/util.js'










function makeLogMethod(
  io,
  type,
  sender
) {
  return function log() {
    let message = ''
    for (let i = 0; i < arguments.length; ++i) {
      const arg = arguments[i]
      if (i > 0) message += ' '
      message += typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
    }

    const entry = { type, time: new Date(), sender, message }
    const prettyDate = entry.time
      .toISOString()
      .replace(/.*(\d\d-\d\d)T(\d\d:\d\d:\d\d).*/, '$1 $2')
    io.console.info(`${prettyDate} ${entry.sender}: ${entry.message}`)
  }
}

export function makeLog(io, sender) {
  return addHiddenProperties(makeLogMethod(io, 'info', sender), {
    warn: makeLogMethod(io, 'warn', sender),
    error: makeLogMethod(io, 'error', sender)
  })
}
