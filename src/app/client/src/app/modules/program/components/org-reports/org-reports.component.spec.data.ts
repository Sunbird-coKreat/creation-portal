export const mockData = {
    userProfile: {
        userId: '123456789',
        rootOrg : {
          slug: 'sunbird'
        }
    },
    resourceBundle: {
        'messages': {
          'emsg': {
            'm0076': 'No data available to download'
          }
        }
    },
    reportReadSuccess: {
        responseCode : 'OK',
        result : {
          signedUrl: 'https://vdnsample.blob.core.window.net/sample/sample.csv'
        }
    },
    reportReadFailed: {
        responseCode : 'CLIENT_ERROR',
    }
};
