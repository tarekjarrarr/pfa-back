const Joi = require('joi');
var mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);
var User=require('../models/user.model');
var Company=require('../models/company.model');
var Ticket=require('../models/ticket.model');


var topicSchema= mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
      },
      created: {
        type: String
      },
      modified: {
        type: String
      },
      status:{
        type:String,
        enum:["open","closed"]
    },
      creator:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
      },
      companies:[{
        company:{
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Company'
            },
        tickets:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
            }]
        }]
});


const Topic = mongoose.model('Topic', topicSchema);

function validateTopic(topic) {
    const schema = {
      title: Joi.string().required(),
      description: Joi.string().required(),
      status: Joi.string().valid('open','closed'),
      creator: Joi.objectId().required()
    };  
    return Joi.validate(topic, schema);  }



exports.Topic = Topic; 
exports.validateTopic = validateTopic;
exports.topicSchema = topicSchema;
