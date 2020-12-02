import { ISessionContext } from './index';

export interface ICollectionManagementInput {
    sessionContext?: ISessionContext;
    viewElements?: string[];
    collectionMetadata?: any;
    programContext?: any;
}
