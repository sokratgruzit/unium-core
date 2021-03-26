"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DustSpendError = DustSpendError;
exports.InsufficientFundsError = InsufficientFundsError;
exports.SpendToSelfError = SpendToSelfError;
exports.NoAmountSpecifiedError = NoAmountSpecifiedError;
exports.NetworkError = NetworkError;
exports.ObsoleteApiError = ObsoleteApiError;
exports.OtpError = OtpError;
exports.PasswordError = PasswordError;
exports.PendingFundsError = PendingFundsError;
exports.SameCurrencyError = SameCurrencyError;
exports.SwapAboveLimitError = SwapAboveLimitError;
exports.SwapBelowLimitError = SwapBelowLimitError;
exports.SwapCurrencyError = SwapCurrencyError;
exports.SwapPermissionError = SwapPermissionError;
exports.UsernameError = UsernameError;
exports.errorNames = void 0;

/*
 * These are errors the core knows about.
 *
 * The GUI should handle these errors in an "intelligent" way, such as by
 * displaying a localized error message or asking the user for more info.
 * All these errors have a `name` field, which the GUI can use to select
 * the appropriate response.
 *
 * Other errors are possible, of course, since the Javascript language
 * itself can generate exceptions. Those errors won't have a `type` field,
 * and the GUI should just show them with a stack trace & generic message,
 * since the program has basically crashed at that point.
 */
const errorNames = {
  DustSpendError: 'DustSpendError',
  InsufficientFundsError: 'InsufficientFundsError',
  SpendToSelfError: 'SpendToSelfError',
  NetworkError: 'NetworkError',
  ObsoleteApiError: 'ObsoleteApiError',
  OtpError: 'OtpError',
  PasswordError: 'PasswordError',
  PendingFundsError: 'PendingFundsError',
  SameCurrencyError: 'SameCurrencyError',
  SwapAboveLimitError: 'SwapAboveLimitError',
  SwapBelowLimitError: 'SwapBelowLimitError',
  SwapCurrencyError: 'SwapCurrencyError',
  SwapPermissionError: 'SwapPermissionError',
  UsernameError: 'UsernameError',
  NoAmountSpecifiedError: 'NoAmountSpecifiedError'
};
/**
 * Trying to spend an uneconomically small amount of money.
 */

exports.errorNames = errorNames;

