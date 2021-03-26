import { EdgeContext, EdgeContextOptions, EdgeCorePlugins, EdgeFakeUser, EdgeFakeWorld, EdgeIo, EdgeLoginMessages, EdgeNativeIo } from './types';
export declare const addEdgeCorePlugins: (plugins: EdgeCorePlugins) => void;
export declare const lockEdgeCorePlugins: () => void;
export declare const closeEdge: () => void;
export declare const makeFakeIo: () => EdgeIo;
/**
 * Initializes the Edge core library,
 * automatically selecting the appropriate platform.
 */
export declare const makeEdgeContext: (opts: EdgeContextOptions) => Promise<EdgeContext>;
export declare const makeFakeEdgeWorld: (users?: EdgeFakeUser[] | undefined) => Promise<EdgeFakeWorld>;
/**
 * React Native component for creating an EdgeContext.
 */
export declare const MakeEdgeContext: (props: {
    debug?: boolean | undefined;
    nativeIo?: EdgeNativeIo | undefined;
    onError?: ((e: any) => unknown) | undefined;
    onLoad: (context: EdgeContext) => unknown;
    options: EdgeContextOptions;
}) => any;
/**
 * React Native component for creating an EdgeFakeWorld for testing.
 */
export declare const MakeFakeEdgeWorld: (props: {
    debug?: boolean | undefined;
    nativeIo?: EdgeNativeIo | undefined;
    onError?: ((e: any) => unknown) | undefined;
    onLoad: (context: EdgeFakeWorld) => unknown;
    users: EdgeFakeUser[];
}) => any;
/**
 * React Native function for getting login alerts without a context:
 */
export declare const fetchLoginMessages: (apiKey: string) => EdgeLoginMessages;
export declare const makeBrowserIo: () => EdgeIo;
export declare const makeNodeIo: (path: string) => EdgeIo;
