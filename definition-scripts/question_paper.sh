curl -L -X POST '{{host}}/object/category/definition/v4/create' \
-H 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "objectCategoryDefinition": {
      "categoryId": "obj-cat:question-paper",
      "targetObjectType": "Collection",
      "objectMetadata": {
        "config": {},
        "schema": {
          "properties": {
            "mimeType": {
              "type": "string",
              "enum": [
                "application/vnd.ekstep.content-collection"
              ]
            },
            "printable": {
              "type": "boolean",
              "default": true
            }
          }
        }
      },
      "languageCode": [],
      "forms": {
        "blueprintCreate": {
          "templateName": "",
          "required": [],
          "properties": [
            {
              "code": "topics",
              "dataType": "list",
              "description": "",
              "editable": true,
              "index": 0,
              "inputType": "multiSelect",
              "label": "Chapters",
              "name": "Chapters",
              "placeholder": "Please select chapters",
              "renderingHints": {},
              "required": true
            },
            {
              "code": "learningOutcomes",
              "dataType": "list",
              "description": "",
              "editable": true,
              "index": 1,
              "inputType": "multiSelect",
              "label": "Competencies",
              "name": "Competencies",
              "placeholder": "Please select Competencies",
              "depends": [
                "chapters"
              ],
              "renderingHints": {},
              "required": true
            },
            {
              "code": "learningLevels",
              "editable": true,
              "displayProperty": "Editable",
              "dataType": "text",
              "renderingHints": {
                "semanticColumnWidth": "twelve"
              },
              "label": "Skills Tested",
              "required": true,
              "name": "Learning Levels",
              "index": 2,
              "inputType": "select",
              "placeholder": "",
              "default": 0,
              "options": [
                0,
                1,
                2,
                3,
                4,
                5
              ],
              "children": [
                {
                  "type": "learningLevel",
                  "label": "Knowledge",
                  "code": "remember"
                },
                {
                  "type": "learningLevel",
                  "label": "Understanding",
                  "code": "understand"
                },
                {
                  "type": "learningLevel",
                  "label": "Application",
                  "code": "apply"
                }
              ]
            },
            {
              "code": "questionTypes",
              "editable": true,
              "displayProperty": "Editable",
              "dataType": "text",
              "renderingHints": {
                "semanticColumnWidth": "twelve"
              },
              "description": "Question Types",
              "index": 2,
              "label": "Question Types",
              "default": 0,
              "required": true,
              "name": "Question Types",
              "inputType": "select",
              "children": [
                {
                  "type": "questionType",
                  "label": "Objective",
                  "code": "Objective"
                },
                {
                  "type": "questionType",
                  "label": "Very Short Answer",
                  "code": "VSA"
                },
                {
                  "type": "questionType",
                  "label": "Short Answer",
                  "code": "SA"
                },
                {
                  "type": "questionType",
                  "label": "Long Answer",
                  "code": "LA"
                }
              ],
              "options": [
                0,
                1,
                2,
                3,
                4,
                5
              ],
              "placeholder": "Question Types"
            },
            {
              "code": "totalMarks",
              "editable": true,
              "displayProperty": "Editable",
              "dataType": "text",
              "renderingHints": {
                "semanticColumnWidth": "three"
              },
              "description": "Total Marks",
              "index": 4,
              "label": "Total Marks",
              "required": true,
              "default": 0,
              "name": "Total Marks",
              "inputType": "text",
              "placeholder": ""
            }
          ]
        }
      }
    }
  }
}'
