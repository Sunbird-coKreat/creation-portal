curl --location --request POST '{{host}}/object/category/definition/v4/create' \
--header 'Content-Type: application/json' \
--data-raw '{
  "request": {
    "objectCategoryDefinition": {
      "categoryId": "obj-cat:digital-textbook",
      "targetObjectType": "Collection",
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
              "default": {
                "enabled": "No",
                "autoBatch": "No"
              },
              "additionalProperties": false
            },
            "additionalCategories": {
              "type": "array",
              "items": {
                "type": "string",
                "default": "Textbook"
              }
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
        },
        "childMetadata": {
          "templateName": "",
          "required": [],
          "properties": [
            {
              "code": "name",
              "editable": true,
              "displayProperty": "Editable",
              "dataType": "text",
              "renderingHints": {
                "class": "sb-g-col-lg-1 required"
              },
              "description": "Name",
              "index": 1,
              "label": "Name",
              "required": true,
              "name": "Name",
              "inputType": "text",
              "placeholder": "Name",
              "validations": [
                {
                  "type": "maxLength",
                  "value": "50",
                  "message": "Input is Exceeded"
                },
                {
                  "type": "required",
                  "message": "Name is required"
                }
              ]
            },
            {
              "code": "author",
              "dataType": "text",
              "description": "Author",
              "editable": true,
              "index": 2,
              "inputType": "text",
              "label": "Author:",
              "name": "Author",
              "placeholder": "Author",
              "tooltip": "Provide name of creator of this content.",
              "renderingHints": {
                "class": "sb-g-col-lg-1 required"
              },
              "required": true,
              "validations": [
                {
                  "type": "required",
                  "message": "Author is required"
                }
              ]
            },
            {
              "code": "copyright",
              "dataType": "text",
              "description": "Copyright",
              "editable": true,
              "index": 3,
              "inputType": "text",
              "label": "Copyright and Year:",
              "name": "Copyright",
              "placeholder": "Enter Copyright and Year",
              "tooltip": "If you are an individual, creating original content, you are the copyright holder. If you are creating this course content on behalf of an organisation, the organisation may be the copyright holder. ",
              "renderingHints": {
                "class": "sb-g-col-lg-1 required"
              },
              "required": true,
              "validations": [
                {
                  "type": "required",
                  "message": "Copyright is required"
                }
              ]
            },
            {
              "code": "license",
              "visible": true,
              "editable": true,
              "displayProperty": "Editable",
              "dataType": "text",
              "renderingHints": {
                "class": "sb-g-col-lg-1 required"
              },
              "description": "Subject of the Content to use to teach",
              "index": 4,
              "label": "License:",
              "required": true,
              "name": "license",
              "inputType": "select",
              "placeholder": "license",
              "tooltip": "Choose the more appropriate Creative commons license for this Content. ",
              "validations": [
                {
                  "type": "required",
                  "message": "License is required"
                }
              ]
            },
            {
              "code": "attributions",
              "dataType": "list",
              "description": "Attributions",
              "editable": true,
              "index": 5,
              "inputType": "text",
              "label": "Attributions :",
              "name": "attribution",
              "placeholder": "",
              "tooltip": "If you have relied on another work to create this content, provide the name of that creator and the source of that work.",
              "renderingHints": {
                "class": "sb-g-col-lg-1"
              },
              "required": false
            },
            {
              "code": "board",
              "visible": true,
              "editable": false,
              "dataType": "text",
              "renderingHints": {
                "class": "sb-g-col-lg-1"
              },
              "description": "Board",
              "label": "Board",
              "required": false,
              "name": "Board/Syllabus",
              "inputType": "select",
              "placeholder": "Select Board/Syllabus"
            },
            {
              "code": "medium",
              "visible": true,
              "editable": false,
              "dataType": "list",
              "renderingHints": {
                "class": "sb-g-col-lg-1"
              },
              "description": "Medium",
              "label": "Medium",
              "required": false,
              "name": "Medium",
              "inputType": "nestedselect",
              "placeholder": "Select Medium"
            },
            {
              "code": "gradeLevel",
              "visible": false,
              "editable": false,
              "dataType": "list",
              "renderingHints": {
                "class": "sb-g-col-lg-1"
              },
              "description": "Class",
              "label": "Class",
              "required": true,
              "name": "Class",
              "inputType": "nestedselect",
              "placeholder": "Select Class"
            },
            {
              "code": "subject",
              "visible": true,
              "editable": false,
              "dataType": "list",
              "renderingHints": {
                "class": "sb-g-col-lg-1"
              },
              "description": "",
              "label": "Subject",
              "required": false,
              "name": "Subject",
              "inputType": "nestedselect",
              "placeholder": "Select Subject"
            },
            {
              "code": "contentPolicyCheck",
              "visible": true,
              "editable": true,
              "displayProperty": "Editable",
              "renderingHints": {
                "class": "sb-g-col-lg-1 required"
              },
              "description": "Content Policy check",
              "index": 7,
              "labelHtml": "<p class='font-italic'>I agree that by submitting / publishing this Content, I confirm that this Content complies with prescribed guidelines, including the Terms of Use and Content Policy and that I consent to publish it under the <a class='link font-weight-bold'  href='https://creativecommons.org/licenses' target='_blank'>Creative Commons Framework in </a> accordance with the  <a class='link font-weight-bold'  href='/terms-of-use.html' target='_blank'> Content Policy.</a> I have made sure that I do not violate others' copyright or privacy rights.</p>",
              "required": true,
              "name": "contentPolicyCheck",
              "inputType": "checkbox",
              "placeholder": "Content Policy Check",
              "validations": [
                {
                  "type": "required",
                  "message": "Content Policy Check is required"
                }
              ]
            }
          ]
        }
      }
    }
  }
}'
