import { Disklet } from 'disklet';
import { Subscriber } from 'yaob';
export { DustSpendError, errorNames, InsufficientFundsError, SpendToSelfError, NetworkError, NoAmountSpecifiedError, ObsoleteApiError, OtpError, PasswordError, PendingFundsError, SameCurrencyError, SwapAboveLimitError, SwapBelowLimitError, SwapCurrencyError, SwapPermissionError, UsernameError } from './error';
/** A JSON object (as opposed to an array or primitive). */
export interface JsonObject {
    [name: string]: any;
}
/** A collection of unknown extra methods exposed by a plugin. */
export interface EdgeOtherMethods {
    readonly [name: string]: any;
}
/** We frequently index things by pluginId, so provide a helper. */
export interface EdgePluginMap<Value> {
    [pluginId: string]: Value;
}
export declare type EdgeRandomFunction = (bytes: number) => Uint8Array;
export declare type EdgeScryptFunction = (data: Uint8Array, salt: Uint8Array, n: number, r: number, p: number, dklen: number) => Promise<Uint8Array>;
/**
 * The subset of the `fetch` options we guarantee to support.
 */
export interface EdgeFetchOptions {
    method?: string;
    body?: ArrayBuffer | string;
    headers?: {
        [header: string]: string;
    };
}
/**
 * The subset of the `Headers` DOM object we guarantee to support.
 */
export interface EdgeFetchHeaders {
    forEach(callback: (value: string, name: string, self: EdgeFetchHeaders) => void, thisArg?: any): void;
    get(name: string): string | null;
    has(name: string): boolean;
}
/**
 * The subset of the `Response` DOM object we guarantee to support.
 */
export interface EdgeFetchResponse {
    readonly headers: EdgeFetchHeaders;
    readonly ok: boolean;
    readonly status: number;
    arrayBuffer(): Promise<ArrayBuffer>;
    json(): Promise<any>;
    text(): Promise<string>;
}
/**
 * The subset of the `fetch` DOM function we guarantee to support,
 * especially if we have to emulate `fetch` in weird environments.
 */
export declare type EdgeFetchFunction = (uri: string, opts?: EdgeFetchOptions) => Promise<EdgeFetchResponse>;
/**
 * Access to platform-specific resources.
 * The core never talks to the outside world on its own,
 * but always goes through this object.
 */
export interface EdgeIo {
    readonly random: EdgeRandomFunction;
    readonly scrypt: EdgeScryptFunction;
    readonly disklet: Disklet;
    readonly fetch: EdgeFetchFunction;
    readonly fetchCors?: EdgeFetchFunction;
    readonly console: EdgeConsole;
}
export declare type EdgeLogMethod = (...args: any[]) => void;
/**
 * Logs a message. Call `log(message)` for normal information messages,
 * or `log.warn(message)` / `log.error(message)` for something more severe.
 */
export declare type EdgeLog = EdgeLogMethod & {
    readonly warn: EdgeLogMethod;
    readonly error: EdgeLogMethod;
};
/**
 * On React Native, each plugin can provide a bridge to whatever native
 * io it needs.
 */
export interface EdgeNativeIo {
    [packageName: string]: EdgeOtherMethods;
}
/**
 * All core plugins receive these options at creation time.
 */
