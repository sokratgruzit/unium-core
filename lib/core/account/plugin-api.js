// 

import { Bridgeable, bridgifyObject } from 'yaob'









import { getCurrencyTools } from '../plugins/plugins-selectors.js'

import {
  changePluginUserSettings,
  changeSwapSettings
} from './account-files.js'

/**
 * Access to an individual currency plugin's methods.
 */
export class CurrencyConfig extends Bridgeable {
  
  
  

  

  constructor(ai, accountId, pluginId) {
    super()
    this._ai = ai
    this._accountId = accountId
    this._pluginId = pluginId

    const { otherMethods } = ai.props.state.plugins.currency[pluginId]
    if (otherMethods != null) {
      bridgifyObject(otherMethods)
      this.otherMethods = otherMethods
    } else {
      this.otherMethods = {}
    }
  }

  get currencyInfo() {
    return this._ai.props.state.plugins.currency[this._pluginId].currencyInfo
  }

  get userSettings() {
    const selfState = this._ai.props.state.accounts[this._accountId]
    return selfState.userSettings[this._pluginId]
  }

  async changeUserSettings(settings) {
    await changePluginUserSettings(
      this._ai,
      this._accountId,
      this._pluginId,
      settings
    )
  }

  async importKey(userInput) {
    const tools = await getCurrencyTools(this._ai, this.currencyInfo.walletType)

    if (tools.importPrivateKey == null) {
      throw new Error('This wallet does not support importing keys')
    }
    return tools.importPrivateKey(userInput)
  }
}

export class SwapConfig extends Bridgeable {
  
  
  

  constructor(ai, accountId, pluginId) {
    super()
    this._ai = ai
    this._accountId = accountId
    this._pluginId = pluginId
  }

  get enabled() {
    const { swapSettings } = this._ai.props.state.accounts[this._accountId]
    const { enabled = true } =
      swapSettings[this._pluginId] != null ? swapSettings[this._pluginId] : {}
    return enabled
  }

  get needsActivation() {
    const plugin = this._ai.props.state.plugins.swap[this._pluginId]
    if (plugin.checkSettings == null) return false

    const selfState = this._ai.props.state.accounts[this._accountId]
    const settings = selfState.userSettings[this._pluginId] || {}
    return !!plugin.checkSettings(settings).needsActivation
  }

  get swapInfo() {
    return this._ai.props.state.plugins.swap[this._pluginId].swapInfo
  }

  get userSettings() {
    const selfState = this._ai.props.state.accounts[this._accountId]
    return selfState.userSettings[this._pluginId]
  }

  async changeEnabled(enabled) {
    const account = this._ai.props.state.accounts[this._accountId]
    return changeSwapSettings(this._ai, this._accountId, this._pluginId, {
      ...account.swapSettings[this._pluginId],
      enabled
    })
  }

  async changeUserSettings(settings) {
    await changePluginUserSettings(
      this._ai,
      this._accountId,
      this._pluginId,
      settings
    )
  }
}
