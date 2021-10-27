import { ISessionContext } from './index';

export interface IContentEditorComponentInput {
    contentId?: string;
    action?: string;
    content?: any;
    sessionContext?: ISessionContext;
    templateDetails?: any;
    unitIdentifier?: string;
    programContext?: any;
    originCollectionData: any;
    sourcingStatus: string;
    selectedSharedContext: any;
    hideSubmitForReviewBtn?: boolean;
    enableQuestionCreation?: boolean;
    setDefaultCopyright?: boolean;
}
