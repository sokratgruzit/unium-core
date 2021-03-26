import { EdgeSwapInfo } from './types';
export declare const errorNames: {
    DustSpendError: string;
    InsufficientFundsError: string;
    SpendToSelfError: string;
    NetworkError: string;
    ObsoleteApiError: string;
    OtpError: string;
    PasswordError: string;
    PendingFundsError: string;
    SameCurrencyError: string;
    SwapAboveLimitError: string;
    SwapBelowLimitError: string;
    SwapCurrencyError: string;
    SwapPermissionError: string;
    UsernameError: string;
    NoAmountSpecifiedError: string;
};
/**
 * Trying to spend an uneconomically small amount of money.
 */
export declare class DustSpendError extends Error {
    name: string;
    constructor(message?: string);
}
/**
 * Trying to spend more money than the wallet contains.
 */
export declare class InsufficientFundsError extends Error {
    name: string;
    readonly currencyCode: string | undefined;
    constructor(currencyCode?: string);
}
/**
 * Trying to spend to an address of the source wallet
 */
export declare class SpendToSelfError extends Error {
    name: string;
    constructor(message?: string);
}
/**
 * Attempting to create a MakeSpend without specifying an amount of currency to send
 */
export declare class NoAmountSpecifiedError extends Error {
    name: string;
    constructor(message?: string);
}
/**
 * Could not reach the server at all.
 */
export declare class NetworkError extends Error {
    name: string;
    readonly type: string;
    constructor(message?: string);
}
/**
 * The endpoint on the server is obsolete, and the app needs to be upgraded.
 */
export declare class ObsoleteApiError extends Error {
    name: string;
    readonly type: string;
    constructor(message?: string);
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
export declare class OtpError extends Error {
    name: string;
    readonly type: string;
    readonly resetToken: string | undefined;
    readonly resetDate: Date | undefined;
    constructor(resultsJson: any, message?: string);
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
export declare class PasswordError extends Error {
    name: string;
    readonly type: string;
    readonly wait: number | undefined;
    constructor(resultsJson: any, message?: string);
}
/**
 * Trying to spend funds that are not yet confirmed.
 */
export declare class PendingFundsError extends Error {
    name: string;
    constructor(message?: string);
}
/**
 * Attempting to shape shift between two wallets of same currency.
 */
export declare class SameCurrencyError extends Error {
    name: string;
    constructor(message?: string);
}
/**
 * Trying to swap an amount that is either too low or too high.
 * @param nativeMax the maximum supported amount, in the "from" currency.
 */
export declare class SwapAboveLimitError extends Error {
    name: string;
    readonly pluginId: string;
    readonly nativeMax: string;
    constructor(swapInfo: EdgeSwapInfo, nativeMax: string);
}
/**
 * Trying to swap an amount that is either too low or too high.
 * @param nativeMin the minimum supported amount, in the "from" currency.
 */
export declare class SwapBelowLimitError extends Error {
    name: string;
    readonly pluginId: string;
    readonly nativeMin: string;
    constructor(swapInfo: EdgeSwapInfo, nativeMin: string);
}
/**
 * The swap plugin does not support this currency pair.
 */
export declare class SwapCurrencyError extends Error {
    name: string;
    readonly pluginId: string;
    readonly fromCurrency: string;
    readonly toCurrency: string;
    constructor(swapInfo: EdgeSwapInfo, fromCurrency: string, toCurrency: string);
}
declare type SwapPermissionReason = 'geoRestriction' | 'noVerification' | 'needsActivation';
/**
 * The user is not allowed to swap these coins for some reason
 * (no KYC, restricted IP address, etc...).
 * @param reason A string giving the reason for the denial.
 * - 'geoRestriction': The IP address is in a restricted region
 * - 'noVerification': The user needs to provide KYC credentials
 * - 'needsActivation': The user needs to log into the service.
 */
export declare class SwapPermissionError extends Error {
    name: string;
    readonly pluginId: string;
    readonly reason: SwapPermissionReason | undefined;
    constructor(swapInfo: EdgeSwapInfo, reason?: SwapPermissionReason);
}
/**
 * Cannot find a login with that id.
 *
 * Reasons could include:
 * - Password login: wrong username
 * - PIN login: wrong PIN key
 * - Recovery login: wrong username, or wrong recovery key
 */
export declare class UsernameError extends Error {
    name: string;
    readonly type: string;
    constructor(message?: string);
}
export {};
