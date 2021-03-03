curl -L -X POST '{{host}}/object/category/definition/v4/create' \
-H 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "objectCategoryDefinition": {
      "categoryId": "obj-cat:exam-question",
      "targetObjectType": "Content",
      "objectMetadata": {
        "config": {
          "sourcingConfig": {
            "editor": [
              {
                "mimetype": "application/vnd.ekstep.ecml-archive",
                "type": "question"
              }
            ]
          }
        },
        "schema": {
          "properties": {
            "mimeType": {
              "type": "string",
              "enum": [
                "application/vnd.ekstep.ecml-archive"
              ]
            },
            "maxQuestions": {
              "type": "number",
              "default": 1
            }
          }
        }
      },
      "languageCode": [],
      "forms": {
        "update": {
          "templateName": "",
          "required": [],
          "properties": [
            {
              "code": "name",
              "editable": true,
              "displayProperty": "Editable",
              "dataType": "text",
              "renderingHints": {
                "semanticColumnWidth": "twelve"
              },
              "description": "Name",
              "index": 1,
              "label": "Name",
              "required": true,
              "name": "Name",
              "inputType": "text",
              "placeholder": "Name"
            },
            {
              "code": "learningOutcome",
              "dataType": "list",
              "description": "",
              "editable": true,
              "index": 2,
              "inputType": "multiSelect",
              "label": "Learning Outcome :",
              "name": "Learning Outcome :",
              "placeholder": "Select Learning Outcome",
              "depends": [
                "topic"
              ],
              "renderingHints": {},
              "required": true,
              "visible": true
            },
            {
              "code": "author",
              "dataType": "text",
              "description": "Author",
              "editable": true,
              "index": 4,
              "inputType": "text",
              "label": "Author",
              "name": "Author",
              "placeholder": "Author",
              "tooltip": "Provide name of creator of this content.",
              "renderingHints": {},
              "required": false
            },
            {
              "code": "copyright",
              "dataType": "text",
              "description": "Copyright",
              "editable": true,
              "index": 5,
              "inputType": "text",
              "label": "Copyright and Year",
              "name": "Copyright",
              "placeholder": "Copyright",
              "tooltip": "If you are an individual, creating original content, you are the copyright holder. If you are creating this course content on behalf of an organisation, the organisation may be the copyright holder. ",
              "renderingHints": {},
              "required": true
            },
            {
              "code": "license",
              "visible": true,
              "editable": true,
              "displayProperty": "Editable",
              "dataType": "text",
              "renderingHints": {
                "semanticColumnWidth": "six"
              }
            },
            {
              "code": "bloomslevel",
              "dataType": "list",
              "description": "Learning Level For The Content",
              "editable": true,
              "inputType": "select",
              "label": "Learning Level",
              "name": "LearningLevel",
              "placeholder": "Select Learning Levels",
              "required": true,
              "visible": true,
              "defaultValue": [
                "Knowledge (Remembering)",
                "Comprehension (Understanding)",
                "Application (Transferring)",
                "Analysis (Relating)",
                "Evaluation (Judging)",
                "Synthesis (Creating)"
              ]
            },
            {
              "code": "marks",
              "visible": true,
              "editable": true,
              "displayProperty": "Marks",
              "dataType": "text",
              "label": "Marks",
              "name": "Marks",
              "required": true,
              "renderingHints": {
                "semanticColumnWidth": "six"
              },
              "description": "Marks of the question in the examination",
              "index": 6,
              "inputType": "text",
              "placeholder": "0"
            },
            {
              "code": "additionalCategories",
              "visible": true,
              "editable": true,
              "displayProperty": "Editable",
              "dataType": "list",
              "renderingHints": {
                "semanticColumnWidth": "six"
              },
              "description": "Subject of the Content to use to teach",
              "index": 7,
              "label": "Content Additional Categories",
              "required": false,
              "name": "additionalCategories",
              "inputType": "multiSelect",
              "placeholder": "Content Additional Categories"
            }
          ]
        }
      }
    }
  }
}'
