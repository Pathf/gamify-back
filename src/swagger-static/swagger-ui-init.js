
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/sign-in": {
        "post": {
          "operationId": "AuthController_handleSignIn",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SwaggerBody"
                }
              }
            }
          },
          "responses": {
            "default": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SwaggerResponse"
                  }
                }
              }
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/google": {
        "get": {
          "operationId": "GoogleAuthController_handleAuth",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/google/redirect": {
        "get": {
          "operationId": "GoogleAuthController_handleAuthRedirect",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/google/register": {
        "get": {
          "operationId": "GoogleAuthController_handleRegister",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/auth/google/register/redirect": {
        "get": {
          "operationId": "GoogleAuthController_handleRegisterRedirect",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ]
        }
      },
      "/user/{id}": {
        "get": {
          "operationId": "UserController_handleGetUserById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "users"
          ]
        },
        "post": {
          "operationId": "UserController_handleUpdateAccount",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "users"
          ]
        },
        "delete": {
          "operationId": "UserController_handleDeleteAccount",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "users"
          ]
        }
      },
      "/users": {
        "get": {
          "operationId": "UserController_handleGetUsers",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "users"
          ]
        }
      },
      "/user": {
        "post": {
          "operationId": "UserController_handleRegisterUser",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "users"
          ]
        }
      },
      "/draws": {
        "get": {
          "operationId": "DrawController_handleGetDraws",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        },
        "post": {
          "operationId": "DrawController_handleOrganizeDraw",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draw/{id}/run": {
        "get": {
          "operationId": "DrawController_handleRunDraw",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draw/{id}/close": {
        "get": {
          "operationId": "DrawController_handleCloseDraw",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draw/{id}": {
        "delete": {
          "operationId": "DrawController_handleCancelDraw",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draw/{id}/participation": {
        "post": {
          "operationId": "ParticipationController_handleRegisterParticipation",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draw/{id}/participation/{participantId}": {
        "delete": {
          "operationId": "ParticipationController_handleCancelParticipation",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "participantId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draw/{id}/condition": {
        "post": {
          "operationId": "ConditionController_handleRegisterCondition",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draw/{id}/condition/{conditionId}": {
        "delete": {
          "operationId": "ConditionController_handleCancelCondition",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "conditionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draw/{drawId}/participant/{participantId}/result": {
        "get": {
          "operationId": "ChainedDrawController_handleGetDrawByParticipantId",
          "parameters": [
            {
              "name": "drawId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "participantId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draws/participant/{participantId}/result": {
        "get": {
          "operationId": "ChainedDrawController_handleGetChainedDrawsByIdParticipant",
          "parameters": [
            {
              "name": "participantId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      },
      "/draw/{drawId}/result": {
        "get": {
          "operationId": "ChainedDrawController_handleGetDrawById",
          "parameters": [
            {
              "name": "drawId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "draws"
          ]
        }
      }
    },
    "info": {
      "title": "Gamify API",
      "description": "L'ensemble des routes de l'API Gamify",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "auth",
        "description": ""
      },
      {
        "name": "draws",
        "description": ""
      },
      {
        "name": "users",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "schemas": {
        "SwaggerBody": {
          "type": "object",
          "properties": {
            "emailAddress": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "emailAddress",
            "password"
          ]
        },
        "SwaggerResponse": {
          "type": "object",
          "properties": {
            "access_token": {
              "type": "string"
            },
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "emailAddress": {
              "type": "string"
            }
          },
          "required": [
            "access_token",
            "id",
            "name",
            "emailAddress"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
