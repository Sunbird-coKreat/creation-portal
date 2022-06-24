
export const userProfile = {
  userId: '123456789',
  rootOrg: {
    slug: 'sunbird'
  },
};

export const readChannelMockResponse = {
  result: {
    "frameworks": [
      {
        "name": "Centre",
        "relation": "hasSequenceMember",
        "identifier": "ekstep_ncert_k-12",
        "description": "Centre",
        "objectType": "Framework",
        "status": "Live",
        "type": "K-12"
      }
    ],
    "primaryCategories": [
      {
        "identifier": "obj-cat:question-paper_collection_01309282781705830427",
        "name": "Question Paper",
        "targetObjectType": "Collection"
      }
    ],
  }
}

export const getFacetsMockResponse = {
result: {
  "id": "api.v1.search",
  "ver": "1.0",
  "ts": "2022-06-23T11:03:11.206Z",
  "params": {
      "resmsgid": "121df060-f2e4-11ec-9928-75215ea72650",
      "msgid": "e6960fc6-45cd-b388-be72-44b31c6cdd6f",
      "status": "successful",
      "err": null,
      "errmsg": null
  },
  "responseCode": "OK",
  "result": {
      "count": 1198,
      "content": 
      [
          {
              "ownershipType": [
                  "createdBy"
              ],
              "allowEdit":true,
              "allowDelete":true,
              "code": "3c85003e-edf5-a5a5-2474-2b3bd7625388",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2022-06-23T10:53:43.148+0000",
              "objectType": "Content",
              "appIcon": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png",
              "primaryCategory": "Question Paper",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-06-23T10:53:43.148+0000",
              "contentEncoding": "gzip",
              "contentType": "Resource",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_113565801456771072146",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "discussionForum": {
                  "enabled": "No"
              },
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "printable": true,
              "versionKey": "1655981623148",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_113565801456771072146",
              "node_id": 72910,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "allowEdit":true,
              "allowDelete":true,
              "previewUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_113564417097048064145/sample.pdf",
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113564417097048064145/june-21-sample_1655813373104_do_113564417097048064145_1.ecar",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "variants": {
                  "full": {
                      "ecarUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113564417097048064145/june-21-sample_1655813373104_do_113564417097048064145_1.ecar",
                      "size": "2065"
                  },
                  "spine": {
                      "ecarUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113564417097048064145/june-21-sample_1655813373155_do_113564417097048064145_1_SPINE.ecar",
                      "size": "1030"
                  }
              },
              "objectType": "Content",
              "primaryCategory": "eTextbook",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_113564417097048064145/sample.pdf",
              "contentType": "eTextBook",
              "identifier": "do_113564417097048064145",
              "audience": [
                  "Student"
              ],
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "lastPublishedBy": "60f91e9e-34ee-4f9f-a907-d312d0e8063e",
              "version": 2,
              "pragma": [
                  "external"
              ],
              "license": "CC BY 4.0",
              "prevState": "Review",
              "size": 3028,
              "lastPublishedOn": "2022-06-21T12:09:33.103+0000",
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "June 21 sample",
              "status": "Live",
              "code": "d13fe84a-4239-21db-0f9a-e3382afe050a",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Processing",
              "idealScreenSize": "normal",
              "createdOn": "2022-06-21T11:57:13.919+0000",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-06-21T12:09:33.233+0000",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "ekstep_ncert_k-12"
              ],
              "pkgVersion": 1,
              "versionKey": "1655812640706",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "lastSubmittedOn": "2022-06-21T11:57:20.699+0000",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 4,
              "IL_UNIQUE_ID": "do_113564417097048064145",
              "node_id": 72909
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "c3d535e7-ef34-f7e6-7ed0-a796a64d2f46",
              "interceptionPoints": "{}",
              "allowEdit":true,
              "allowDelete":true,
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_113564415918669824144/sample.pdf",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "idealScreenSize": "normal",
              "createdOn": "2022-06-21T11:54:50.074+0000",
              "objectType": "Content",
              "primaryCategory": "eTextbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-06-21T11:55:24.465+0000",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_113564415918669824144/sample.pdf",
              "collaborators": [
                  "88ffb6eb-33bf-4f96-ad3a-75c15e5a04ff",
                  "a4b4a783-d686-4f67-b079-512329c77f5e"
              ],
              "contentType": "eTextBook",
              "dialcodeRequired": "No",
              "identifier": "do_113564415918669824144",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1655812524465",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "size": 3028,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_113564415918669824144",
              "node_id": 72908,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "dad",
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "appId": "password.sunbird.portal",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354955344030105612849",
              "audience": [
                  "Student"
              ],
              "subjectIds": [
                  "ekstep_ncert_k-12_subject_mathematics"
              ],
              "visibility": "Default",
              "author": "N11",
              "childNodes": [
                  "do_11354955387912192012850"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "Vk 31st may",
              "rejectComment": "dsdasd",
              "mediumIds": [
                  "ekstep_ncert_k-12_medium_english"
              ],
              "status": "Draft",
              "code": "3bf302fa-5fd3-65aa-8bde-7214e30355c1",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Review",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-31T11:57:02.694+0000",
              "copyrightYear": 2022,
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-31T12:36:03.396+0000",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "versionKey": "1654000563396",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "boardIds": [
                  "ekstep_ncert_k-12_board_cbse"
              ],
              "lastSubmittedOn": "2022-05-31T11:57:56.568+0000",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "gradeLevelIds": [
                  "ekstep_ncert_k-12_gradelevel_class1"
              ],
              "IL_UNIQUE_ID": "do_11354955344030105612849",
              "node_id": 75095
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "2022",
              "previewUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11354955437654016012852/sample.pdf",
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11354955437654016012852/adsdd_1654000257580_do_11354955437654016012852_3.ecar",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "variants": {
                  "full": {
                      "ecarUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11354955437654016012852/adsdd_1654000257580_do_11354955437654016012852_3.ecar",
                      "size": "2134"
                  },
                  "spine": {
                      "ecarUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11354955437654016012852/adsdd_1654000257630_do_11354955437654016012852_3_SPINE.ecar",
                      "size": "1090"
                  }
              },
              "objectType": "Content",
              "primaryCategory": "eTextbook",
              "appId": "password.sunbird.portal",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11354955437654016012852/sample.pdf",
              "collaborators": [
                  "88ffb6eb-33bf-4f96-ad3a-75c15e5a04ff",
                  "a4b4a783-d686-4f67-b079-512329c77f5e",
                  "5c3a2a46-4830-4ade-a4cd-b6780635569c",
                  "f58112b4-1a17-45ca-83a8-5284d93c2270"
              ],
              "contentType": "eTextBook",
              "identifier": "do_11354955437654016012852",
              "audience": [
                  "Student"
              ],
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "lastPublishedBy": "60f91e9e-34ee-4f9f-a907-d312d0e8063e",
              "version": 2,
              "pragma": [
                  "external"
              ],
              "license": "CC BY 4.0",
              "prevState": "Review",
              "size": 3028,
              "lastPublishedOn": "2022-05-31T12:30:57.580+0000",
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "adsdd",
              "status": "Draft",
              "code": "358e0f50-8e74-901f-2605-cb0f91a56df3",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Live",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-31T11:58:56.981+0000",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-31T12:30:57.697+0000",
              "requestChanges": "dasd",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "ekstep_ncert_k-12"
              ],
              "pkgVersion": 3,
              "versionKey": "1654748961799",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "lastSubmittedOn": "2022-05-31T11:59:06.965+0000",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 4,
              "IL_UNIQUE_ID": "do_11354955437654016012852",
              "node_id": 75096
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "keywords": [
                  "Anusha",
                  "latha"
              ],
              "subject": [
                  "Hindi"
              ],
              "channel": "sunbird",
              "downloadUrl": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11319701517773209615/18_jan_2021_contemporary-india-i_1612168972120_do_11319701517773209615_2.0_spine.ecar",
              "organisation": [
                  "test"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "leafNodes": [
                  "do_1131991410550128641323",
                  "do_1131700751941795841421",
                  "do_1131700869131960321455",
                  "do_1131700874537943041461",
                  "do_113184189512351744172",
                  "do_1131700872375664641457"
              ],
              "objectType": "Content",
              "chapterCountForContribution": 7,
              "se_mediums": [
                  "English"
              ],
              "gradeLevel": [
                  "Class 10"
              ],
              "primaryCategory": "Digital Textbook",
              "appId": "dev.sunbird.portal",
              "contentEncoding": "gzip",
              "collaborators": [
                  "5a587cc1-e018-4859-a0a8-e842650b9d64"
              ],
              "totalCompressedSize": 50693303,
              "contentType": "TextBook",
              "se_gradeLevels": [
                  "Class 10"
              ],
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354871471579955212636",
              "audience": [
                  "Student"
              ],
              "toc_url": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11319701517773209615/artifact/do_11319701517773209615_toc.json",
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11354871471784755212730",
                  "do_11354871471805235212772",
                  "do_11354871471728230412716",
                  "do_11354871471796224012754",
                  "do_11354871471819161612800",
                  "do_11354871471815065612792",
                  "do_11354871471783116812726",
                  "do_11354871471721676812702",
                  "do_11354871471785574412732",
                  "do_11354871471815884812794",
                  "do_11354871471827353612818",
                  "do_11354871471791308812744",
                  "do_11354871471717580812696",
                  "do_11354871471824896012814",
                  "do_11354871471670886412666",
                  "do_11354871471715123212690",
                  "do_11354871471724134412706",
                  "do_11354871471788851212740",
                  "do_11354871471786393612734",
                  "do_11354871471798681612760",
                  "do_11354871471719219212698",
                  "do_11354871471702016012682",
                  "do_11354871471821619212806",
                  "do_11354871471668428812662",
                  "do_11354871471831449612828",
                  "do_11354871471667609612660",
                  "do_11354871471663513612652",
                  "do_11354871471714304012688",
                  "do_11354871471816704012796",
                  "do_11354871471828172812820",
                  "do_11354871471792128012746",
                  "do_11354871471820800012804",
                  "do_11354871471828992012822",
                  "do_11354871471824896012816",
                  "do_11354871471803596812770",
                  "do_11354871471795404812752",
                  "do_11354871471781478412722",
                  "do_11354871471669248012664",
                  "do_11354871471809331212780",
                  "do_11354871471672524812670",
                  "do_11354871471814246412790",
                  "do_11354871471797862412758",
                  "do_11354871471824076812812",
                  "do_11354871471819980812802",
                  "do_11354871471813427212788",
                  "do_11354871471675801612672",
                  "do_11354871471788032012738",
                  "do_11354871471700377612680",
                  "do_11354871471698739212676",
                  "do_11354871471829811212824",
                  "do_11354871471787212812736",
                  "do_11354871471794585612750",
                  "do_11354871471811788812784",
                  "do_11354871471818342412798",
                  "do_11354871471716761612694",
                  "do_11354871471676620812674",
                  "do_11354871471725772812710",
                  "do_11354871471800320012764",
                  "do_11354871471665971212656",
                  "do_11354871471720038412700",
                  "do_11354871471707750412684",
                  "do_11354871471801139212766",
                  "do_11354871471715942412692",
                  "do_11354871471699558412678",
                  "do_11354871471812608012786",
                  "do_11354871471823257612810",
                  "do_11354871471671705612668",
                  "do_11354871471822438412808",
                  "do_11354871471665152012654",
                  "do_11354871471662694412650",
                  "do_11354871471783936012728",
                  "do_11354871471806054412774",
                  "do_11354871471782297612724",
                  "do_11354871471799500812762",
                  "do_11354871471808512012778",
                  "do_11354871471727411212714",
                  "do_11354871471830630412826",
                  "do_11354871471792947212748",
                  "do_11354871471666790412658",
                  "do_11354871471790489612742",
                  "do_11354871471797043212756",
                  "do_11354871471730688012720",
                  "do_11354871471726592012712",
                  "do_11354871471807692812776",
                  "do_11354871471729049612718",
                  "do_11354871471724953612708",
                  "do_11354871471722496012704",
                  "do_11354871471661056012648",
                  "do_11354871471713484812686",
                  "do_11354871471801958412768",
                  "do_11354871471810969612782"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "lastPublishedBy": "Ekstep",
              "version": 2,
              "se_subjects": [
                  "Hindi"
              ],
              "allowedContentTypes": [
                  "Practice Set",
                  "Course Assessment",
                  "eTextbook"
              ],
              "license": "CC BY 4.0",
              "prevState": "Draft",
              "size": 128937,
              "lastPublishedOn": "2021-02-01T08:42:51.514+0000",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "18_Jan_2021_Contemporary India  I",
              "status": "Draft",
              "code": "org.sunbird.H7TrUy",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Live",
              "origin": "do_11319701517773209615",
              "description": "Copy textbook Testing For shallow Copy",
              "medium": [
                  "English"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-05-30T07:30:39.336+0000",
              "se_boards": [
                  "CBSE"
              ],
              "contentDisposition": "inline",
              "additionalCategories": [
                  "Textbook"
              ],
              "lastUpdatedOn": "2022-05-30T07:30:39.892+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "ncert1",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "ekstep_ncert_k-12"
              ],
              "chapterCount": 7,
              "pkgVersion": 2,
              "versionKey": "1653895839892",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "s3Key": "ecar_files/do_11319701517773209615/18_jan_2021_contemporary-india-i_1612168972120_do_11319701517773209615_2.0_spine.ecar",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "leafNodesCount": 6,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_11354871471579955212636",
              "board": "CBSE",
              "programId": "5a9eca60-dfea-11ec-be8b-9962d8844469",
              "resourceType": "Book",
              "node_id": 75272
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "subject": [
                  "Mathematics"
              ],
              "channel": "sunbird",
              "organisation": [
                  "NIT"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "chapterCountForContribution": 5,
              "se_mediums": [
                  "English"
              ],
              "gradeLevel": [
                  "Class 1"
              ],
              "primaryCategory": "Digital Textbook",
              "appId": "dev.sunbird.portal",
              "contentEncoding": "gzip",
              "collaborators": [
                  "5a587cc1-e018-4859-a0a8-e842650b9d64"
              ],
              "contentType": "TextBook",
              "se_gradeLevels": [
                  "Class 1"
              ],
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354871471582412812637",
              "audience": [
                  "Student"
              ],
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11354871471655321612638",
                  "do_11354871471657779212642",
                  "do_11354871471660236812646",
                  "do_11354871471659417612644",
                  "do_11354871471656960012640"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "version": 2,
              "se_subjects": [
                  "Mathematics"
              ],
              "allowedContentTypes": [
                  "Practice Set",
                  "Course Assessment",
                  "eTextbook"
              ],
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "24Sep",
              "status": "Draft",
              "code": "org.sunbird.0OdvpY",
              "credentials": {
                  "enabled": "No"
              },
              "origin": "do_113114992530038784119",
              "description": "Enter description for TextBook",
              "medium": [
                  "English"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-05-30T07:30:39.336+0000",
              "se_boards": [
                  "CBSE"
              ],
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-30T07:30:39.580+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "chapterCount": 5,
              "versionKey": "1653895839580",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_11354871471582412812637",
              "board": "CBSE",
              "programId": "5a9eca60-dfea-11ec-be8b-9962d8844469",
              "resourceType": "Book",
              "node_id": 75231
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "keywords": [
                  "Anusha",
                  "latha"
              ],
              "subject": [
                  "Hindi"
              ],
              "channel": "sunbird",
              "downloadUrl": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11319701517773209615/18_jan_2021_contemporary-india-i_1612168972120_do_11319701517773209615_2.0_spine.ecar",
              "organisation": [
                  "test"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "leafNodes": [
                  "do_1131991410550128641323",
                  "do_1131700751941795841421",
                  "do_1131700869131960321455",
                  "do_1131700874537943041461",
                  "do_113184189512351744172",
                  "do_1131700872375664641457"
              ],
              "objectType": "Content",
              "chapterCountForContribution": 7,
              "se_mediums": [
                  "English"
              ],
              "gradeLevel": [
                  "Class 10"
              ],
              "primaryCategory": "Digital Textbook",
              "appId": "dev.sunbird.portal",
              "contentEncoding": "gzip",
              "collaborators": [
                  "5a587cc1-e018-4859-a0a8-e842650b9d64"
              ],
              "totalCompressedSize": 50693303,
              "contentType": "TextBook",
              "se_gradeLevels": [
                  "Class 10"
              ],
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354870909909401612270",
              "audience": [
                  "Student"
              ],
              "toc_url": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11319701517773209615/artifact/do_11319701517773209615_toc.json",
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11354870910095360012406",
                  "do_11354870910142873612486",
                  "do_11354870910067507212354",
                  "do_11354870910083891212386",
                  "do_11354870910115020812450",
                  "do_11354870910187929612554",
                  "do_11354870910156800012530",
                  "do_11354870910106828812430",
                  "do_11354870910060953612342",
                  "do_11354870910205952012582",
                  "do_11354870910039654412306",
                  "do_11354870910092083212402",
                  "do_11354870910096998412410",
                  "do_11354870910219059212590",
                  "do_11354870910157619212534",
                  "do_11354870910195302412564",
                  "do_11354870910038016012300",
                  "do_11354870910101913612422",
                  "do_11354870910223974412608",
                  "do_11354870910037196812298",
                  "do_11354870910031462412280",
                  "do_11354870910053580812322",
                  "do_11354870910057676812334",
                  "do_11354870910073241612362",
                  "do_11354870910098636812412",
                  "do_11354870910119116812462",
                  "do_11354870910061772812344",
                  "do_11354870910219878412594",
                  "do_11354870910056857612332",
                  "do_11354870910158438412538",
                  "do_11354870910107648012434",
                  "do_11354870910194483212560",
                  "do_11354870910117478412458",
                  "do_11354870910204313612578",
                  "do_11354870910192844812556",
                  "do_11354870910154342412522",
                  "do_11354870910141235212482",
                  "do_11354870910206771212586",
                  "do_11354870910221516812598",
                  "do_11354870910155980812526",
                  "do_11354870910113382412446",
                  "do_11354870910090444812396",
                  "do_11354870910038835212302",
                  "do_11354870910149427212504",
                  "do_11354870910041292812310",
                  "do_11354870910201036812568",
                  "do_11354870910138777612476",
                  "do_11354870910091264012400",
                  "do_11354870910054400012324",
                  "do_11354870910058496012336",
                  "do_11354870910051942412318",
                  "do_11354870910152704012516",
                  "do_11354870910203494412574",
                  "do_11354870910119936012466",
                  "do_11354870910040473612308",
                  "do_11354870910147788812500",
                  "do_11354870910033920012288",
                  "do_11354870910030643212276",
                  "do_11354870910092902412404",
                  "do_11354870910144512012490",
                  "do_11354870910059315212340",
                  "do_11354870910049484812314",
                  "do_11354870910101094412420",
                  "do_11354870910076518412372",
                  "do_11354870910121574412470",
                  "do_11354870910064230412348",
                  "do_11354870910050304012316",
                  "do_11354870910222336012600",
                  "do_11354870910099456012416",
                  "do_11354870910112563212442",
                  "do_11354870910151884812513",
                  "do_11354870910034739212290",
                  "do_11354870910046208012312",
                  "do_11354870910184652812548",
                  "do_11354870910052761612320",
                  "do_11354870910150246412508",
                  "do_11354870910080614412378",
                  "do_11354870910223155212604",
                  "do_11354870910110924812438",
                  "do_11354870910035558412296",
                  "do_11354870910103552012426",
                  "do_11354870910055219212328",
                  "do_11354870910078976012376",
                  "do_11354870910140416012478",
                  "do_11354870910084710412390",
                  "do_11354870910074060812366",
                  "do_11354870910069145612359",
                  "do_11354870910028185612274",
                  "do_11354870910116659212454",
                  "do_11354870910088806412392",
                  "do_11354870910146150412496"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "lastPublishedBy": "Ekstep",
              "version": 2,
              "se_subjects": [
                  "Hindi"
              ],
              "allowedContentTypes": [
                  "eTextbook",
                  "Explanation Content"
              ],
              "license": "CC BY 4.0",
              "prevState": "Draft",
              "size": 128937,
              "lastPublishedOn": "2021-02-01T08:42:51.514+0000",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "18_Jan_2021_Contemporary India  I",
              "status": "Draft",
              "code": "org.sunbird.H7TrUy",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Live",
              "origin": "do_11319701517773209615",
              "description": "Copy textbook Testing For shallow Copy",
              "medium": [
                  "English"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-05-30T07:19:13.701+0000",
              "se_boards": [
                  "CBSE"
              ],
              "contentDisposition": "inline",
              "additionalCategories": [
                  "Textbook"
              ],
              "lastUpdatedOn": "2022-05-30T07:19:14.808+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "ncert1",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "ekstep_ncert_k-12"
              ],
              "chapterCount": 7,
              "pkgVersion": 2,
              "versionKey": "1653895154808",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "s3Key": "ecar_files/do_11319701517773209615/18_jan_2021_contemporary-india-i_1612168972120_do_11319701517773209615_2.0_spine.ecar",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "leafNodesCount": 6,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_11354870909909401612270",
              "board": "CBSE",
              "programId": "bc3c5500-dfe8-11ec-be8b-9962d8844469",
              "resourceType": "Book",
              "node_id": 75271
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "subject": [
                  "Hindi"
              ],
              "channel": "sunbird",
              "organisation": [
                  "test"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "chapterCountForContribution": 7,
              "gradeLevel": [
                  "Class 10"
              ],
              "primaryCategory": "Digital Textbook",
              "appId": "local.local.portal",
              "contentEncoding": "gzip",
              "collaborators": [
                  "c10495b0-e435-42e8-b16f-e7fc8c55423f",
                  "915a22f2-9150-45c7-b424-663c7d68595d"
              ],
              "totalCompressedSize": 50193618,
              "contentType": "TextBook",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354870909911859212271",
              "audience": [
                  "Student"
              ],
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11354870910115020812452",
                  "do_11354870910148608012502",
                  "do_11354870910219878412592",
                  "do_11354870910196121612566",
                  "do_11354870910117478412456",
                  "do_11354870910120755212468",
                  "do_11354870910068326412356",
                  "do_11354870910232985612628",
                  "do_11354870910091264012398",
                  "do_11354870910076518412374",
                  "do_11354870910185472012550",
                  "do_11354870910234624012632",
                  "do_11354870910034739212292",
                  "do_11354870910232166412626",
                  "do_11354870910074880012368",
                  "do_11354870910081433612380",
                  "do_11354870910223974412609",
                  "do_11354870910158438412536",
                  "do_11354870910151065612510",
                  "do_11354870910223155212606",
                  "do_11354870910074060812364",
                  "do_11354870910224793612612",
                  "do_11354870910220697612596",
                  "do_11354870910230528012622",
                  "do_11354870910140416012480",
                  "do_11354870910137139212472",
                  "do_11354870910183833612544",
                  "do_11354870910031462412282",
                  "do_11354870910222336012602",
                  "do_11354870910096179212408",
                  "do_11354870910227251212616",
                  "do_11354870910184652812546",
                  "do_11354870910202675212572",
                  "do_11354870910228070412618",
                  "do_11354870910100275212418",
                  "do_11354870910030643212278",
                  "do_11354870910111744012440",
                  "do_11354870910143692812488",
                  "do_11354870910114201612448",
                  "do_11354870910145331212494",
                  "do_11354870910119936012464",
                  "do_11354870910155980812528",
                  "do_11354870910183014412542",
                  "do_11354870910054400012326",
                  "do_11354870910083072012384",
                  "do_11354870910083891212388",
                  "do_11354870910038835212303",
                  "do_11354870910181376012540",
                  "do_11354870910113382412444",
                  "do_11354870910138777612474",
                  "do_11354870910142054412484",
                  "do_11354870910194483212562",
                  "do_11354870910027366412272",
                  "do_11354870910069145612358",
                  "do_11354870910035558412294",
                  "do_11354870910055219212330",
                  "do_11354870910236262412634",
                  "do_11354870910032281612284",
                  "do_11354870910033100812286",
                  "do_11354870910150246412506",
                  "do_11354870910106009612428",
                  "do_11354870910144512012492",
                  "do_11354870910228889612620",
                  "do_11354870910118297612460",
                  "do_11354870910155161612524",
                  "do_11354870910233804812630",
                  "do_11354870910110105612436",
                  "do_11354870910065868812352",
                  "do_11354870910186291212552",
                  "do_11354870910082252812382",
                  "do_11354870910065049612350",
                  "do_11354870910151884812512",
                  "do_11354870910153523212520",
                  "do_11354870910231347212624",
                  "do_11354870910225612812614",
                  "do_11354870910219059212588",
                  "do_11354870910075699212370",
                  "do_11354870910201856012570",
                  "do_11354870910203494412576",
                  "do_11354870910157619212532",
                  "do_11354870910098636812414",
                  "do_11354870910193664012558",
                  "do_11354870910205132812580",
                  "do_11354870910089625612393",
                  "do_11354870910206771212584",
                  "do_11354870910152704012518",
                  "do_11354870910107648012432",
                  "do_11354870910102732812424",
                  "do_11354870910059315212338",
                  "do_11354870910063411212346",
                  "do_11354870910146969612498"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "version": 2,
              "allowedContentTypes": [
                  "eTextbook",
                  "Explanation Content"
              ],
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "15_Jan_2021_Contemporary India  I",
              "status": "Draft",
              "code": "org.sunbird.H7TrUy",
              "credentials": {
                  "enabled": "No"
              },
              "origin": "do_11319479631000371211",
              "description": "Copy textbook Testing For shallow Copy",
              "medium": [
                  "English"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-05-30T07:19:13.703+0000",
              "contentDisposition": "inline",
              "additionalCategories": [
                  "Textbook"
              ],
              "lastUpdatedOn": "2022-05-30T07:19:14.806+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "ncert1",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "vdn_ncert"
              ],
              "chapterCount": 7,
              "versionKey": "1653895154806",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_11354870909911859212271",
              "board": "CBSE",
              "programId": "bc3c5500-dfe8-11ec-be8b-9962d8844469",
              "resourceType": "Book",
              "node_id": 75230
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "keywords": [
                  "Anusha",
                  "latha"
              ],
              "subject": [
                  "Hindi"
              ],
              "channel": "sunbird",
              "downloadUrl": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_11319701517773209615/18_jan_2021_contemporary-india-i_1612168972120_do_11319701517773209615_2.0_spine.ecar",
              "organisation": [
                  "test"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "leafNodes": [
                  "do_1131991410550128641323",
                  "do_1131700751941795841421",
                  "do_1131700869131960321455",
                  "do_1131700874537943041461",
                  "do_113184189512351744172",
                  "do_1131700872375664641457"
              ],
              "objectType": "Content",
              "chapterCountForContribution": 7,
              "se_mediums": [
                  "English"
              ],
              "gradeLevel": [
                  "Class 10"
              ],
              "primaryCategory": "Digital Textbook",
              "appId": "dev.sunbird.portal",
              "contentEncoding": "gzip",
              "collaborators": [
                  "5a587cc1-e018-4859-a0a8-e842650b9d64"
              ],
              "totalCompressedSize": 50693303,
              "contentType": "TextBook",
              "se_gradeLevels": [
                  "Class 10"
              ],
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354870499832627211905",
              "audience": [
                  "Student"
              ],
              "toc_url": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11319701517773209615/artifact/do_11319701517773209615_toc.json",
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11354870500134912012249",
                  "do_11354870500062822412148",
                  "do_11354870499994828812062",
                  "do_11354870499997286412072",
                  "do_11354870500050534412096",
                  "do_11354870499981721612010",
                  "do_11354870500132454412240",
                  "do_11354870499964518411950",
                  "do_11354870500073472012193",
                  "do_11354870499990732812042",
                  "do_11354870500054630412116",
                  "do_11354870500076748812208",
                  "do_11354870500072652812188",
                  "do_11354870499998105612074",
                  "do_11354870499984179212020",
                  "do_11354870499983360012018",
                  "do_11354870500047257612084",
                  "do_11354870499970252811968",
                  "do_11354870500137369612261",
                  "do_11354870500046438412080",
                  "do_11354870500052992012108",
                  "do_11354870500067737612172",
                  "do_11354870499979264012006",
                  "do_11354870499969433611966",
                  "do_11354870499988275212036",
                  "do_11354870500059545612136",
                  "do_11354870500075929612203",
                  "do_11354870499971891211976",
                  "do_11354870499960422411932",
                  "do_11354870499967795211961",
                  "do_11354870500066918412170",
                  "do_11354870500136550412256",
                  "do_11354870500126720012218",
                  "do_11354870500062003212144",
                  "do_11354870500053811212112",
                  "do_11354870500071014412184",
                  "do_11354870500052172812100",
                  "do_11354870500057088012126",
                  "do_11354870500131635212236",
                  "do_11354870500078387212212",
                  "do_11354870500070195212180",
                  "do_11354870500134092812244",
                  "do_11354870499993190412055",
                  "do_11354870499963699211946",
                  "do_11354870500066099212164",
                  "do_11354870499966156811956",
                  "do_11354870499955507211922",
                  "do_11354870500048076812089",
                  "do_11354870499977625611998",
                  "do_11354870499985817612029",
                  "do_11354870500045619212076",
                  "do_11354870500057907212129",
                  "do_11354870500135731212253",
                  "do_11354870499972710411980",
                  "do_11354870499982540812014",
                  "do_11354870500075110412198",
                  "do_11354870499976806411994",
                  "do_11354870500128358412222",
                  "do_11354870499962880011942",
                  "do_11354870500139008012268",
                  "do_11354870499962060811938",
                  "do_11354870499974348811988",
                  "do_11354870500060364812138",
                  "do_11354870499956326411926",
                  "do_11354870499954688011918",
                  "do_11354870499996467212066",
                  "do_11354870500063641612152",
                  "do_11354870500129177612226",
                  "do_11354870500065280012160",
                  "do_11354870499965337611952",
                  "do_11354870500058726412132",
                  "do_11354870499994009612058",
                  "do_11354870499978444812002",
                  "do_11354870499971072011972",
                  "do_11354870500069376012176",
                  "do_11354870500130816012230",
                  "do_11354870499989913612040",
                  "do_11354870500138188812265",
                  "do_11354870500052172812104",
                  "do_11354870499961241611935",
                  "do_11354870500049715212094",
                  "do_11354870499991552012046",
                  "do_11354870499986636812033",
                  "do_11354870499984998412025",
                  "do_11354870499952230411912",
                  "do_11354870500064460812156",
                  "do_11354870499992371212050",
                  "do_11354870499975987211992",
                  "do_11354870500061184012140",
                  "do_11354870500056268812121",
                  "do_11354870499989094412038"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "lastPublishedBy": "Ekstep",
              "version": 2,
              "se_subjects": [
                  "Hindi"
              ],
              "allowedContentTypes": [
                  "Demo Practice Question Set",
                  "Course Assessment",
                  "eTextbook",
                  "Explanation Content",
                  "Learning Resource",
                  "Practice Question Set",
                  "Teacher Resource"
              ],
              "license": "CC BY 4.0",
              "prevState": "Draft",
              "size": 128937,
              "lastPublishedOn": "2021-02-01T08:42:51.514+0000",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "18_Jan_2021_Contemporary India  I",
              "status": "Draft",
              "code": "org.sunbird.H7TrUy",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Live",
              "origin": "do_11319701517773209615",
              "description": "Copy textbook Testing For shallow Copy",
              "medium": [
                  "English"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-05-30T07:10:53.117+0000",
              "se_boards": [
                  "CBSE"
              ],
              "contentDisposition": "inline",
              "additionalCategories": [
                  "Textbook"
              ],
              "lastUpdatedOn": "2022-05-30T07:10:54.305+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "ncert1",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "ekstep_ncert_k-12"
              ],
              "chapterCount": 7,
              "pkgVersion": 2,
              "versionKey": "1653894654305",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "s3Key": "ecar_files/do_11319701517773209615/18_jan_2021_contemporary-india-i_1612168972120_do_11319701517773209615_2.0_spine.ecar",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "leafNodesCount": 6,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_11354870499832627211905",
              "board": "CBSE",
              "programId": "8c874f00-dfe7-11ec-be8b-9962d8844469",
              "resourceType": "Book",
              "node_id": 75229
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "subject": [
                  "Hindi"
              ],
              "channel": "sunbird",
              "organisation": [
                  "test"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "chapterCountForContribution": 7,
              "gradeLevel": [
                  "Class 10"
              ],
              "primaryCategory": "Digital Textbook",
              "appId": "local.local.portal",
              "contentEncoding": "gzip",
              "collaborators": [
                  "c10495b0-e435-42e8-b16f-e7fc8c55423f",
                  "915a22f2-9150-45c7-b424-663c7d68595d"
              ],
              "totalCompressedSize": 50193618,
              "contentType": "TextBook",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354677394314854411721",
              "audience": [
                  "Student"
              ],
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11354677394477056011862",
                  "do_11354677394475417611858",
                  "do_11354677394442649611780",
                  "do_11354677394425446411742",
                  "do_11354677394426265611744",
                  "do_11354677394459033611818",
                  "do_11354677394445107211784",
                  "do_11354677394463129611828",
                  "do_11354677394432819211758",
                  "do_11354677394466406411836",
                  "do_11354677394472960011852",
                  "do_11354677394477875211864",
                  "do_11354677394437734411770",
                  "do_11354677394478694411866",
                  "do_11354677394441011211776",
                  "do_11354677394499174411900",
                  "do_11354677394421350411732",
                  "do_11354677394480332811870",
                  "do_11354677394496716811894",
                  "do_11354677394432000011756",
                  "do_11354677394450022411796",
                  "do_11354677394452480011802",
                  "do_11354677394429542411750",
                  "do_11354677394497536011896",
                  "do_11354677394438553611772",
                  "do_11354677394459852811820",
                  "do_11354677394434457611762",
                  "do_11354677394433638411760",
                  "do_11354677394471321611848",
                  "do_11354677394474598411856",
                  "do_11354677394469683211844",
                  "do_11354677394467225611838",
                  "do_11354677394453299211804",
                  "do_11354677394431180811754",
                  "do_11354677394483609611876",
                  "do_11354677394461491211824",
                  "do_11354677394484428811878",
                  "do_11354677394418073611726",
                  "do_11354677394481971211874",
                  "do_11354677394440192011774",
                  "do_11354677394488524811884",
                  "do_11354677394485248011880",
                  "do_11354677394481152011872",
                  "do_11354677394495078411890",
                  "do_11354677394454937611808",
                  "do_11354677394499993611902",
                  "do_11354677394418892811728",
                  "do_11354677394468044811840",
                  "do_11354677394420531211730",
                  "do_11354677394460672011822",
                  "do_11354677394447564811790",
                  "do_11354677394443468811782",
                  "do_11354677394424627211740",
                  "do_11354677394422169611734",
                  "do_11354677394430361611752",
                  "do_11354677394454118411806",
                  "do_11354677394455756811810",
                  "do_11354677394473779211854",
                  "do_11354677394416435211722",
                  "do_11354677394422988811736",
                  "do_11354677394427904011746",
                  "do_11354677394493440011888",
                  "do_11354677394450841611798",
                  "do_11354677394457395211814",
                  "do_11354677394464768011832",
                  "do_11354677394498355211898",
                  "do_11354677394445926411786",
                  "do_11354677394427904011748",
                  "do_11354677394472140811850",
                  "do_11354677394462310411826",
                  "do_11354677394463948811830",
                  "do_11354677394495897611892",
                  "do_11354677394486067211882",
                  "do_11354677394435276811764",
                  "do_11354677394479513611868",
                  "do_11354677394470502411846",
                  "do_11354677394476236811860",
                  "do_11354677394489344011886",
                  "do_11354677394441830411778",
                  "do_11354677394417254411724",
                  "do_11354677394446745611788",
                  "do_11354677394436096011766",
                  "do_11354677394456576011812",
                  "do_11354677394423808011738",
                  "do_11354677394458214411816",
                  "do_11354677394451660811800",
                  "do_11354677394465587211834",
                  "do_11354677394468864011842",
                  "do_11354677394448384011792",
                  "do_11354677394436915211768",
                  "do_11354677394449203211794"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "version": 2,
              "allowedContentTypes": [
                  "Demo Practice Question Set"
              ],
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "15_Jan_2021_Contemporary India  I",
              "status": "Draft",
              "code": "org.sunbird.H7TrUy",
              "credentials": {
                  "enabled": "No"
              },
              "origin": "do_11319479631000371211",
              "description": "Copy textbook Testing For shallow Copy",
              "medium": [
                  "English"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-05-27T13:42:08.615+0000",
              "contentDisposition": "inline",
              "additionalCategories": [
                  "Textbook"
              ],
              "lastUpdatedOn": "2022-05-27T13:42:09.199+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "ncert1",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "vdn_ncert"
              ],
              "chapterCount": 7,
              "versionKey": "1653658929199",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_11354677394314854411721",
              "board": "CBSE",
              "programId": "c4dc32a0-ddbf-11ec-be8b-9962d8844469",
              "resourceType": "Book",
              "node_id": 75324
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "NIT",
              "subject": [
                  "Mathematics"
              ],
              "channel": "sunbird",
              "downloadUrl": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_113306014151221248130/ashok_1624269440997_do_113306014151221248130_1.0_spine.ecar",
              "organisation": [
                  "NIT"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "leafNodes": [
                  "do_1124919618509701121112"
              ],
              "objectType": "Content",
              "chapterCountForContribution": 2,
              "se_mediums": [
                  "Hindi"
              ],
              "gradeLevel": [
                  "Class 1"
              ],
              "appIcon": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113306014151221248130/artifact/do_11330308492314214411_1623911734366_flower2.thumb.jpeg",
              "primaryCategory": "Digital Textbook",
              "appId": "dev.sunbird.portal",
              "contentEncoding": "gzip",
              "totalCompressedSize": 126761,
              "contentType": "TextBook",
              "se_gradeLevels": [
                  "Class 1"
              ],
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354509650886656011688",
              "audience": [
                  "Student"
              ],
              "toc_url": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113306014151221248130/artifact/do_113306014151221248130_toc.json",
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11354509650975129611691",
                  "do_11354509650973491211689"
              ],
              "discussionForum": {
                  "enabled": "Yes"
              },
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "lastPublishedBy": "fca852ba-5fe6-4841-885d-699940686ec8",
              "version": 2,
              "se_subjects": [
                  "Mathematics"
              ],
              "allowedContentTypes": [
                  "Demo Practice Question Set",
                  "Course Assessment",
                  "eTextbook",
                  "Explanation Content",
                  "Learning Resource",
                  "Practice Question Set",
                  "Teacher Resource"
              ],
              "license": "CC BY 4.0",
              "prevState": "Review",
              "size": 47040,
              "lastPublishedOn": "2021-06-21T09:57:20.821+0000",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "Ashok",
              "status": "Draft",
              "code": "org.sunbird.CHZmA2",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Processing",
              "origin": "do_113306014151221248130",
              "description": "Enter description for TextBook",
              "medium": [
                  "Hindi"
              ],
              "posterImage": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11330308492314214411/artifact/do_11330308492314214411_1623911734366_flower2.jpeg",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-25T04:49:23.694+0000",
              "se_boards": [
                  "CBSE"
              ],
              "contentDisposition": "inline",
              "additionalCategories": [
                  "Textbook"
              ],
              "lastUpdatedOn": "2022-05-25T04:49:23.826+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "ekstep_ncert_k-12"
              ],
              "chapterCount": 2,
              "pkgVersion": 1,
              "versionKey": "1653454163826",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "s3Key": "ecar_files/do_113306014151221248130/ashok_1624269440997_do_113306014151221248130_1.0_spine.ecar",
              "lastSubmittedOn": "2021-06-21T09:56:27.874+0000",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "leafNodesCount": 1,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_11354509650886656011688",
              "board": "CBSE",
              "programId": "fa8ed0a0-dbe5-11ec-be8b-9962d8844469",
              "resourceType": "Book",
              "node_id": 75301
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "2020",
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "appId": "password.sunbird.portal",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354163757476249611470",
              "audience": [
                  "Student"
              ],
              "subjectIds": [
                  "ekstep_ncert_k-12_subject_mathematics"
              ],
              "visibility": "Default",
              "author": "N11",
              "childNodes": [
                  "do_11354163794973491211471"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "textbook 20th may 1",
              "rejectComment": "fdsfdsf",
              "mediumIds": [
                  "ekstep_ncert_k-12_medium_english",
                  "ekstep_ncert_k-12_medium_hindi"
              ],
              "status": "Draft",
              "code": "4a60b03b-0d24-6f3c-d516-024d586c6f5b",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Review",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-20T07:32:10.515+0000",
              "copyrightYear": 2020,
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-24T12:48:19.882+0000",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "versionKey": "1653396499882",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "boardIds": [
                  "ekstep_ncert_k-12_board_cbse"
              ],
              "lastSubmittedOn": "2022-05-20T07:33:05.714+0000",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "gradeLevelIds": [
                  "ekstep_ncert_k-12_gradelevel_class1"
              ],
              "IL_UNIQUE_ID": "do_11354163757476249611470",
              "node_id": 74294
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "24th May 12",
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "appId": "password.sunbird.portal",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354430569076326411669",
              "audience": [
                  "Student"
              ],
              "subjectIds": [
                  "ekstep_ncert_k-12_subject_mathematics"
              ],
              "visibility": "Default",
              "author": "N11",
              "childNodes": [
                  "do_11354430613435187211670"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "24th May 12",
              "rejectComment": "ssaad",
              "mediumIds": [
                  "ekstep_ncert_k-12_medium_english"
              ],
              "status": "Draft",
              "code": "21f75a03-e46d-c9ba-f0f4-cbcfa3452f58",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Review",
              "description": "24th May 12",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-24T02:00:28.269+0000",
              "copyrightYear": 2022,
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-24T12:10:06.400+0000",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "versionKey": "1653394206400",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "boardIds": [
                  "ekstep_ncert_k-12_board_cbse"
              ],
              "lastSubmittedOn": "2022-05-24T02:01:22.774+0000",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "gradeLevelIds": [
                  "ekstep_ncert_k-12_gradelevel_class1"
              ],
              "IL_UNIQUE_ID": "do_11354430569076326411669",
              "node_id": 60510
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "subject": [
                  "Hindi"
              ],
              "channel": "01309282781705830427",
              "organisation": [
                  "test"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "chapterCountForContribution": 7,
              "gradeLevel": [
                  "Class 10"
              ],
              "primaryCategory": "Digital Textbook",
              "appId": "local.local.portal",
              "contentEncoding": "gzip",
              "collaborators": [
                  "c10495b0-e435-42e8-b16f-e7fc8c55423f",
                  "915a22f2-9150-45c7-b424-663c7d68595d"
              ],
              "totalCompressedSize": 50193618,
              "contentType": "TextBook",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354379621880627211481",
              "audience": [
                  "Student"
              ],
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11354379621955174411498",
                  "do_11354379622063308811646",
                  "do_11354379621977292811552",
                  "do_11354379622016614411606",
                  "do_11354379622022348811620",
                  "do_11354379621970739211538",
                  "do_11354379621949440011484",
                  "do_11354379622001049611576",
                  "do_11354379621993676811560",
                  "do_11354379622011699211594",
                  "do_11354379622014976011602",
                  "do_11354379621967462411528",
                  "do_11354379621999411211572",
                  "do_11354379621974835211548",
                  "do_11354379621966643211526",
                  "do_11354379622060851211640",
                  "do_11354379622057574411632",
                  "do_11354379622013337611598",
                  "do_11354379622065766411650",
                  "do_11354379621997772811568",
                  "do_11354379622015795211604",
                  "do_11354379621995315211564",
                  "do_11354379621961728011514",
                  "do_11354379622005964811584",
                  "do_11354379622059212811636",
                  "do_11354379622060032011638",
                  "do_11354379621950259211486",
                  "do_11354379622058393611634",
                  "do_11354379621969100811534",
                  "do_11354379622062489611644",
                  "do_11354379621978112011554",
                  "do_11354379622017433611608",
                  "do_11354379622055936011630",
                  "do_11354379622020710411616",
                  "do_11354379622070681611660",
                  "do_11354379621952716811492",
                  "do_11354379622067404811654",
                  "do_11354379621962547211516",
                  "do_11354379622004326411580",
                  "do_11354379621965004811522",
                  "do_11354379621964185611520",
                  "do_11354379621994496011562",
                  "do_11354379621960089611510",
                  "do_11354379622068224011656",
                  "do_11354379621968281611532",
                  "do_11354379621978931211556",
                  "do_11354379621953536011494",
                  "do_11354379622014156811600",
                  "do_11354379621955993611500",
                  "do_11354379621972377611542",
                  "do_11354379621960908811512",
                  "do_11354379622071500811662",
                  "do_11354379621951078411488",
                  "do_11354379621951897611490",
                  "do_11354379622005145611582",
                  "do_11354379621996953611566",
                  "do_11354379621998592011570",
                  "do_11354379622019891211614",
                  "do_11354379621947801611482",
                  "do_11354379621976473611550",
                  "do_11354379621954355211496",
                  "do_11354379621963366411518",
                  "do_11354379622021529611618",
                  "do_11354379622012518411596",
                  "do_11354379621971558411540",
                  "do_11354379621956812811502",
                  "do_11354379621957632011504",
                  "do_11354379622001868811578",
                  "do_11354379622019072011612",
                  "do_11354379622053478411624",
                  "do_11354379621968281611530",
                  "do_11354379622054297611626",
                  "do_11354379622007603211588",
                  "do_11354379622051840011622",
                  "do_11354379621973196811544",
                  "do_11354379621969920011536",
                  "do_11354379621992038411558",
                  "do_11354379622064128011648",
                  "do_11354379622069862411658",
                  "do_11354379621974016011546",
                  "do_11354379621958451211508",
                  "do_11354379622018252811610",
                  "do_11354379621965824011524",
                  "do_11354379622010880011592",
                  "do_11354379622055116811628",
                  "do_11354379621957632011506",
                  "do_11354379622000230411574",
                  "do_11354379622007603211586",
                  "do_11354379622009241611590",
                  "do_11354379622066585611652",
                  "do_11354379622061670411642",
                  "do_11354379925893939211664"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "version": 2,
              "allowedContentTypes": [
                  "Demo Practice Question Set",
                  "Observation",
                  "Survey",
                  "Ekstep New QS",
                  "Exam Question Set",
                  "Course Assessment",
                  "Explanation Content"
              ],
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "15_Jan_2021_Contemporary India  I",
              "status": "Draft",
              "code": "org.sunbird.H7TrUy",
              "credentials": {
                  "enabled": "No"
              },
              "origin": "do_11319479631000371211",
              "description": "Copy textbook Testing For shallow Copy",
              "medium": [
                  "English"
              ],
              "acceptedContents": [
                  "do_11354379925893939211664"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-05-23T08:43:56.869+0000",
              "contentDisposition": "inline",
              "additionalCategories": [
                  "Textbook"
              ],
              "lastUpdatedOn": "2022-05-23T08:53:03.350+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "ncert1",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "vdn_ncert"
              ],
              "chapterCount": 7,
              "versionKey": "1653295983350",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_11354379621880627211481",
              "board": "CBSE",
              "programId": "53acfc70-da74-11ec-be8b-9962d8844469",
              "resourceType": "Book",
              "node_id": 58252
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "NIT123",
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354111771303936011453",
              "audience": [
                  "Student"
              ],
              "subjectIds": [
                  "ekstep_ncert_k-12_subject_mathematics"
              ],
              "visibility": "Default",
              "author": "N11",
              "childNodes": [
                  "do_11354156025902694411468"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "asdasd dsad",
              "mediumIds": [
                  "ekstep_ncert_k-12_medium_english",
                  "ekstep_ncert_k-12_medium_hindi"
              ],
              "status": "Draft",
              "code": "36824764-6c30-7e3b-f163-cb251c3d6fef",
              "credentials": {
                  "enabled": "No"
              },
              "description": "dasd",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-19T13:54:30.832+0000",
              "copyrightYear": 2022,
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-20T04:54:52.574+0000",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "versionKey": "1653022492574",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "boardIds": [
                  "ekstep_ncert_k-12_board_cbse"
              ],
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "gradeLevelIds": [
                  "ekstep_ncert_k-12_gradelevel_class1"
              ],
              "IL_UNIQUE_ID": "do_11354111771303936011453",
              "node_id": 74390
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "NIT123",
              "subject": [
                  "English"
              ],
              "targetMediumIds": [
                  "nit_k-12_medium_english"
              ],
              "channel": "01309282781705830427",
              "organisation": [
                  "NIT"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "targetGradeLevelIds": [
                  "nit_k-12_gradelevel_grade-1"
              ],
              "objectType": "Content",
              "chapterCountForContribution": 1,
              "primaryCategory": "Course",
              "contentEncoding": "gzip",
              "generateDIALCodes": "Yes",
              "contentType": "Course",
              "trackable": {
                  "enabled": "Yes",
                  "autoBatch": "No"
              },
              "identifier": "do_113495816259059712145",
              "audience": [
                  "Administrator",
                  "Other",
                  "Parent",
                  "Student",
                  "Teacher"
              ],
              "subjectIds": [
                  "nit_k-12_subject_english"
              ],
              "visibility": "Default",
              "author": "N11",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_113495816259936256146",
                  "do_1135217277699276801589",
                  "do_1135198599942963201188",
                  "do_11345941432791040012399",
                  "do_11345941372210380812398",
                  "do_1135217766590545921599",
                  "do_1135217778292899841600",
                  "do_11352602319440281611340",
                  "do_11352617659054489611341",
                  "do_11352625135937126411342",
                  "do_11353596218136166411385",
                  "do_11354020200967372811428",
                  "do_11354044454114099211432",
                  "do_11354104108662784011445"
              ],
              "discussionForum": {
                  "enabled": "No"
              },
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "version": 2,
              "allowedContentTypes": [
                  "Demo Practice Question Set",
                  "Observation",
                  "Survey",
                  "Ekstep New QS",
                  "Exam Question Set",
                  "Haryana_New_QS",
                  "Observation With Rubrics",
                  "Practice Set",
                  "Content Playlist",
                  "Course Assessment",
                  "eTextbook",
                  "Explanation Content",
                  "Learning Resource",
                  "Practice Question Set",
                  "Teacher Resource",
                  "Exam Question"
              ],
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "background colour changes",
              "targetBoardIds": [
                  "nit_k-12_board_cbse"
              ],
              "status": "Draft",
              "code": "org.sunbird.LzUrs3",
              "credentials": {
                  "enabled": "Yes"
              },
              "origin": "do_11341216781651968011",
              "description": "Enter description for Course",
              "acceptedContents": [
                  "do_11352625135937126411342",
                  "do_11353596218136166411385",
                  "do_11354044454114099211432"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-03-16T13:48:28.189+0000",
              "targetSubjectIds": [
                  "nit_k-12_subject_english"
              ],
              "copyrightYear": 2021,
              "contentDisposition": "inline",
              "additionalCategories": [
                  "Lesson Plan",
                  "Textbook"
              ],
              "lastUpdatedOn": "2022-05-19T11:18:37.100+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "targetFWIds": [
                  "nit_k-12"
              ],
              "chapterCount": 1,
              "versionKey": "1652959117100",
              "idealScreenDensity": "hdpi",
              "framework": "nit_k-12",
              "depth": 0,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_113495816259059712145",
              "programId": "9df77910-a52f-11ec-a165-33909bc91f74",
              "resourceType": "Course",
              "node_id": 65348
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "f63e7699-c490-c262-e243-4cf5b739d617",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-19T07:39:14.087+0000",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-19T07:39:14.087+0000",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354093325586432011442",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1652945954087",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "userConsent": "Yes",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11354093325586432011442",
              "node_id": 57935,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "009e5f39-e1ff-5e97-edd1-d54168813d45",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-18T04:37:50.751+0000",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-18T04:37:50.751+0000",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354013631078400011427",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1652848670751",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "userConsent": "Yes",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11354013631078400011427",
              "node_id": 75124,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "7eaa2899-db64-78ac-8c0f-6b3c7d16debd",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-18T04:27:51.914+0000",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-18T04:27:51.914+0000",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354013140509491211426",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1652848071914",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "userConsent": "Yes",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11354013140509491211426",
              "node_id": 67648,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "88aa022e-1abc-215c-535f-cbd292e9ee66",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-18T04:01:28.701+0000",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-18T04:01:28.701+0000",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354011843543040011425",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1652846488701",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "userConsent": "Yes",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11354011843543040011425",
              "node_id": 67647,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "ff876c17-9be4-e878-dff4-b034db9eafd6",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-18T03:59:09.963+0000",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-18T03:59:09.963+0000",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354011729888051211424",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1652846349963",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "userConsent": "Yes",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11354011729888051211424",
              "node_id": 67646,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "73fe679e-a066-b289-78f7-3cdf09f4b410",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-18T03:35:30.054+0000",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-18T03:35:30.054+0000",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354010566698598411423",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1652844930054",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "userConsent": "Yes",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11354010566698598411423",
              "node_id": 67645,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "e8fbe9dc-b704-0a7f-0749-667c6f9eb771",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-18T03:34:54.104+0000",
              "objectType": "Content",
              "primaryCategory": "Digital Textbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-18T03:34:54.104+0000",
              "contentEncoding": "gzip",
              "contentType": "TextBook",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354010537248358411422",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1652844894104",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "userConsent": "Yes",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11354010537248358411422",
              "node_id": 67644,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "3ad92ea0-7202-317a-7ad6-213ca4fba168",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-18T03:32:13.166+0000",
              "objectType": "Content",
              "primaryCategory": "Content Playlist",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-18T03:32:13.166+0000",
              "contentEncoding": "gzip",
              "contentType": "Collection",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11354010405408768011421",
              "createdFor": [
                  "01309282781705830427"
              ],
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1652844733166",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11354010405408768011421",
              "node_id": 67643,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "2022",
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11353382420252262411383/sample.pdf",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "objectType": "Content",
              "gradeLevel": [
                  "Class 1"
              ],
              "primaryCategory": "eTextbook",
              "appId": "password.sunbird.portal",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11353382420252262411383/sample.pdf",
              "contentType": "eTextBook",
              "identifier": "do_11353382420252262411383",
              "audience": [
                  "Student"
              ],
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "license": "CC BY 4.0",
              "size": 3028,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "n11 for now",
              "status": "Draft",
              "code": "e82e03b9-c6a6-619c-f66a-09d3f2ca570b",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Review",
              "medium": [
                  "English"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-05-09T06:35:49.724+0000",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-09T06:37:14.009+0000",
              "requestChanges": "dsdsd",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "versionKey": "1652078234009",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "lastSubmittedOn": "2022-05-09T06:37:14.002+0000",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_UNIQUE_ID": "do_11353382420252262411383",
              "board": "CBSE",
              "node_id": 66419
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "2022",
              "code": "3279c4ed-9ab5-b876-56a5-8f878998236d",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "subject": [
                  "Economics"
              ],
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11353372048773939211381/sample.pdf",
              "language": [
                  "English"
              ],
              "medium": [
                  "English",
                  "Hindi"
              ],
              "mimeType": "application/pdf",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-09T03:04:49.228+0000",
              "objectType": "Content",
              "gradeLevel": [
                  "Class 1"
              ],
              "primaryCategory": "eTextbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-09T03:05:41.865+0000",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11353372048773939211381/sample.pdf",
              "contentType": "eTextBook",
              "dialcodeRequired": "No",
              "identifier": "do_11353372048773939211381",
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1652065541865",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "size": 3028,
              "lastSubmittedOn": "2022-05-09T03:05:41.858+0000",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "for review- n11",
              "IL_UNIQUE_ID": "do_11353372048773939211381",
              "board": "CBSE",
              "node_id": 74098,
              "status": "Review"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "NIT123",
              "keywords": [
                  "Test"
              ],
              "subject": [
                  "Mathematics"
              ],
              "channel": "01309282781705830427",
              "organisation": [
                  "NIT"
              ],
              "reusedContributions": [
                  "do_1131198736511139841417",
                  "do_1131198739888783361418",
                  "do_113113443837231104111132",
                  "do_1131176322923970561649"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "chapterCountForContribution": 1,
              "gradeLevel": [
                  "Class 3"
              ],
              "appIcon": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png",
              "primaryCategory": "Question paper",
              "contentEncoding": "gzip",
              "generateDIALCodes": "Yes",
              "contentType": "Collection",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11337256767188992011265",
              "audience": [
                  "Student"
              ],
              "subjectIds": [
                  "ekstep_ncert_k-12_subject_mathematics"
              ],
              "visibility": "Default",
              "author": "SCERT Haryana",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11337256767224217611266",
                  "do_11334343500625510414375",
                  "do_1133167126637035521685",
                  "do_113114047852167168111244",
                  "do_1131142918713671681101",
                  "do_1133584537394053121448",
                  "do_1133231768130682881191",
                  "do_113321005511106560171",
                  "do_113320998105382912170",
                  "do_1133167174555811841687",
                  "do_1131233919172444161726",
                  "do_1133882039901552641106",
                  "do_1131233921519288321727",
                  "do_1131233911510548481724",
                  "do_113391541932875776194",
                  "do_113391542555385856195",
                  "do_1131198741590097921419",
                  "do_1131179033898762241696",
                  "do_1133915828958658561106",
                  "do_1131198736511139841417",
                  "do_1131198739888783361418",
                  "do_1133916164730224641122",
                  "do_1131179049985146881697",
                  "do_1131176343020093441650",
                  "do_113113515621539840111193",
                  "do_113113515353096192111192",
                  "do_113113443837231104111132",
                  "do_1131176322923970561649",
                  "do_113114209868554240142",
                  "do_1133929472561152001819",
                  "do_1133929481721610241820",
                  "do_1133929508535992321821",
                  "do_1133930188055183361846",
                  "do_1133930239124602881847",
                  "do_1133930412906086401857",
                  "do_1133937444617666561908",
                  "do_1133937475667722241909",
                  "do_1133950956989317121911",
                  "do_1133950959067627521912",
                  "do_1133951210734305281925",
                  "do_1133952307941621761940",
                  "do_1133952416532070401941",
                  "do_11339533104284467211038",
                  "do_11339576610695577611265",
                  "do_11353103257033932811377",
                  "do_11353103286498918411378",
                  "do_11353103306696294411379"
              ],
              "discussionForum": {
                  "enabled": "No"
              },
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "version": 2,
              "allowedContentTypes": [
                  "Exam Question"
              ],
              "license": "CC BY 4.0",
              "concepts": [],
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "4.2 Question paper test",
              "mediumIds": [
                  "ekstep_ncert_k-12_medium_english"
              ],
              "status": "Draft",
              "code": "org.sunbird.c13le6",
              "credentials": {
                  "enabled": "No"
              },
              "origin": "do_11334343033120358411",
              "description": "Enter description for Collection",
              "medium": [
                  "English"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2021-09-23T10:38:34.636+0000",
              "copyrightYear": 2022,
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-05T07:57:15.007+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "chapterCount": 1,
              "printable": false,
              "versionKey": "1651737435007",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "boardIds": [
                  "ekstep_ncert_k-12_board_cbse"
              ],
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "openForContribution": true,
              "timeLimits": "{}",
              "gradeLevelIds": [
                  "ekstep_ncert_k-12_gradelevel_class3"
              ],
              "IL_UNIQUE_ID": "do_11337256767188992011265",
              "board": "CBSE",
              "programId": "4dfa33c0-1c5a-11ec-aae8-074099b4ec59",
              "resourceType": "Collection",
              "node_id": 51574
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "26ca3e58-f8ec-920f-c179-0d8d59601a08",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "plugins": [
                  {
                      "identifier": "org.sunbird.questionunit.quml",
                      "semanticVersion": "1.1"
                  }
              ],
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.ecml-archive",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-05T03:23:12.824+0000",
              "objectType": "Content",
              "primaryCategory": "Course Assessment",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-05T03:23:23.221+0000",
              "contentEncoding": "gzip",
              "contentType": "SelfAssess",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11353089837318963211376",
              "editorVersion": 3,
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "questionCategories": [
                  "VSA"
              ],
              "author": "N11",
              "mediaType": "content",
              "itemSets": [
                  "do_1135308983779409921790"
              ],
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1651721003221",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11353089837318963211376",
              "node_id": 69705,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "61471bc1-9e7a-b26f-a706-91c2fbf01a8a",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "subject": [
                  "Science",
                  "Environmental Studies",
                  "Health and Physical Education",
                  "English",
                  "Social Science",
                  "Hindi",
                  "History",
                  "Mathematics",
                  "Political Science/Civics",
                  "Geography",
                  "Economics"
              ],
              "channel": "01309282781705830427",
              "language": [
                  "English"
              ],
              "medium": [
                  "English",
                  "Hindi"
              ],
              "mimeType": "application/vnd.ekstep.ecml-archive",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-05T03:03:45.692+0000",
              "objectType": "Content",
              "gradeLevel": [
                  "Class 10",
                  "Class 1",
                  "Class 2",
                  "Class 3",
                  "Class 4",
                  "Class 5",
                  "Class 6",
                  "Class 7",
                  "Class 8",
                  "Class 9"
              ],
              "primaryCategory": "Practice Question Set",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-05T03:05:05.085+0000",
              "contentEncoding": "gzip",
              "contentType": "PracticeResource",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11353088881205248011375",
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "questionCategories": [
                  "FTB"
              ],
              "author": "N11",
              "mediaType": "content",
              "itemSets": [
                  "do_1135308888810782721789"
              ],
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1651719905085",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "dasdasd",
              "IL_UNIQUE_ID": "do_11353088881205248011375",
              "board": "CBSE",
              "node_id": 69704,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "b41cf22f-0c36-25ff-1b14-e6e39b586e39",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11353030342418432011374/sample.pdf",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "idealScreenSize": "normal",
              "createdOn": "2022-05-04T07:12:47.211+0000",
              "objectType": "Content",
              "primaryCategory": "Learning Resource",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-04T07:12:47.986+0000",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11353030342418432011374/sample.pdf",
              "contentType": "PreviousBoardExamPapers",
              "dialcodeRequired": "No",
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11353030342418432011374",
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1651648367986",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "size": 3028,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11353030342418432011374",
              "node_id": 70437,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "subject": [
                  "Mathematics"
              ],
              "channel": "01309282781705830427",
              "organisation": [
                  "NIT"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "objectType": "Content",
              "chapterCountForContribution": 5,
              "se_mediums": [
                  "English"
              ],
              "gradeLevel": [
                  "Class 1"
              ],
              "primaryCategory": "Digital Textbook",
              "appId": "dev.sunbird.portal",
              "contentEncoding": "gzip",
              "collaborators": [
                  "5a587cc1-e018-4859-a0a8-e842650b9d64"
              ],
              "contentType": "TextBook",
              "se_gradeLevels": [
                  "Class 1"
              ],
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_11352667776744652811343",
              "audience": [
                  "Student"
              ],
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_11352667776817561611352",
                  "do_11352667776815104011348",
                  "do_11352667776813465611344",
                  "do_11352667776816742411350",
                  "do_11352667776814284811346",
                  "do_11352668030406656011354",
                  "do_11352672314363904011355",
                  "do_1135290463613173761520"
              ],
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "version": 2,
              "se_subjects": [
                  "Mathematics"
              ],
              "allowedContentTypes": [
                  "Demo Practice Question Set",
                  "Exam Question Set",
                  "Practice Set",
                  "Content Playlist",
                  "Course Assessment",
                  "eTextbook",
                  "Explanation Content"
              ],
              "license": "CC BY 4.0",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "24Sep",
              "status": "Draft",
              "code": "org.sunbird.0OdvpY",
              "credentials": {
                  "enabled": "No"
              },
              "origin": "do_113114992530038784119",
              "description": "Enter description for TextBook",
              "medium": [
                  "English"
              ],
              "acceptedContents": [
                  "do_11352668030406656011354"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-04-29T04:16:22.161+0000",
              "se_boards": [
                  "CBSE"
              ],
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-05-02T12:35:17.246+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "chapterCount": 5,
              "versionKey": "1651494917246",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_11352667776744652811343",
              "board": "CBSE",
              "programId": "e500d940-c772-11ec-a165-33909bc91f74",
              "resourceType": "Book",
              "node_id": 73449
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "NIT",
              "subject": [
                  "Mathematics"
              ],
              "channel": "01309282781705830427",
              "downloadUrl": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_113306014151221248130/ashok_1624269440997_do_113306014151221248130_1.0_spine.ecar",
              "organisation": [
                  "NIT"
              ],
              "language": [
                  "English"
              ],
              "mimeType": "application/vnd.ekstep.content-collection",
              "leafNodes": [
                  "do_1124919618509701121112"
              ],
              "objectType": "Content",
              "chapterCountForContribution": 2,
              "se_mediums": [
                  "Hindi"
              ],
              "gradeLevel": [
                  "Class 1"
              ],
              "appIcon": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113306014151221248130/artifact/do_11330308492314214411_1623911734366_flower2.thumb.jpeg",
              "primaryCategory": "Digital Textbook",
              "appId": "dev.sunbird.portal",
              "contentEncoding": "gzip",
              "totalCompressedSize": 126761,
              "contentType": "TextBook",
              "se_gradeLevels": [
                  "Class 1"
              ],
              "trackable": {
                  "enabled": "No",
                  "autoBatch": "No"
              },
              "identifier": "do_1135253137551441921633",
              "audience": [
                  "Student"
              ],
              "toc_url": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_113306014151221248130/artifact/do_113306014151221248130_toc.json",
              "visibility": "Default",
              "consumerId": "028d6fb1-2d6f-4331-86aa-f7cf491a41e0",
              "childNodes": [
                  "do_1135253137556684801636",
                  "do_1135253137556520961634",
                  "do_1135253163491491841638",
                  "do_11352549558828236811312",
                  "do_1135290424426250241514",
                  "do_1135290446647050241517"
              ],
              "discussionForum": {
                  "enabled": "Yes"
              },
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "languageCode": [
                  "en"
              ],
              "nodeType": "DATA_NODE",
              "lastPublishedBy": "fca852ba-5fe6-4841-885d-699940686ec8",
              "version": 2,
              "se_subjects": [
                  "Mathematics"
              ],
              "allowedContentTypes": [
                  "Demo Practice Question Set",
                  "Content Playlist",
                  "Course Assessment",
                  "eTextbook",
                  "Explanation Content",
                  "Learning Resource",
                  "Practice Question Set",
                  "Teacher Resource",
                  "Exam Question"
              ],
              "license": "CC BY 4.0",
              "prevState": "Review",
              "size": 47040,
              "lastPublishedOn": "2021-06-21T09:57:20.821+0000",
              "IL_FUNC_OBJECT_TYPE": "Collection",
              "name": "Ashok",
              "status": "Draft",
              "code": "org.sunbird.CHZmA2",
              "credentials": {
                  "enabled": "No"
              },
              "prevStatus": "Processing",
              "origin": "do_113306014151221248130",
              "description": "Enter description for TextBook",
              "medium": [
                  "Hindi"
              ],
              "posterImage": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11330308492314214411/artifact/do_11330308492314214411_1623911734366_flower2.jpeg",
              "acceptedContents": [
                  "do_1135253163491491841638"
              ],
              "idealScreenSize": "normal",
              "createdOn": "2022-04-27T06:01:16.753+0000",
              "se_boards": [
                  "CBSE"
              ],
              "contentDisposition": "inline",
              "additionalCategories": [
                  "Textbook"
              ],
              "lastUpdatedOn": "2022-05-02T12:31:50.130+0000",
              "originData": "{\"channel\":\"01309282781705830427\"}",
              "dialcodeRequired": "No",
              "createdFor": [
                  "01309282781705830427"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "se_FWIds": [
                  "ekstep_ncert_k-12"
              ],
              "chapterCount": 2,
              "pkgVersion": 1,
              "versionKey": "1651494710130",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "depth": 0,
              "s3Key": "ecar_files/do_113306014151221248130/ashok_1624269440997_do_113306014151221248130_1.0_spine.ecar",
              "lastSubmittedOn": "2021-06-21T09:56:27.874+0000",
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "leafNodesCount": 1,
              "userConsent": "Yes",
              "openForContribution": true,
              "IL_UNIQUE_ID": "do_1135253137551441921633",
              "board": "CBSE",
              "programId": "178ffa10-c5ef-11ec-a165-33909bc91f74",
              "resourceType": "Book",
              "node_id": 69803
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "copyright": "2022",
              "code": "6b9ccd82-3c0b-e443-3b11-796fea732551",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "subject": [
                  "Economics"
              ],
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352596992086016011339/sample.pdf",
              "language": [
                  "English"
              ],
              "medium": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "idealScreenSize": "normal",
              "createdOn": "2022-04-28T04:16:15.107+0000",
              "objectType": "Content",
              "gradeLevel": [
                  "Class 1"
              ],
              "primaryCategory": "eTextbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-04-28T04:17:07.270+0000",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352596992086016011339/sample.pdf",
              "contentType": "eTextBook",
              "dialcodeRequired": "No",
              "identifier": "do_11352596992086016011339",
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1651119427270",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "size": 3028,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "by Vaishali",
              "IL_UNIQUE_ID": "do_11352596992086016011339",
              "board": "CBSE",
              "node_id": 73303,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "a08b562f-51ec-ab9d-12d0-791c56f21fa1",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352596040475443211338/sample.pdf",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "idealScreenSize": "normal",
              "createdOn": "2022-04-28T03:56:53.473+0000",
              "objectType": "Content",
              "primaryCategory": "eTextbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-04-28T03:56:55.742+0000",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352596040475443211338/sample.pdf",
              "contentType": "eTextBook",
              "dialcodeRequired": "No",
              "identifier": "do_11352596040475443211338",
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1651118215742",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "size": 3028,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11352596040475443211338",
              "node_id": 73302,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "c76bf8ac-0a54-6d64-2035-f53c7d4d83e4",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352595565821132811337/sample.pdf",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "idealScreenSize": "normal",
              "createdOn": "2022-04-28T03:47:14.061+0000",
              "objectType": "Content",
              "primaryCategory": "eTextbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-04-28T03:47:14.638+0000",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352595565821132811337/sample.pdf",
              "contentType": "eTextBook",
              "dialcodeRequired": "No",
              "identifier": "do_11352595565821132811337",
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1651117634638",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "size": 3028,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11352595565821132811337",
              "node_id": 73301,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "2abd4d56-ec60-a275-703a-8f61dd154c02",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352595506982912011336/sample.pdf",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "idealScreenSize": "normal",
              "createdOn": "2022-04-28T03:46:02.237+0000",
              "objectType": "Content",
              "primaryCategory": "eTextbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-04-28T03:46:02.808+0000",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352595506982912011336/sample.pdf",
              "contentType": "eTextBook",
              "dialcodeRequired": "No",
              "identifier": "do_11352595506982912011336",
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1651117562808",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "size": 3028,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11352595506982912011336",
              "node_id": 73300,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "da1939ba-52e1-db50-887d-4000753a9f1c",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352568980789657611335/sample.pdf",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "idealScreenSize": "normal",
              "createdOn": "2022-04-27T18:46:21.629+0000",
              "objectType": "Content",
              "primaryCategory": "eTextbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-04-27T18:46:22.531+0000",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352568980789657611335/sample.pdf",
              "contentType": "eTextBook",
              "dialcodeRequired": "No",
              "identifier": "do_11352568980789657611335",
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1651085182531",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "size": 3028,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11352568980789657611335",
              "node_id": 74025,
              "status": "Draft"
          },
          {
              "ownershipType": [
                  "createdBy"
              ],
              "code": "bf506026-18f9-370d-d54a-a3dbba11d2ba",
              "interceptionPoints": "{}",
              "credentials": {
                  "enabled": "No"
              },
              "channel": "01309282781705830427",
              "downloadUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352567803203584011334/sample.pdf",
              "language": [
                  "English"
              ],
              "mimeType": "application/pdf",
              "idealScreenSize": "normal",
              "createdOn": "2022-04-27T18:22:24.147+0000",
              "objectType": "Content",
              "primaryCategory": "eTextbook",
              "contentDisposition": "inline",
              "lastUpdatedOn": "2022-04-27T18:22:25.154+0000",
              "contentEncoding": "identity",
              "artifactUrl": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_11352567803203584011334/sample.pdf",
              "contentType": "eTextBook",
              "dialcodeRequired": "No",
              "identifier": "do_11352567803203584011334",
              "audience": [
                  "Student"
              ],
              "creator": "N11",
              "os": [
                  "All"
              ],
              "IL_SYS_NODE_TYPE": "DATA_NODE",
              "visibility": "Default",
              "author": "N11",
              "mediaType": "content",
              "osId": "org.ekstep.quiz.app",
              "graph_id": "domain",
              "nodeType": "DATA_NODE",
              "version": 2,
              "versionKey": "1651083745154",
              "license": "CC BY 4.0",
              "idealScreenDensity": "hdpi",
              "framework": "ekstep_ncert_k-12",
              "size": 3028,
              "createdBy": "5a587cc1-e018-4859-a0a8-e842650b9d64",
              "compatibilityLevel": 1,
              "IL_FUNC_OBJECT_TYPE": "Content",
              "name": "Untitled",
              "IL_UNIQUE_ID": "do_11352567803203584011334",
              "node_id": 74024,
              "status": "Draft"
          }
      ]
  }
}
}