export interface EdgeCorePluginOptions {
    initOptions: JsonObject;
    io: EdgeIo;
    log: EdgeLog;
    nativeIo: EdgeNativeIo;
    pluginDisklet: Disklet;
}
export interface EdgeWalletInfo {
    id: string;
    type: string;
    keys: JsonObject;
}
export declare type EdgeWalletInfoFull = EdgeWalletInfo & {
    appIds: string[];
    archived: boolean;
    deleted: boolean;
    hidden: boolean;
    sortIndex: number;
};
export interface EdgeWalletState {
    archived?: boolean;
    deleted?: boolean;
    hidden?: boolean;
    sortIndex?: number;
}
export interface EdgeWalletStates {
    [walletId: string]: EdgeWalletState;
}
export interface EdgeDenomination {
    name: string;
    multiplier: string;
    symbol?: string;
}
export interface EdgeMetaToken {
    currencyCode: string;
    currencyName: string;
    denominations: EdgeDenomination[];
    contractAddress?: string;
    symbolImage?: string;
}
declare type EdgeObjectTemplate = Array<{
    type: 'nativeAmount';
    key: string;
    displayName: string;
    displayMultiplier: string;
} | {
    type: 'number';
    key: string;
    displayName: string;
} | {
    type: 'string';
    key: string;
    displayName: string;
}>;
export interface EdgeCurrencyInfo {
    readonly pluginId: string;
    displayName: string;
    walletType: string;
    currencyCode: string;
    denominations: EdgeDenomination[];
    canAdjustFees?: boolean;
    canImportKeys?: boolean;
    customFeeTemplate?: EdgeObjectTemplate;
    customTokenTemplate?: EdgeObjectTemplate;
    requiredConfirmations?: number;
    defaultSettings: JsonObject;
    metaTokens: EdgeMetaToken[];
    addressExplorer: string;
    blockExplorer?: string;
    transactionExplorer: string;
    xpubExplorer?: string;
    symbolImage?: string;
    symbolImageDarkMono?: string;
}
export interface EdgeMetadata {
    bizId?: number;
    category?: string;
    exchangeAmount?: {
        [fiatCurrencyCode: string]: number;
    };
    name?: string;
    notes?: string;
    amountFiat?: number;
    miscJson?: string;
}
export interface EdgeNetworkFee {
    readonly currencyCode: string;
    readonly nativeAmount: string;
}
export interface EdgeTxSwap {
    orderId?: string;
    orderUri?: string;
    isEstimate: boolean;
    plugin: {
        pluginId: string;
        displayName: string;
        supportEmail?: string;
    };
    payoutAddress: string;
    payoutCurrencyCode: string;
    payoutNativeAmount: string;
    payoutWalletId: string;
    refundAddress?: string;
}
export interface EdgeTransaction {
    currencyCode: string;
    nativeAmount: string;
    networkFee: string;
    parentNetworkFee?: string;
    blockHeight: number;
    date: number;
    txid: string;
    signedTx: string;
    ourReceiveAddresses: string[];
    metadata?: EdgeMetadata;
    spendTargets?: Array<{
        readonly currencyCode: string;
        readonly nativeAmount: string;
        readonly publicAddress: string;
        readonly uniqueIdentifier?: string;
    }>;
    txSecret?: string;
    swapData?: EdgeTxSwap;
    wallet?: EdgeCurrencyWallet;
    otherParams?: JsonObject;
}
export interface EdgeSpendTarget {
    nativeAmount?: string;
    publicAddress?: string;
    uniqueIdentifier?: string;
    otherParams?: JsonObject;
}
export interface EdgePaymentProtocolInfo {
    domain: string;
    memo: string;
    merchant: string;
    nativeAmount: string;
    spendTargets: EdgeSpendTarget[];
}
export interface EdgeSpendInfo {
    currencyCode?: string;
    privateKeys?: string[];
    spendTargets: EdgeSpendTarget[];
    noUnconfirmed?: boolean;
    networkFeeOption?: string;
    customNetworkFee?: JsonObject;
    metadata?: EdgeMetadata;
    swapData?: EdgeTxSwap;
    otherParams?: JsonObject;
}
export interface EdgeDataDump {
    walletId: string;
    walletType: string;
    data: {
        [dataCache: string]: JsonObject;
    };
}
export interface EdgeFreshAddress {
    publicAddress: string;
    segwitAddress?: string;
    legacyAddress?: string;
}
export interface EdgeTokenInfo {
    currencyCode: string;
    currencyName: string;
    contractAddress: string;
    multiplier: string;
}
export interface EdgeTxidMap {
    [txid: string]: number;
}
export interface EdgeParsedUri {
    token?: EdgeMetaToken;
    privateKeys?: string[];
    publicAddress?: string;
    legacyAddress?: string;
    segwitAddress?: string;
    nativeAmount?: string;
    currencyCode?: string;
    metadata?: EdgeMetadata;
    bitIDURI?: string;
    bitIDDomain?: string;
    bitIDCallbackUri?: string;
    paymentProtocolUrl?: string;
    returnUri?: string;
    uniqueIdentifier?: string;
    bitidPaymentAddress?: string;
    bitidKycProvider?: string;
    bitidKycRequest?: string;
}
export interface EdgeEncodeUri {
    publicAddress: string;
    segwitAddress?: string;
    legacyAddress?: string;
    nativeAmount?: string;
    label?: string;
    message?: string;
    currencyCode?: string;
}
export interface EdgeCurrencyCodeOptions {
    currencyCode?: string;
}
export interface EdgeGetTransactionsOptions {
    currencyCode?: string;
    startIndex?: number;
    startEntries?: number;
    startDate?: number;
    endDate?: number;
    searchString?: string;
    returnIndex?: number;
    returnEntries?: number;
    denomination?: string;
}
export interface EdgeCurrencyEngineCallbacks {
    readonly onBlockHeightChanged: (blockHeight: number) => void;
    readonly onTransactionsChanged: (transactions: EdgeTransaction[]) => void;
    readonly onBalanceChanged: (currencyCode: string, nativeBalance: string) => void;
    readonly onAddressesChecked: (progressRatio: number) => void;
    readonly onTxidsChanged: (txids: EdgeTxidMap) => void;
}
export interface EdgeCurrencyEngineOptions {
    callbacks: EdgeCurrencyEngineCallbacks;
    log: EdgeLog;
    walletLocalDisklet: Disklet;
    walletLocalEncryptedDisklet: Disklet;
    userSettings: JsonObject | undefined;
}
export interface EdgeCurrencyEngine {
    changeUserSettings(settings: JsonObject): Promise<unknown>;
    getDisplayPrivateSeed(): string | null;
    getDisplayPublicSeed(): string | null;
    startEngine(): Promise<unknown>;
    killEngine(): Promise<unknown>;
    resyncBlockchain(): Promise<unknown>;
    dumpData(): EdgeDataDump;
    getBlockHeight(): number;
    getBalance(opts: EdgeCurrencyCodeOptions): string;
    getNumTransactions(opts: EdgeCurrencyCodeOptions): number;
    getTransactions(opts: EdgeGetTransactionsOptions): Promise<EdgeTransaction[]>;
    getTxids?: () => EdgeTxidMap;
    enableTokens(tokens: string[]): Promise<unknown>;
    disableTokens(tokens: string[]): Promise<unknown>;
    getEnabledTokens(): Promise<string[]>;
    addCustomToken(token: EdgeTokenInfo): Promise<unknown>;
    getTokenStatus(token: string): boolean;
    getFreshAddress(opts: EdgeCurrencyCodeOptions): EdgeFreshAddress;
    addGapLimitAddresses(addresses: string[]): void;
    isAddressUsed(address: string): boolean;
    makeSpend(spendInfo: EdgeSpendInfo): Promise<EdgeTransaction>;
    signTx(transaction: EdgeTransaction): Promise<EdgeTransaction>;
    broadcastTx(transaction: EdgeTransaction): Promise<EdgeTransaction>;
    saveTx(transaction: EdgeTransaction): Promise<unknown>;
    readonly sweepPrivateKeys?: (spendInfo: EdgeSpendInfo) => Promise<EdgeTransaction>;
    readonly getPaymentProtocolInfo?: (paymentProtocolUrl: string) => Promise<EdgePaymentProtocolInfo>;
    readonly otherMethods?: EdgeOtherMethods;
}
export interface EdgeCurrencyTools {
    readonly importPrivateKey?: (key: string, opts?: JsonObject) => Promise<JsonObject>;
    createPrivateKey(walletType: string, opts?: JsonObject): Promise<JsonObject>;
    derivePublicKey(walletInfo: EdgeWalletInfo): Promise<JsonObject>;
    readonly getSplittableTypes?: (walletInfo: EdgeWalletInfo) => string[];
    parseUri(uri: string, currencyCode?: string, customTokens?: EdgeMetaToken[]): Promise<EdgeParsedUri>;
    encodeUri(obj: EdgeEncodeUri, customTokens?: EdgeMetaToken[]): Promise<string>;
}
export interface EdgeCurrencyPlugin {
    readonly currencyInfo: EdgeCurrencyInfo;
    makeCurrencyTools(): Promise<EdgeCurrencyTools>;
    makeCurrencyEngine(walletInfo: EdgeWalletInfo, opts: EdgeCurrencyEngineOptions): Promise<EdgeCurrencyEngine>;
    readonly otherMethods?: EdgeOtherMethods;
}
export interface EdgeBalances {
    [currencyCode: string]: string;
}
export declare type EdgeReceiveAddress = EdgeFreshAddress & {
    metadata: EdgeMetadata;
    nativeAmount: string;
};
export interface EdgeCurrencyWalletEvents {
    close: void;
    newTransactions: EdgeTransaction[];
    transactionsChanged: EdgeTransaction[];
}
export interface EdgeCurrencyWallet {
    readonly on: Subscriber<EdgeCurrencyWalletEvents>;
    readonly watch: Subscriber<EdgeCurrencyWallet>;
    readonly id: string;
    readonly keys: JsonObject;
    readonly type: string;
    readonly publicWalletInfo: EdgeWalletInfo;
    readonly disklet: Disklet;
    readonly localDisklet: Disklet;
    sync(): Promise<void>;
    readonly displayPrivateSeed: string | null;
    readonly displayPublicSeed: string | null;
    readonly name: string | null;
    renameWallet(name: string): Promise<void>;
    readonly fiatCurrencyCode: string;
    setFiatCurrencyCode(fiatCurrencyCode: string): Promise<void>;
    readonly currencyInfo: EdgeCurrencyInfo;
    nativeToDenomination(nativeAmount: string, currencyCode: string): Promise<string>;
    denominationToNative(denominatedAmount: string, currencyCode: string): Promise<string>;
    readonly balances: EdgeBalances;
    readonly blockHeight: number;
    readonly syncRatio: number;
    startEngine(): Promise<void>;
    stopEngine(): Promise<void>;
    changeEnabledTokens(currencyCodes: string[]): Promise<void>;
    enableTokens(tokens: string[]): Promise<void>;
    disableTokens(tokens: string[]): Promise<void>;
    getEnabledTokens(): Promise<string[]>;
    addCustomToken(token: EdgeTokenInfo): Promise<void>;
    getNumTransactions(opts?: EdgeCurrencyCodeOptions): Promise<number>;
    getTransactions(opts?: EdgeGetTransactionsOptions): Promise<EdgeTransaction[]>;
    getReceiveAddress(opts?: EdgeCurrencyCodeOptions): Promise<EdgeReceiveAddress>;
    saveReceiveAddress(receiveAddress: EdgeReceiveAddress): Promise<void>;
    lockReceiveAddress(receiveAddress: EdgeReceiveAddress): Promise<void>;
    makeSpend(spendInfo: EdgeSpendInfo): Promise<EdgeTransaction>;
    signTx(tx: EdgeTransaction): Promise<EdgeTransaction>;
    broadcastTx(tx: EdgeTransaction): Promise<EdgeTransaction>;
    saveTx(tx: EdgeTransaction): Promise<void>;
    sweepPrivateKeys(edgeSpendInfo: EdgeSpendInfo): Promise<EdgeTransaction>;
    saveTxMetadata(txid: string, currencyCode: string, metadata: EdgeMetadata): Promise<void>;
    getMaxSpendable(spendInfo: EdgeSpendInfo): Promise<string>;
    getPaymentProtocolInfo(paymentProtocolUrl: string): Promise<EdgePaymentProtocolInfo>;
    resyncBlockchain(): Promise<void>;
    dumpData(): Promise<EdgeDataDump>;
    getDisplayPrivateSeed(): string | null;
    getDisplayPublicSeed(): string | null;
    exportTransactionsToQBO(opts: EdgeGetTransactionsOptions): Promise<string>;
    exportTransactionsToCSV(opts: EdgeGetTransactionsOptions): Promise<string>;
    parseUri(uri: string, currencyCode?: string): Promise<EdgeParsedUri>;
    encodeUri(obj: EdgeEncodeUri): Promise<string>;
    readonly otherMethods: EdgeOtherMethods;
    getBalance(opts?: EdgeCurrencyCodeOptions): string;
    getBlockHeight(): number;
}
/**
 * Static data about a swap plugin.
 */
