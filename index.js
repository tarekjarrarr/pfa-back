var express = require('express');
const swaggerOptions = require("./util/swaggerObjects");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI=require('swagger-ui-express');
const mongoose=require('mongoose');
const bp = require('body-parser');
require('dotenv').config();

//set app
var app = express();


//Swagger API Documentation 
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));



app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

// Set port
const port = process.env.PORT || "3000";
app.set("port", port); 
console.log(port);
//server
app.listen(port, () => console.log(`Server running on :${port}`));

//connect to database
mongoose
  .connect(process.env.DATABASE_URI, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB..."));




