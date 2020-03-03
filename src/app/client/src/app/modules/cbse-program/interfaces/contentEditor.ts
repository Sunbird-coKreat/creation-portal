import { ISessionContext } from './index';

export interface IContentEditorComponentInput {
    contentId?: string;
    action?: string;
    content?: any;
    sessionContext?: ISessionContext;
    unitIdentifier?: string;
    programContext?: any;
}
