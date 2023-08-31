curl -L -X POST '{{host}}/object/category/definition/v4/create' \
-H 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "objectCategoryDefinition": {
      "categoryId": "obj-cat:course",
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
                  "default": "Yes"
                },
                "autoBatch": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ],
                  "default": "Yes"
                }
              },
              "default": {
                "enabled": "Yes",
                "autoBatch": "Yes"
              },
              "additionalProperties": false
            },
            "monitorable": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "progress-report",
                  "score-report"
                ]
              }
            },
            "credentials": {
              "type": "object",
              "properties": {
                "enabled": {
                  "type": "string",
                  "enum": [
                    "Yes",
                    "No"
                  ],
                  "default": "Yes"
                }
              },
              "default": {
                "enabled": "Yes"
              },
              "additionalProperties": false
            },
            "userConsent": {
              "type": "string",
              "enum": [
                "Yes",
                "No"
              ],
              "default": "Yes"
            },
            "mimeType": {
              "type": "string",
              "enum": [
                "application/vnd.ekstep.content-collection"
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
              "index": 3,
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
              },
              "description": "Subject of the Content to use to teach",
              "index": 6,
              "label": "License:",
              "required": true,
              "name": "license",
              "inputType": "select",
              "placeholder": "license",
              "tooltip": "Choose the more appropriate Creative commons license for this Content. "
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