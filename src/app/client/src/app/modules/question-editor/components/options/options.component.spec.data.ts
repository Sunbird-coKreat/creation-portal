export const mockOptionData = {
  editorOptionData: {
    question:
      '<p><span style="color:rgb(0,0,0);">D.D.T. was invented by?</span></p>',
    options: [
      {
        body: '<p><span style="color:rgb(0,0,0);">Mosley</span></p>',
      },
      {
        body: '<p><span style="color:rgb(0,0,0);">Rudolf</span></p>',
      },
      {
        body: '<p><span style="color:rgb(0,0,0);">Karl Benz</span></p>',
      },
      {
        body: '<p><span style="color:rgb(0,0,0);">Dalton</span></p>',
      },
    ],
    templateId: 'mcq-split-grid',
    answer: '0',
    numberOfOptions: 4,
  },
  prepareMcqBody: {
    templateId: 'mcq-vertical',
    name: 'Multiple Choice Question',
    responseDeclaration: {
      response1: {
        maxScore: 1,
        cardinality: 'single',
        type: 'integer',
        correctResponse: {
          value: '0',
          outcomes: {
            SCORE: 1,
          },
        },
      },
    },
    interactionTypes: ['choice'],
    interactions: {
      response1: {
        type: 'choice',
        options: [
          {
            label: '<p><span style="color:rgb(0,0,0);">Mosley</span></p>',
            value: 0,
          },
          {
            label: '<p><span style="color:rgb(0,0,0);">Rudolf</span></p>',
            value: 1,
          },
          {
            label: '<p><span style="color:rgb(0,0,0);">Karl Benz</span></p>',
            value: 2,
          },
          {
            label: '<p><span style="color:rgb(0,0,0);">Dalton</span></p>',
            value: 3,
          },
        ],
      },
    },
    editorState: {
      options: [
        {
          answer: true,
          value: {
            body: '<p><span style="color:rgb(0,0,0);">Mosley</span></p>',
            value: 0,
          },
        },
        {
          answer: false,
          value: {
            body: '<p><span style="color:rgb(0,0,0);">Rudolf</span></p>',
            value: 1,
          },
        },
        {
          answer: false,
          value: {
            body: '<p><span style="color:rgb(0,0,0);">Karl Benz</span></p>',
            value: 2,
          },
        },
        {
          answer: false,
          value: {
            body: '<p><span style="color:rgb(0,0,0);">Dalton</span></p>',
            value: 3,
          },
        },
      ],
    },
    qType: 'MCQ',
    primaryCategory: 'Multiple Choice Question',
  },
};
