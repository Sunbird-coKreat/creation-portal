curl -L -X POST '{{host}}/object/category/definition/v4/create' \
-H 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "objectCategoryDefinition": {
      "categoryId": "obj-cat:course-assessment",
      "targetObjectType": "Content",
      "objectMetadata": {
        "config": {},
        "schema": {
          "properties": {
            "trackable": {
              "type": "object",
              "properties": {
                "enabled": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ],
                  "default": "No"
                },
                "autoBatch": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ],
                  "default": "No"
                }
              },
              "additionalProperties": false
            },
            "mimeType": {
              "type": "string",
              "enum": [
                "application/vnd.ekstep.ecml-archive"
              ]
            }
          }
        }
      },
      "forms": {
        "create": {
          "templateName": "",
          "required": [],
          "properties": []
        },
        "delete": {},
        "publish": {},
        "review": {},
        "search": {},
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
              "required": false,
              "name": "Name",
              "inputType": "text",
              "placeholder": "Name"
            },
            {
              "code": "board",
              "depends": [
                "medium",
                "gradeLevel",
                "subject"
              ],
              "editable": true,
              "displayProperty": "Editable",
              "dataType": "text",
              "renderingHints": {
                "semanticColumnWidth": "six"
              },
              "description": "Education Board (Like MP Board, NCERT, etc)",
              "index": 2,
              "label": "Board",
              "required": false,
              "name": "Board",
              "inputType": "select",
              "placeholder": "Board"
            },
            {
              "code": "medium",
              "depends": [
                "gradeLevel",
                "subject"
              ],
              "editable": true,
              "dataType": "list",
              "renderingHints": {
                "semanticColumnWidth": "six"
              },
              "description": "Medium of instruction",
              "index": 3,
              "label": "Medium",
              "required": false,
              "name": "Medium",
              "inputType": "multiSelect",
              "placeholder": "Medium"
            },
            {
              "code": "gradeLevel",
              "depends": [
                "subject"
              ],
              "editable": true,
              "dataType": "list",
              "renderingHints": {
                "semanticColumnWidth": "six"
              },
              "description": "Grade",
              "index": 4,
              "label": "Grade",
              "required": false,
              "name": "Grade",
              "inputType": "multiSelect",
              "placeholder": "Grade"
            },
            {
              "code": "subject",
              "editable": true,
              "dataType": "list",
              "renderingHints": {
                "semanticColumnWidth": "six"
              },
              "name": "Subject",
              "description": "Subject of the Content to use to teach",
              "index": 5,
              "inputType": "multiSelect",
              "label": "Subject",
              "placeholder": "Grade",
              "required": false
            },
            {
              "code": "learningOutcome",
              "dataType": "list",
              "description": "",
              "editable": true,
              "index": 6,
              "inputType": "select",
              "label": "Learning Outcome :",
              "name": "Learning Outcome :",
              "placeholder": "Select Learning Outcome",
              "depends": [
                "topic"
              ],
              "renderingHints": {},
              "required": false
            },
            {
              "code": "attributions",
              "dataType": "list",
              "description": "Attributions",
              "editable": true,
              "index": 7,
              "inputType": "text",
              "label": "Attributions",
              "name": "attribution",
              "placeholder": "",
              "tooltip": "If you have relied on another work to create this content, provide the name of that creator and the source of that work.",
              "renderingHints": {},
              "required": false
            },
            {
              "code": "author",
              "dataType": "text",
              "description": "Author",
              "editable": true,
              "index": 8,
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
              "index": 9,
              "inputType": "text",
              "label": "Copyright",
              "name": "Copyright",
              "placeholder": "Copyright",
              "tooltip": "If you are an individual, creating original content, you are the copyright holder. If you are creating this course content on behalf of an organisation, the organisation may be the copyright holder. ",
              "renderingHints": {},
              "required": false
            }
          ]
        }
      }
    }
  }
}'