export interface EdgeSwapInfo {
    readonly pluginId: string;
    readonly displayName: string;
    readonly orderUri?: string;
    readonly supportEmail: string;
}
export interface EdgeSwapRequest {
    fromWallet: EdgeCurrencyWallet;
    toWallet: EdgeCurrencyWallet;
    fromCurrencyCode: string;
    toCurrencyCode: string;
    nativeAmount: string;
    quoteFor: 'from' | 'to';
}
/**
 * If the user approves a quote, the plugin performs the transaction
 * and returns this as the result.
 */
export interface EdgeSwapResult {
    readonly orderId?: string;
    readonly destinationAddress?: string;
    readonly transaction: EdgeTransaction;
}
/**
 * If a provider can satisfy a request, what is their price?
 */
export interface EdgeSwapQuote {
    readonly isEstimate: boolean;
    readonly fromNativeAmount: string;
    readonly toNativeAmount: string;
    readonly networkFee: EdgeNetworkFee;
    readonly pluginId: string;
    readonly expirationDate?: Date;
    approve(): Promise<EdgeSwapResult>;
    close(): Promise<void>;
}
export interface EdgeSwapPluginStatus {
    needsActivation?: boolean;
}
export interface EdgeSwapPlugin {
    readonly swapInfo: EdgeSwapInfo;
    checkSettings?: (userSettings: JsonObject) => EdgeSwapPluginStatus;
    fetchSwapQuote(request: EdgeSwapRequest, userSettings: JsonObject | undefined, opts: {
        promoCode?: string;
    }): Promise<EdgeSwapQuote>;
}
export interface EdgeRateHint {
    fromCurrency: string;
    toCurrency: string;
}
export interface EdgeRateInfo {
    readonly pluginId: string;
    readonly displayName: string;
}
export interface EdgeRatePair {
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}
export interface EdgeRatePlugin {
    readonly rateInfo: EdgeRateInfo;
    fetchRates(hints: EdgeRateHint[]): Promise<EdgeRatePair[]>;
}
export interface EdgeAccountOptions {
    otp?: string;
}
export interface EdgeCreateCurrencyWalletOptions {
    fiatCurrencyCode?: string;
    name?: string;
    importText?: string;
    keyOptions?: JsonObject;
    keys?: JsonObject;
}
export interface EdgeCurrencyConfig {
    readonly watch: Subscriber<EdgeCurrencyConfig>;
    readonly currencyInfo: EdgeCurrencyInfo;
    readonly otherMethods: EdgeOtherMethods;
    readonly userSettings: JsonObject | undefined;
    changeUserSettings(settings: JsonObject): Promise<void>;
    importKey(userInput: string): Promise<JsonObject>;
}
export interface EthereumTransaction {
    chainId: number;
    nonce: string;
    gasPrice: string;
    gasLimit: string;
    to: string;
    value: string;
    data: string;
    v?: string;
    r?: string;
    s?: string;
}
export interface EdgeRateCacheEvents {
    close: void;
    update: unknown;
}
export interface EdgeConvertCurrencyOpts {
    biases?: {
        [name: string]: number;
    };
}
export interface EdgeRateCache {
    readonly on: Subscriber<EdgeRateCacheEvents>;
    convertCurrency(fromCurrency: string, toCurrency: string, amount?: number, opts?: EdgeConvertCurrencyOpts): Promise<number>;
}
/**
 * Information and settings for a currency swap plugin.
 */
