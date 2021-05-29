const {Topic,validateTopic}=require('../models/topic.model');
const {Ticket,validateTicket}=require('../models/ticket.model');
const {Company}=require('../models/company.model');
const {User}=require('../models/user.model');
var moment = require('moment-timezone');
const { result } = require('lodash');

exports.getAllTopics=async function(req,res){
    const topics=await Topic.find().sort({created:'desc'}).populate('creator').populate('companies.company').populate('companies.tickets');
    if(!topics){res.status(400).send('foud problems retrieving topics list');}
    else{res.status(200).send(topics);}
}



exports.updateTopic=async function(req,res){
    const topic =await Topic.findById(req.params.id);
    if (!topic){res.status(400).send('invalid topic id');}
    var updateObject={};
    if (req.body.title&&req.body.title.length>0) updateObject.title=req.body.title;
    if (req.body.description&&req.body.description.length>0) updateObject.description=req.body.description;
    if (req.body.status&&req.body.status.length>0) updateObject.status=req.body.status;
    
    try{ update =await Topic.findByIdAndUpdate(req.params.id, {$set: updateObject});}
    catch(e){res.status(400).send(e.codeName)}
    if (!update) {res.status(400).send('could not save changes to topic')}
    res.status(200).send(topic);
}


exports.deleteTopic=async function(req,res){
    const topic = await Topic.findByIdAndRemove(req.params.id);
    if (!topic) return res.status(404).send('The topic with the given ID was not found.');
    res.send(topic);    
}

exports.createTopic=async function(req,res){
    //validate input
    const {error}=validateTopic(req.body);
    if (error) {console.log(error.details[0]); return res.status(400).send(error.details[0].message);}
    //verify if topic with exact name exists
    const topicExists=await Topic.findOne({title:req.body.title});
    if(topicExists){
        res.send(400).send('topic with this name already exists');
    }
    //verify the existance of the creator
    if(req.body.creator){
        const userExists=await User.findOne({_id:req.body.creator});
        if(!userExists) res.status(400).send('We could not find a user with this ID');
    }
    const topic=new Topic({
        title:req.body.title,
        description:req.body.description,
        created:moment.tz(moment(), 'Africa/Tunis').format('DD/MM/YYYY'),
        status:'open',
        creator:req.body.creator
    });
    await topic.save(function(err){
        if(err)
        return console.log('could not save your new topic',err);
    });
    res.status(200).send(topic);
};

exports.affectCompany=async function(req,res){
    //verify the existance of the topic
    const topic=await Topic.findById(req.params.topicId);
    console.log(topic)
    if (!topic) {return res.status(404).send('The topic with the given ID was not found.');}

    //verify the existance of the company
    const company=await Company.findById(req.params.companyId);
    if(!company){return res.status(404).send('The company with the given ID was not found.');}

    //verify if company already assigned to the topic
    const companyAssigned=await Topic.findById(req.params.topicId).where({"companies.company":req.params.companyId});
    if(companyAssigned){res.status(400).send('this company has already been assigned to this topic');}
    else{
        topic.companies.push({
        company:req.params.companyId
        });

        topic.save();
        res.status(200).send('company assigned to topic successfully!')
    }
    
};

exports.deleteCompanyFromTopic=async function(req,res){
    //verify the existance of the topic
    const topic=await Topic.findById(req.params.topicId);
    if (!topic) {return res.status(404).send('The topic with the given ID was not found.');}

    //verify the existance of the company
    const company=await Company.findById(req.params.companyId);
    if(!company){return res.status(404).send('The company with the given ID was not found.');}

    //verify if company not assigned to the topic
    const companyAssigned=await Topic.findById(req.params.topicId).where({"companies.company":req.params.companyId});
    if(!companyAssigned){res.status(400).send('this company is not assigned to this topic');}
    else{
       await  Topic.update( 
            { "_id" : req.params.topicId} , 
            { "$pull" : { "companies" : { "company" :  req.params.companyId } } } , 
            { "multi" : true } );
            res.status(200).send('company deleted from this topic assigned companies list')
    }
};
exports.getCompaniesByTopic=async function(req,res){
    //verify the existanc eof the topic
    const topic=await Topic.findById(req.params.id);
    if (!topic) {return res.status(404).send('The topic with the given ID was not found.');}
    const companies = await  Topic.findById(req.params.id).populate('companies.company');
    res.send(companies.companies);
}

