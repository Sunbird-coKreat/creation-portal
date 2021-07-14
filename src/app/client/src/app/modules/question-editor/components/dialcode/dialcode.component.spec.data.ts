export const mockData = {
  dialcodeReserveSuccess: {
    id: 'api.v1.reserve',
    ver: '1.0',
    ts: '2021-06-07T11:44:46.942Z',
    params: {
      resmsgid: 'c24e47e0-c785-11eb-8f0d-5b69b763f5d8',
      msgid: '65505a96-4c87-7aba-f92b-852e2e02364b',
      status: 'successful',
      err: null,
      errmsg: null,
    },
    responseCode: 'OK',
    result: {
      count: 2,
      reservedDialcodes: { N9V2K1: 0, X8M4C6: 1 },
      node_id: 'do_113296158955659264158',
      versionKey: '1623066286849',
      processId: '7aefc4c4-e734-48b7-936a-e7312a03977c',
    },
  },
  dialcodeReserveFailed: {
    id: 'api.v1.reserve',
    ver: '1.0',
    ts: '2021-06-07T12:02:29.813Z',
    params: {
      resmsgid: '3bd38650-c788-11eb-8f0d-5b69b763f5d8',
      msgid: null,
      status: 'failed',
      err: null,
      errmsg: null,
    },
    responseCode: 'CLIENT_ERROR',
    result: {
      count: 3,
      messages:
        'No new DIAL Codes have been generated, as requested count is less or equal to existing reserved dialcode count.',
      reservedDialcodes: { N9V2K1: 0, X8M4C6: 1, V5U1H3: 2 },
      node_id: 'do_113296158955659264158',
    },
  },
  downloadQRcodeCompleted: {
    id: 'api.process.status',
    ver: '1.0',
    ts: '2021-06-07T12:11:07.319Z',
    params: {
      resmsgid: '7048ac70-c789-11eb-8f0d-5b69b763f5d8',
      msgid: 'ddd6dcf6-adce-24c7-8fa9-960963144fea',
      status: 'successful',
      err: null,
      errmsg: null,
    },
    responseCode: 'OK',
    result: {
      status: 'completed',
      url: 'https://sunbirddev.blob.core.windows.net/dial/01309282781705830427/do_113296158955659264158_1623066349548.zip',
    },
  },
  downloadQRcodeInProcess: {
    id: 'api.process.status',
    ver: '1.0',
    ts: '2021-06-07T12:11:07.319Z',
    params: {
      resmsgid: '7048ac70-c789-11eb-8f0d-5b69b763f5d8',
      msgid: 'ddd6dcf6-adce-24c7-8fa9-960963144fea',
      status: 'successful',
      err: null,
      errmsg: null,
    },
    responseCode: 'OK',
    result: {
      status: 'in-process'
    },
  },
};
