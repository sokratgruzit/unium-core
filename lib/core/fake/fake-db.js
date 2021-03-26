



import { filterObject } from '../../util/util.js'


























































// The database just includes these fields:
const loginDbColumns = [
  // Identity:
  'appId',
  'loginId',
  // Login methods:
  'loginAuth',
  'loginAuthBox',
  'passwordAuth',
  'passwordAuthBox',
  'passwordAuthSnrp',
  'passwordBox',
  'passwordKeySnrp',
  'pin2Auth',
  'pin2Box',
  'pin2Id',
  'pin2KeyBox',
  'pin2TextBox',
  'recovery2Auth',
  'recovery2Box',
  'recovery2Id',
  'recovery2KeyBox',
  'question2Box',
  'otpKey',
  'otpResetDate',
  'otpTimeout',
  // Resources:
  'keyBoxes',
  'mnemonicBox',
  'parentBox',
  'rootKeyBox',
  'syncKeyBox',
  // Legacy:
  'pinBox',
  'pinId',
  'pinKeyBox'
]

// The v2 account creation endpoint doesn't accept legacy keys:
export const loginCreateColumns = loginDbColumns.filter(
  item => ['mnemonicBox', 'rootKeyBox', 'syncKeyBox'].indexOf(item) < 0
)

/**
 * Emulates the Airbitz login server database.
 */
export class FakeDb {
  
  
  

  constructor() {
    this.lobbies = {}
    this.logins = []
    this.repos = {}
  }

  getLoginById(loginId) {
    return this.logins.find(login => login.loginId === loginId)
  }

  getLoginByPin2Id(pin2Id) {
    return this.logins.find(login => login.pin2Id === pin2Id)
  }

  getLoginByRecovery2Id(recovery2Id) {
    return this.logins.find(login => login.recovery2Id === recovery2Id)
  }

  getLoginsByParent(parent) {
    return this.logins.filter(child => child.parent === parent.loginId)
  }

  insertLogin(login) {
    this.logins.push(login)
  }

  // Dumping & restoration --------------------------------------------

  setupFakeLogin(user, parent) {
    // Fill in the database row for this login:
    const row = filterObject(user, loginDbColumns)
    row.parent = parent
    this.insertLogin(row)

    // Recurse into our children:
    if (user.children != null) {
      for (const child of user.children) {
        this.setupFakeLogin(child, user.loginId)
      }
    }
  }

  setupFakeUser(user) {
    this.setupFakeLogin(user.server, undefined)

    // Create fake repos:
    for (const syncKey of Object.keys(user.repos)) {
      this.repos[syncKey] = { ...user.repos[syncKey] }
    }
  }

  dumpLogin(login) {
    const out = filterObject(login, loginDbColumns)
    out.children = this.getLoginsByParent(login).map(child =>
      this.dumpLogin(child)
    )
    return out
  }
}

/**
 * Recursively builds up a login reply tree,
 * which the server sends back in response to a v2 login request.
 */
export function makeLoginReply(db, login) {
  const children = db
    .getLoginsByParent(login)
    .map(child => makeLoginReply(db, child))

  return {
    // Identity:
    appId: login.appId,
    loginId: login.loginId,
    parentBox: login.parentBox,

    // Login methods:
    loginAuthBox: login.loginAuthBox,
    passwordAuthBox: login.passwordAuthBox,
    passwordAuthSnrp: login.passwordAuthSnrp,
    passwordBox: login.passwordBox,
    passwordKeySnrp: login.passwordKeySnrp,
    pin2Box: login.pin2Box,
    pin2KeyBox: login.pin2KeyBox,
    pin2TextBox: login.pin2TextBox,
    question2Box: login.question2Box,
    recovery2Box: login.recovery2Box,
    recovery2KeyBox: login.recovery2KeyBox,
    otpKey: login.otpKey,
    otpResetDate: login.otpResetDate,
    otpTimeout: login.otpTimeout,

    // Resources:
    keyBoxes: login.keyBoxes,
    mnemonicBox: login.mnemonicBox,
    rootKeyBox: login.rootKeyBox,
    syncKeyBox: login.syncKeyBox,
    children
  }
}