function DustSpendError(message = 'Please send a larger amount') {
  if (!(this instanceof DustSpendError)) throw new TypeError("Class constructor DustSpendError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = errorNames.DustSpendError;
  return _this;
}
/**
 * Trying to spend more money than the wallet contains.
 */


function InsufficientFundsError(currencyCode) {
  if (!(this instanceof InsufficientFundsError)) throw new TypeError("Class constructor InsufficientFundsError cannot be invoked without 'new'");

  var _this;

  let message;

  if (currencyCode == null) {
    message = 'Insufficient funds';
  } else if (currencyCode.length > 5) {
    // Some plugins pass a message instead of a currency code:
    message = currencyCode;
    currencyCode = undefined;
  } else {
    message = `Insufficient ${currencyCode}`;
  }

  _this = new Error(message);
  _this.name = errorNames.InsufficientFundsError;
  if (currencyCode != null) _this.currencyCode = currencyCode;
  return _this;
}
/**
 * Trying to spend to an address of the source wallet
 */


function SpendToSelfError(message = 'Spending to self') {
  if (!(this instanceof SpendToSelfError)) throw new TypeError("Class constructor SpendToSelfError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = errorNames.SpendToSelfError;
  return _this;
}
/**
 * Attempting to create a MakeSpend without specifying an amount of currency to send
 */


function NoAmountSpecifiedError(message = 'Unable to create zero-amount transaction.') {
  if (!(this instanceof NoAmountSpecifiedError)) throw new TypeError("Class constructor NoAmountSpecifiedError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = errorNames.NoAmountSpecifiedError;
  return _this;
}
/**
 * Could not reach the server at all.
 */


function NetworkError(message = 'Cannot reach the network') {
  if (!(this instanceof NetworkError)) throw new TypeError("Class constructor NetworkError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = _this.type = errorNames.NetworkError;
  return _this;
}
/**
 * The endpoint on the server is obsolete, and the app needs to be upgraded.
 */


function ObsoleteApiError(message = 'The application is too old. Please upgrade.') {
  if (!(this instanceof ObsoleteApiError)) throw new TypeError("Class constructor ObsoleteApiError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = _this.type = errorNames.ObsoleteApiError;
  return _this;
}
/**
 * The OTP token was missing / incorrect.
 *
 * The error object should include a `resetToken` member,
 * which can be used to reset OTP protection on the account.
 *
 * The error object may include a `resetDate` member,
 * which indicates that an OTP reset is already pending,
 * and when it will complete.
 */


function OtpError(resultsJson, message = 'Invalid OTP token') {
  if (!(this instanceof OtpError)) throw new TypeError("Class constructor OtpError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = _this.type = errorNames.OtpError;

  if (resultsJson != null) {
    if (typeof resultsJson.otp_reset_auth === 'string') {
      _this.resetToken = resultsJson.otp_reset_auth;
    } // The server returns dates as ISO 8601 formatted strings:


    if (typeof resultsJson.otp_timeout_date === 'string') {
      _this.resetDate = new Date(resultsJson.otp_timeout_date);
    }
  }

  return _this;
}
/**
 * The provided authentication is incorrect.
 *
 * Reasons could include:
 * - Password login: wrong password
 * - PIN login: wrong PIN
 * - Recovery login: wrong answers
 *
 * The error object may include a `wait` member,
 * which is the number of seconds the user must wait before trying again.
 */


function PasswordError(resultsJson, message = 'Invalid password') {
  if (!(this instanceof PasswordError)) throw new TypeError("Class constructor PasswordError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = _this.type = errorNames.PasswordError;

  if (resultsJson != null && typeof resultsJson.wait_seconds === 'number') {
    _this.wait = resultsJson.wait_seconds;
  }

  return _this;
}
/**
 * Trying to spend funds that are not yet confirmed.
 */


function PendingFundsError(message = 'Not enough confirmed funds') {
  if (!(this instanceof PendingFundsError)) throw new TypeError("Class constructor PendingFundsError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = errorNames.PendingFundsError;
  return _this;
}
/**
 * Attempting to shape shift between two wallets of same currency.
 */


function SameCurrencyError(message = 'Wallets can not be the same currency') {
  if (!(this instanceof SameCurrencyError)) throw new TypeError("Class constructor SameCurrencyError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = errorNames.SameCurrencyError;
  return _this;
}
/**
 * Trying to swap an amount that is either too low or too high.
 * @param nativeMax the maximum supported amount, in the "from" currency.
 */


function SwapAboveLimitError(swapInfo, nativeMax) {
  if (!(this instanceof SwapAboveLimitError)) throw new TypeError("Class constructor SwapAboveLimitError cannot be invoked without 'new'");

  var _this;

  _this = new Error('Amount is too high');
  _this.name = errorNames.SwapAboveLimitError;
  _this.pluginId = swapInfo.pluginId;
  _this.nativeMax = nativeMax;
  return _this;
}
/**
 * Trying to swap an amount that is either too low or too high.
 * @param nativeMin the minimum supported amount, in the "from" currency.
 */


function SwapBelowLimitError(swapInfo, nativeMin) {
  if (!(this instanceof SwapBelowLimitError)) throw new TypeError("Class constructor SwapBelowLimitError cannot be invoked without 'new'");

  var _this;

  _this = new Error('Amount is too low');
  _this.name = errorNames.SwapBelowLimitError;
  _this.pluginId = swapInfo.pluginId;
  _this.nativeMin = nativeMin;
  return _this;
}
/**
 * The swap plugin does not support this currency pair.
 */


function SwapCurrencyError(swapInfo, fromCurrency, toCurrency) {
  if (!(this instanceof SwapCurrencyError)) throw new TypeError("Class constructor SwapCurrencyError cannot be invoked without 'new'");

  var _this;

  _this = new Error(`${swapInfo.displayName} does not support ${fromCurrency} to ${toCurrency}`);
  _this.name = errorNames.SwapCurrencyError;
  _this.pluginId = swapInfo.pluginId;
  _this.fromCurrency = fromCurrency;
  _this.toCurrency = toCurrency;
  return _this;
}

/**
 * The user is not allowed to swap these coins for some reason
 * (no KYC, restricted IP address, etc...).
 * @param reason A string giving the reason for the denial.
 * - 'geoRestriction': The IP address is in a restricted region
 * - 'noVerification': The user needs to provide KYC credentials
 * - 'needsActivation': The user needs to log into the service.
 */
function SwapPermissionError(swapInfo, reason) {
  if (!(this instanceof SwapPermissionError)) throw new TypeError("Class constructor SwapPermissionError cannot be invoked without 'new'");

  var _this;

  if (reason != null) _this = new Error(reason);else _this = new Error('You are not allowed to make this trade');
  _this.name = errorNames.SwapPermissionError;
  _this.pluginId = swapInfo.pluginId;
  _this.reason = reason;
  return _this;
}
/**
 * Cannot find a login with that id.
 *
 * Reasons could include:
 * - Password login: wrong username
 * - PIN login: wrong PIN key
 * - Recovery login: wrong username, or wrong recovery key
 */


function UsernameError(message = 'Invalid username') {
  if (!(this instanceof UsernameError)) throw new TypeError("Class constructor UsernameError cannot be invoked without 'new'");

  var _this;

  _this = new Error(message);
  _this.name = _this.type = errorNames.UsernameError;
  return _this;
}