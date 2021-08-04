export interface Context {
    user: User;
    identifier: string;
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
    env: string;
    defaultLicense?: any;
    board?: any;
    medium?: any;
    gradeLevel?: any;
    subject?: any;
    topic?: any;
    framework: string;
    cloudStorageUrls: string[];
    additionalCategories: any[];
    labels?: any;
}
export interface User {
    id: string;
    name: string;
    orgIds: string[];
}
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

export interface IEditorConfig {
    context: Context;
    config: any;
    metadata?: any;
    data?: any;
}
