const { Company } = require("../models/company.model")
const request = require('request');
const array = require("joi/lib/types/array");



exports.getAllCompanies=async function(req,res){
    const page = parseInt(req.params.page)
    const limit = parseInt(req.params.limit)
  
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
  
    const results = {}
  
      if (endIndex < await Company.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await Company.find().limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        res.json(res.paginatedResults)
        } catch (e) {
        res.status(500).json({ message: e.message })
      }
}

exports.searchCompanies=async function(req,res){
    const page = parseInt(req.params.page)
    const limit = parseInt(req.params.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    var results = {}

    try{
      const locationRegex = new RegExp(req.body.location, 'i');
      const industryRegex = new RegExp(req.body.industry, 'i');
      const typeRegex = new RegExp(req.body.type, 'i');
      const companiesizeRegex = new RegExp(req.body.company_size, 'i');
    
      if(req.body.specialties)
        {
          results.results = await Company.find({$text:{$search:"\""+req.body.specialties.join("\"\,\"")+"\""}})
                                .where('industry').equals(industryRegex)
                                .where('type').equals(typeRegex)
                                .where('company_size').equals(companiesizeRegex)
                                .where('location').equals(locationRegex)
                                .limit(limit).skip(startIndex).exec();
          results.number=await Company.find({$text:{$search:"\""+req.body.specialties.join("\"\,\"")+"\""}})
                                      .where('industry').equals(industryRegex)
                                      .where('type').equals(typeRegex)
                                      .where('company_size').equals(companiesizeRegex)
                                      .where('location').equals(locationRegex)
                                      .count();
          }
      else 
        {
          results.results = await Company.find({})
                                    .where('industry').equals(industryRegex)
                                    .where('type').equals(typeRegex)
                                    .where('company_size').equals(companiesizeRegex)
                                    .where('location').equals(locationRegex)
                                    .limit(limit).skip(startIndex).exec();
          results.number= await Company.find({})
                                      .where('industry').equals(industryRegex)
                                      .where('type').equals(typeRegex)
                                      .where('company_size').equals(companiesizeRegex)
                                      .where('location').equals(locationRegex)
                                      .count();
        }
        console.log(results.number)
    }
    catch(e){res.status(500).json({ message: e.message })}
    
      if (endIndex <  results.number) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      res.json(results)
}

exports.recommendCompanies=async function(req,res){
  const requestOptions = {
    url: 'http://127.0.0.1:1080/predict',
    method: 'POST',
    json: {
      "overview.company_size":req.body.company_size,
      "overview.industry":req.body.industry,
      "overview.type":req.body.type,
      "overview.age":req.body.age
    }
  };
  
  request(requestOptions, (err, response, body) => {
    if (err) {
      console.log(err);
    } else if (response.statusCode === 200) {
      var array=Object.keys(response.body).map(key => {return response.body[key];});
      filteredArray=[];
      filteredLocations=[];
      if(req.body.specialties&&req.body.specialties.length>0){
            let searchTerm = req.body.specialties;
            let keywords = searchTerm.split(' ');
            let companyBySearch = [];
            array.map((company) => {
              specialties=company['overview.specialties'].split(', ');
              let allKeywordsMatch = true;
              keywords.map((keyword) => {
                if (specialties.some((tag) => tag.toLowerCase().indexOf(keyword.toLowerCase()) !== -1)) {
                  allKeywordsMatch = true;
                } else {
                    allKeywordsMatch = false;
                  }
                });
              if (allKeywordsMatch) companyBySearch.push(company);
              });
              filteredArray=companyBySearch;
      }
      else(filteredArray=array);

      if(req.body.location&&req.body.location.length>0){
        let locationKey=req.body.location;
        let companyByLocation = [];
        filteredArray.map((company) => {
          locations=company['overview.location'];
          let locationMatch = false;
          if ((locations.toLowerCase().search(locationKey.toLowerCase())) !== -1) {locationMatch = true;}
          if (locationMatch) companyByLocation.push(company);
        });
        filteredLocations=companyByLocation;    
      };
      
      res.status(200).json({"result":array,"filteredKeywords":filteredArray,"filteredLocations":filteredLocations});
    } else {
      console.log(response.statusCode);}
    });
}

exports.detailsCompany=async function(req,res){
  try{
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).send('Could not find a company with this id.');
    res.status(200).send(company); 
}catch(e){res.send(e.message)}
  
}

exports.getStats=async function(req,res){
  var nbCompanies=0;
  try {nbCompanies=await Company.countDocuments().exec();}
  catch (e){console.log(e);}
  res.status(200).send((nbCompanies).toString());
}

