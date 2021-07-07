const Joi = require('joi');
var mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);
var User=require('../models/user.model');

var ticketSchema= mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      date: {
        type: String,
        required:true
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      }
      ,
      company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company'
      },
      topic:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Topic"
      }
});


const Ticket = mongoose.model('Ticket', ticketSchema);

function validateTicket(ticket) {
    const schema = {
      title: Joi.string().required(),
      date: Joi.string().required(),
      addedBy:Joi.objectId().required()
    };  
    return Joi.validate(ticket, schema);  }



exports.Ticket = Ticket; 
exports.validateTicket = validateTicket;
exports.ticketSchema = ticketSchema;
