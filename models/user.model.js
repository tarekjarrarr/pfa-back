
const Joi = require('joi');
var mongoose = require('mongoose');

var userSchema= mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
      },
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
      },
      password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
      },
      position:{
          type:String,
          required:true
      },
      phone: {
        type:String,
        match: /[0-9]{8}/
      },
      dateOfBirth:{
        type:Date
      },
      role: {
        type:String,
        enum:['user','admin']
      }
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
      fullname: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(3).max(255),
      role: Joi.string().valid('user','admin'),
      phone: Joi.string().regex(/[0-9]{8}/),
      dateOfBirth: Joi.date(),
      position:Joi.string().required()
    };  
    return Joi.validate(user, schema);  }



exports.User = User; 
exports.validate = validateUser;
exports.userSchema = userSchema
