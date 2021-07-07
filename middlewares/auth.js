const config=require('config');
const jwt=require('jsonwebtoken');
require('dotenv').config();


module.exports=function(req,res,next){
    //get the token from the header if present
    const header =req.headers["authorization"];
    const bearer=header.split(" ");
    const token=bearer[1];
    //if token not found
    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
      console.log(token);
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token,process.env.myprivatekey);
        req.user = decoded;
        next();
      } catch (ex) {
        //if invalid token
        res.status(400).send("Invalid token.");
      }
}