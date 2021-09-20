
export interface Pdata {
    id: string;
    pid: string;
    ver: string;
}

export interface ContextRollup {
    l1?: string;
    l2?: string;
    l3?: string;
    l4?: string;
}

export interface Cdata {
    type: string;
    id: string;
}

export interface ObjectRollup {
    l1?: string;
    l2?: string;
    l3?: string;
    l4?: string;
}

export interface Context {
    mode: string;
    authToken?: string;
    sid: string;
    did: string;
    uid: string;
    channel: string;
    pdata: Pdata;
    contextRollup: ContextRollup;
    tags: string[];
    cdata?: Cdata[];
    timeDiff?: number;
    objectRollup?: ObjectRollup;
    host?: string;
    endpoint?: string;
    userData?: {
        firstName: string;
        lastName: string;
    };
}

// tslint:disable-next-line:no-empty-interface
export interface Config {
toolBar?: {
    showZoomButtons?: boolean;
    showPagesButton?: boolean;
    showPagingButtons?: boolean;
    showSearchButton?: boolean
    showRotateButton?: boolean;
};
sideMenu?: {
    showShare?: boolean;
    showDownload?: boolean;
    showReplay?: boolean;
    showExit?: boolean;
};
[propName: string]: any;
}

export interface PlayerConfig {
    context: Context;
    config: Config;
    metadata: any; // content
    data?: any; // body
}
