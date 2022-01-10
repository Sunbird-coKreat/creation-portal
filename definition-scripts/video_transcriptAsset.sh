curl --location --request POST '{{host}}/object/category/v4/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "request": {
        "objectCategory": {
            "name": "Video transcript",
            "description": "Video transcript"
        }
    }
}'


curl --location --request POST '{{host}}/object/category/definition/v4/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "request":{
        "objectCategoryDefinition":{
            "categoryId": "obj-cat:video-transcript",
            "targetObjectType": "Asset",
            "objectMetadata":{
                "config":{},
                "schema":{
                  "properties": {
                        "mimeType": {
                            "type": "string",
                            "enum": [
                                "application/x-subrip"
                            ],
                            "default": "application/x-subrip"
                        }
                    }
                }
            }
        }
    }
}'
