export interface ISessionContext { // TODO: remove any 'textbook' reference
  textBookUnitIdentifier?: any;
  collectionUnitIdentifier?: any;
  lastOpenedUnitChild?: any;
  lastOpenedUnitParent?: any;
  framework?: string;
  frameworkData?: any;
  channel?: string;
  board?: string;
  medium?: any;
  gradeLevel?: any;
  subject?: any;
  textbook?: string;
  collection?: string;
  topic?: string;
  questionType?: string;
  programId?: string;
  program?: string;
  currentRole?: string;
  currentRoleId?: null | number;
  currentRoles?: Array<string>;
  currentRoleIds?: Array<number>;
  bloomsLevel?: Array<any>;
  topicList?: Array<any>;
  onBoardSchool?: string;
  selectedSchoolForReview?: string;
  resourceIdentifier?: string;
  hierarchyObj?: any;
  textbookName?: any;
  collectionName?: any;
  collectionType?: any;
  collectionStatus?: any;
  currentOrgRole?: string;
  nominationDetails?: any;
}

export interface IPagination {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: Array<number>;
}
