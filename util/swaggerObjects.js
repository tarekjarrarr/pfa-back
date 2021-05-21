const { example, object, number, array } = require("joi");

const swaggerDefs = {
    User:{
      properties:{
        name:{
          type:"string"
        },
        email:{
          type:"string"
        },
        password:{
          type:"string"
        },
        phone:{
          type:"string"
        },
        dateOfBirth:{
          type:"date"
        },
        role:{
          type:"string",
          enum:['admin','user']
        }
      }
    }} 

    const swaggerOptions = {
        swaggerDefinition: {
          info: {
            title: 'Wevioo PFA API',
            description: 'Wevioo PFA Project API information',
            servers: [
              
            ], 
          },
          Paths:{

          },
          definitions: swaggerDefs},
          apis: [
            'routes/*.js'
          ]
        }
    

    module.exports = swaggerOptions;;