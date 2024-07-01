curl -L -X POST '{{host}}/object/category/definition/v4/create' \
-H 'Content-Type: application/json' \
--data-raw '{
	"request": {
		"objectCategoryDefinition": {
			"categoryId": "obj-cat:question-paper_{{rootOrgId}}",
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
						"appIcon": {
							"type": "string",
							"default": "https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11320764935163904015/artifact/2020101299.png"
						},
						"author": {
							"type": "string",
							"default": "SCERT Haryana"
						},
						"visibility": {
							"type": "string",
							"default": "Private"
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
					"properties": [{
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
							"children": [{
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
							"children": [{
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
				},
				"childMetadata": {
					"templateName": "",
					"required": [],
					"properties": [{
							"code": "name",
							"editable": true,
							"displayProperty": "Editable",
							"dataType": "text",
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"description": "Name",
							"index": 1,
							"label": "Name",
							"required": false,
							"name": "Name",
							"inputType": "text",
							"placeholder": "Name",
							"validations": [{
								"type": "maxlength",
								"value": "50",
								"message": "Input is Exceeded"
							}]
						},
						{
							"code": "board",
							"visible": true,
							"depends": [],
							"editable": false,
							"dataType": "text",
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"description": "Board",
							"label": "Board/Syllabus of the audience",
							"required": true,
							"name": "Board/Syllabus",
							"inputType": "select",
							"placeholder": "Select Board/Syllabus"
						},
						{
							"code": "medium",
							"visible": true,
							"depends": [
								"board"
							],
							"editable": false,
							"dataType": "list",
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"description": "",
							"label": "Medium(s) of the audience",
							"required": true,
							"name": "Medium",
							"inputType": "nestedselect",
							"placeholder": "Select Medium"
						},
						{
							"code": "gradeLevel",
							"visible": true,
							"depends": [
								"board",
								"medium"
							],
							"editable": false,
							"dataType": "list",
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"description": "Class",
							"label": "Class(es) of the audience",
							"required": true,
							"name": "Class",
							"inputType": "nestedselect",
							"placeholder": "Select Class"
						},
						{
							"code": "subject",
							"visible": true,
							"depends": [
								"board",
								"medium",
								"gradeLevel"
							],
							"editable": true,
							"dataType": "list",
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"description": "",
							"label": "Subject(s) of the audience",
							"required": true,
							"name": "Subject",
							"inputType": "nestedselect",
							"placeholder": "Select Subject"
						},
						{
							"code": "topic",
							"visible": true,
							"editable": true,
							"dataType": "list",
							"depends": [
								"board",
								"medium",
								"gradeLevel",
								"subject"
							],
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"name": "Topic",
							"description": "Choose chapters",
							"inputType": "topicselector",
							"label": "Chapters covered",
							"placeholder": "Choose chapters",
							"required": false
						},
						{
							"code": "learningOutcome",
							"dataType": "list",
							"description": "",
							"editable": true,
							"inputType": "nestedselect",
							"label": "Competency",
							"name": "Learning Outcome",
							"placeholder": "Select competencies",
							"depends": [
								"topic"
							],
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"required": false
						},
						{
							"code": "marks",
							"dataType": "text",
							"description": "Marks",
							"editable": true,
							"inputType": "text",
							"label": "Marks:",
							"name": "Marks",
							"placeholder": "Marks",
							"tooltip": "Provide marks of this content.",
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
						 "validations": [
                {
                   "type": "pattern",
                    "value": "(([0-9]+)([.]){0,1}([0-9]*))",
                    "message": "Input should be numeric"
                }
              ],
							"required": true
						},
						{
							"code": "bloomsLevel",
							"inputType": "nestedselect",
							"dataType": "list",
							"description": "Cognitive processes involved to answer the question set",
							"placeholder": "Select skills",
							"range": [{
									"bloomLevel": "remember",
									"name": "Knowledge"
								},
								{
									"bloomLevel": "understand",
									"name": "Understanding"
								},
								{
									"bloomLevel": "apply",
									"name": "Application"
								}
							],
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"required": false,
							"visible": true,
							"editable": true,
							"name": "Learning Level",
							"label": "Skills Tested"
						},
						{
							"code": "author",
							"dataType": "text",
							"description": "Author",
							"editable": true,
							"index": 5,
							"inputType": "text",
							"label": "Author",
							"name": "Author",
							"placeholder": "Author",
							"tooltip": "Provide name of creator of this content.",
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"required": true
						},
						{
							"code": "copyright",
							"dataType": "text",
							"description": "Copyright",
							"editable": true,
							"index": 4,
							"inputType": "text",
							"label": "Copyright and Year",
							"name": "Copyright",
							"default": "SCERT 2021",
							"placeholder": "Enter Copyright and Year",
							"tooltip": "If you are an individual, creating original content, you are the copyright holder. If you are creating this course content on behalf of an organisation, the organisation may be the copyright holder. ",
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"required": true
						},
						{
							"code": "license",
							"visible": true,
							"editable": true,
							"displayProperty": "Editable",
							"dataType": "text",
							"renderingHints": {
								"class": "sb-g-col-lg-1"
							},
							"description": "Subject of the Content to use to teach",
							"index": 6,
							"label": "License:",
							"required": true,
							"name": "license",
							"inputType": "multiSelect",
							"placeholder": "license",
							"tooltip": "Choose the more appropriate Creative commons license for this Content. "
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
							"labelHtml": "<p class=\'font-italic\'>I agree that by submitting / publishing this Content, I confirm that this Content complies with prescribed guidelines, including the Terms of Use and Content Policy and that I consent to publish it under the <a class=\'link font-weight-bold\'  href=\'https://creativecommons.org/licenses\' target=\'_blank\'>Creative Commons Framework in </a> accordance with the  <a class=\'link font-weight-bold\'  href=\'/terms-of-use.html\' target=\'_blank\'> Content Policy.</a> I have made sure that I do not violate others\' copyright or privacy rights.</p>",
							"required": true,
							"name": "contentPolicyCheck",
							"inputType": "checkbox",
							"placeholder": "Content Policy Check",
							"validations": [{
								"type": "required",
								"message": "Content Policy Check is required"
							}]
						}
					]
				}
			}
		}
	}
}'