exports.getTopicsByCompany=async function(req,res){
    //verify the existance of the company
    const company=await Company.findById(req.params.id);
    if(!company){return res.status(404).send('The company with the given ID was not found.');}
    
    var result=[];
    const topics =await Topic.find({"companies.company":req.params.id}).populate('companies.company').populate('companies.tickets');
    console.log(topics);
    topics.forEach(topic=>{
        topic.companies.forEach(company=>{
          
            if(((company.company._id).toString())==req.params.id) {result.push({title:topic.title,description:topic.description,created:topic.created,tickets:company.tickets});};
        })
    });
    res.send(result);
    }

exports.detailsTopic=async function(req,res){
        const topic=await Topic.findById(req.params.id).populate('creator').populate('companies.company').populate('companies.tickets');
       
        if(!topic){res.status(400).send('could not find a topic with this ID');}
        else{res.status(200).send(topic);}
    }


exports.addTicket=async function(req,res){
    //verify the existance of the company
    const company=await Company.findById(req.params.companyId);
    if(!company){return res.status(404).send('The company with the given ID was not found.');}

    //verify the existanc of the topic
    const topic=await Topic.findById(req.params.topicId).populate('creator').populate('companies.company').populate('companies.tickets');
    if (!topic) {return res.status(404).send('The topic with the given ID was not found.');}
    
    //validate user input 
    const {error}=validateTicket(req.body);
    if (error) {console.log(error.details[0]); return res.status(400).send(error.details[0].message);}


    const ticket=new Ticket({
        title:req.body.title,
        date:moment.tz(moment(req.body.date),'Africa/Tunis').format('DD/MM/YYYY'),
        addedBy:req.body.addedBy
    })

    titleExists=false;
    topic.companies.forEach((element)=>{
        element.tickets.forEach((item)=>{if ((item.title)==req.body.title) {titleExists=true;}})
    })
    if (titleExists) {return res.status(400).send('a ticket with the exact title was added to this company in this Topic');}
    else{
        topic.companies.forEach((element)=>{
            console.log(element);
            if (((element.company._id).toString())==req.params.companyId)
            {   
                ticket.save();
                element.tickets.push(ticket)
                topic.save();
                return res.status(200).send("ticket added successfully!").json(ticket);};
        }); 
    }
}

exports.detailsTicket=async function(req,res){
    const ticket=await Ticket.findById(req.params.id);
    if(!ticket){res.status(400).send('could not find a ticket with this ID');}
    else{res.status(200).send(ticket);}
}

exports.deleteTicket=async function (req,res){
     //verify the existance of the company
     const company=await Company.findById(req.params.companyId);
     if(!company){return res.status(404).send('The company with the given ID was not found.');}
 
     //verify the existanc of the topic
     const topic=await Topic.findById(req.params.topicId);
     if (!topic) {return res.status(404).send('The topic with the given ID was not found.');}

     //verify the existance of the ticket
     console.log(req.params.topicId)
     const ticket=await Ticket.findById(req.params.ticketId);
     if(!ticket){return res.status(404).send('The ticket with the given ID was not found.');}

     //verify if company  assigned to the topic and has the mentionned ticket
     
    const companyAssigned=await Topic.findById(req.params.topicId).where({"companies.company":req.params.companyId}).where({'companies.tickets':req.params.ticketId});
    if(!companyAssigned){res.status(400).send('this company is not assigned to this topic');}
    else{
       await  Topic.update( 
            { "_id" : req.params.topicId} , 
            { "$pull" : { "companies.$[].tickets" :  req.params.ticketId } }  , 
            { "multi" : true } );
            await Ticket.findByIdAndDelete(req.params.ticketId);
            res.status(200).send('ticket deleted from this company-topic')
    }
}

exports.getStats=async function(req,res){
    var nbTopics=0;
    try {nbTopics=await Topic.countDocuments().exec();}
    catch (e){console.log(e);}
    res.status(200).send((nbTopics).toString());
  }



    






