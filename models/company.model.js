
const Joi = require('joi');
var mongoose = require('mongoose');


var companySchema= mongoose.Schema({
      
      name: {
        type: String,
        required: true,
        unique: true
      },
      url: {
        type: String,
      },
      company_size: {
        type: String,
        match:/[0-9]+-[0-9]+/
      },
      website:{
          type:String
      },
      industry: {
        type:String
      },
      type:{
        type:String
      },
      specialties: {
        type:String
      },
      image:{
        type:String
      },
      location:{
        type:String
      },
      founded:{
        type:Number
      },
      age:{
        type:Number
      }
});
companySchema.index({specialties: 'text'});

const Company = mongoose.model('Company', companySchema);

function validateCompany(company) {
    const schema = {
      name: Joi.string().unique().required(),
      url: Joi.string(),
      company_size: Joi.string().regex(/[0-9]{8}/),
      website: Joi.string(),
      industry: Joi.string(),
      type: Joi.string(),
      specialties: Joi.string(),
      image: Joi.string(),
      location: Joi.string(),
      founded: Joi.number(),
      age: Joi.number(),
    };  
    return Joi.validate(company, schema);  }



exports.Company = Company; 
exports.validate = validateCompany;
exports.companySchema = companySchema;