export interface EdgeSwapConfig {
    readonly watch: Subscriber<EdgeSwapConfig>;
    readonly enabled: boolean;
    readonly needsActivation: boolean;
    readonly swapInfo: EdgeSwapInfo;
    readonly userSettings: JsonObject | undefined;
    changeEnabled(enabled: boolean): Promise<void>;
    changeUserSettings(settings: JsonObject): Promise<void>;
}
export interface EdgeSwapRequestOptions {
    preferPluginId?: string;
    disabled?: EdgePluginMap<true>;
    promoCodes?: EdgePluginMap<string>;
}
export interface EdgeLoginRequest {
    readonly appId: string;
    approve(): Promise<void>;
    readonly displayName: string;
    readonly displayImageUrl: string | undefined;
}
export interface EdgeLobby {
    readonly loginRequest: EdgeLoginRequest | undefined;
}
export interface EdgeDataStore {
    deleteItem(storeId: string, itemId: string): Promise<void>;
    deleteStore(storeId: string): Promise<void>;
    listItemIds(storeId: string): Promise<string[]>;
    listStoreIds(): Promise<string[]>;
    getItem(storeId: string, itemId: string): Promise<string>;
    setItem(storeId: string, itemId: string, value: string): Promise<void>;
}
export interface EdgeAccountEvents {
    close: void;
}
export interface EdgeAccount {
    readonly on: Subscriber<EdgeAccountEvents>;
    readonly watch: Subscriber<EdgeAccount>;
    readonly id: string;
    readonly keys: JsonObject;
    readonly type: string;
    readonly disklet: Disklet;
    readonly localDisklet: Disklet;
    sync(): Promise<void>;
    readonly appId: string;
    readonly loggedIn: boolean;
    readonly loginKey: string;
    readonly recoveryKey: string | undefined;
    readonly rootLoginId: string;
    readonly username: string;
    readonly currencyConfig: EdgePluginMap<EdgeCurrencyConfig>;
    readonly rateCache: EdgeRateCache;
    readonly swapConfig: EdgePluginMap<EdgeSwapConfig>;
    readonly dataStore: EdgeDataStore;
    readonly edgeLogin: boolean;
    readonly keyLogin: boolean;
    readonly newAccount: boolean;
    readonly passwordLogin: boolean;
    readonly pinLogin: boolean;
    readonly recoveryLogin: boolean;
    changePassword(password: string): Promise<void>;
    changePin(opts: {
        pin?: string;
        enableLogin?: boolean;
    }): Promise<string>;
    changeRecovery(questions: string[], answers: string[]): Promise<string>;
    checkPassword(password: string): Promise<boolean>;
    checkPin(pin: string): Promise<boolean>;
    deletePassword(): Promise<void>;
    deletePin(): Promise<void>;
    deleteRecovery(): Promise<void>;
    readonly otpKey: string | undefined;
    readonly otpResetDate: string | undefined;
    cancelOtpReset(): Promise<void>;
    disableOtp(): Promise<void>;
    enableOtp(timeout?: number): Promise<void>;
    fetchLobby(lobbyId: string): Promise<EdgeLobby>;
    logout(): Promise<void>;
    readonly allKeys: EdgeWalletInfoFull[];
    changeWalletStates(walletStates: EdgeWalletStates): Promise<void>;
    createWallet(type: string, keys?: JsonObject): Promise<string>;
    getFirstWalletInfo(type: string): EdgeWalletInfo | undefined;
    getWalletInfo(id: string): EdgeWalletInfo | undefined;
    listWalletIds(): string[];
    listSplittableWalletTypes(walletId: string): Promise<string[]>;
    splitWalletInfo(walletId: string, newWalletType: string): Promise<string>;
    readonly activeWalletIds: string[];
    readonly archivedWalletIds: string[];
    readonly hiddenWalletIds: string[];
    readonly currencyWallets: {
        [walletId: string]: EdgeCurrencyWallet;
    };
    createCurrencyWallet(type: string, opts?: EdgeCreateCurrencyWalletOptions): Promise<EdgeCurrencyWallet>;
    waitForCurrencyWallet(walletId: string): Promise<EdgeCurrencyWallet>;
    signEthereumTransaction(walletId: string, transaction: EthereumTransaction): Promise<string>;
    fetchSwapQuote(request: EdgeSwapRequest, opts?: EdgeSwapRequestOptions): Promise<EdgeSwapQuote>;
    readonly exchangeCache: EdgeRateCache;
}
export declare type EdgeCorePlugin = EdgeCurrencyPlugin | EdgeRatePlugin | EdgeSwapPlugin;
declare type EdgeCorePluginFactory = (env: EdgeCorePluginOptions) => EdgeCorePlugin;
export declare type EdgeCorePlugins = EdgePluginMap<EdgeCorePlugin | EdgeCorePluginFactory>;
export declare type EdgeCorePluginsInit = EdgePluginMap<boolean | JsonObject>;
export interface EdgeContextOptions {
    apiKey: string;
    appId: string;
    authServer?: string;
    hideKeys?: boolean;
    path?: string;
    plugins?: EdgeCorePluginsInit;
}
export declare type EdgeEdgeLoginOptions = EdgeAccountOptions & {
    displayImageUrl?: string;
    displayName?: string;
};
export interface EdgeLoginMessages {
    [username: string]: {
        otpResetPending: boolean;
        recovery2Corrupt: boolean;
    };
}
export interface EdgePasswordRules {
    secondsToCrack: number;
    tooShort: boolean;
    noNumber: boolean;
    noLowerCase: boolean;
    noUpperCase: boolean;
    passed: boolean;
}
export interface EdgePendingEdgeLogin {
    readonly id: string;
    cancelRequest(): void;
}
export interface EdgeUserInfo {
    pinLoginEnabled: boolean;
    recovery2Key?: string;
    username: string;
}
export interface EdgeContextEvents {
    close: void;
    error: Error;
    login: EdgeAccount;
    loginStart: {
        username: string;
    };
    loginError: {
        error: Error;
    };
}
export interface EdgeContext {
    readonly on: Subscriber<EdgeContextEvents>;
    readonly watch: Subscriber<EdgeContext>;
    close(): Promise<void>;
    readonly appId: string;
    localUsers: EdgeUserInfo[];
    fixUsername(username: string): string;
    listUsernames(): Promise<string[]>;
    deleteLocalAccount(username: string): Promise<void>;
    usernameAvailable(username: string): Promise<boolean>;
    createAccount(username: string, password?: string, pin?: string, opts?: EdgeAccountOptions): Promise<EdgeAccount>;
    requestEdgeLogin(opts: EdgeEdgeLoginOptions): Promise<EdgePendingEdgeLogin>;
    loginWithKey(username: string, loginKey: string, opts?: EdgeAccountOptions): Promise<EdgeAccount>;
    checkPasswordRules(password: string): EdgePasswordRules;
    loginWithPassword(username: string, password: string, opts?: EdgeAccountOptions): Promise<EdgeAccount>;
    pinLoginEnabled(username: string): Promise<boolean>;
    loginWithPIN(username: string, pin: string, opts?: EdgeAccountOptions): Promise<EdgeAccount>;
    getRecovery2Key(username: string): Promise<string>;
    loginWithRecovery2(recovery2Key: string, username: string, answers: string[], opts?: EdgeAccountOptions): Promise<EdgeAccount>;
    fetchRecovery2Questions(recovery2Key: string, username: string): Promise<string[]>;
    listRecoveryQuestionChoices(): Promise<string[]>;
    requestOtpReset(username: string, otpResetToken: string): Promise<Date>;
    fetchLoginMessages(): Promise<EdgeLoginMessages>;
    readonly paused: boolean;
    changePaused(paused: boolean, opts?: {
        secondsDelay?: number;
    }): Promise<void>;
    pinExists(username: string): Promise<boolean>;
}
export interface EdgeFakeUser {
    username: string;
    loginId: string;
    loginKey: string;
    repos: {
        [repo: string]: {
            [path: string]: any;
        };
    };
    server: any;
}
export interface EdgeFakeWorld {
    close(): Promise<void>;
    makeEdgeContext(opts: EdgeContextOptions & {
        cleanDevice?: boolean;
    }): Promise<EdgeContext>;
    goOffline(offline?: boolean): Promise<void>;
    dumpFakeUser(account: EdgeAccount): Promise<EdgeFakeUser>;
}
export interface EdgeConsole {
    error(...data: any[]): void;
    info(...data: any[]): void;
    warn(...data: any[]): void;
}
export interface EdgeBitcoinPrivateKeyOptions {
    format?: string;
    coinType?: number;
    account?: number;
}
export declare type EdgeCreatePrivateKeyOptions = EdgeBitcoinPrivateKeyOptions | JsonObject;
