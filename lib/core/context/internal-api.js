


import { Bridgeable, bridgifyObject, close, emit, update } from 'yaob'


import {


  fetchLobbyRequest,
  makeLobby,
  sendLobbyReply
} from '../login/lobby.js'
import { loginFetch } from '../login/login-fetch.js'
import { hashUsername } from '../login/login-selectors.js'

import { makeRepoPaths, syncRepo } from '../storage/repo.js'

/**
 * The requesting side of an Edge login lobby.
 * The `replies` property will update as replies come in.
 */
class EdgeLobby extends Bridgeable





 {
  
  
  
  
  

  constructor(lobby) {
    super()
    this._lobby = lobby
    this._onError = () => undefined
    this._onRepliesChanged = () => undefined
    this._replies = []

    const { unsubscribe } = lobby.subscribe(
      (reply) => {
        this._replies = [...this._replies, reply]
        update(this)
      },
      (e) => {
        emit(this, 'error', e)
      }
    )
    this._unsubscribe = unsubscribe
  }

  get lobbyId() {
    return this._lobby.lobbyId
  }

  get replies() {
    return this._replies
  }

  close() {
    this._unsubscribe()
    close(this)
  }
}

/**
 * A secret internal API which has some goodies for the CLI
 * and for unit testing.
 */
export class EdgeInternalStuff extends Bridgeable {
  

  constructor(ai) {
    super()
    this._ai = ai
  }

  authRequest(method, path, body) {
    return loginFetch(this._ai, method, path, body)
  }

  hashUsername(username) {
    return hashUsername(this._ai, username)
  }

  async makeLobby(
    lobbyRequest,
    period = 1000
  ) {
    const lobby = await makeLobby(this._ai, lobbyRequest, period)
    return new EdgeLobby(lobby)
  }

  fetchLobbyRequest(lobbyId) {
    return fetchLobbyRequest(this._ai, lobbyId)
  }

  async sendLobbyReply(
    lobbyId,
    lobbyRequest,
    replyData
  ) {
    await sendLobbyReply(this._ai, lobbyId, lobbyRequest, replyData)
  }

  async syncRepo(syncKey) {
    const { io, log } = this._ai.props
    const paths = makeRepoPaths(io, syncKey, new Uint8Array(0))
    return syncRepo(io, log, paths, { lastSync: 0, lastHash: undefined })
  }

  async getRepoDisklet(
    syncKey,
    dataKey
  ) {
    const { io } = this._ai.props
    const paths = makeRepoPaths(io, syncKey, dataKey)
    bridgifyObject(paths.disklet)
    return paths.disklet
  }
}

/**
 * Our public Flow types don't include the internal stuff,
 * so this function hacks around Flow to retrieve it.
 */
export function getInternalStuff(context) {
  const flowHack = context
  return flowHack.$internalStuff
}
