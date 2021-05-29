const {User,validate}=require('../models/user.model');
const Joi=require('joi');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const _ = require('lodash');
const nodemailer=require('nodemailer');
const mailingService=require('../services/mailingService');
require('dotenv').config();

exports.registerUser=async function(req,res){
  
    //validate the input
    const { error } = validate(req.body);
    if (error) {return res.status(400).send(error.details[0].message);}
    
   //checking if user exists
   const emailExists=await User.findOne({email:req.body.email});
   //if user email exists
   if(emailExists) {res.status(400).send('Email already exists !')} 
   //if user email doesn't exist 
   

   //adding new user
   const user=new User (_.pick(req.body, ['fullname', 'email' ,'position', 'phone', 'role','dateOfBirth']));
   //hash password
   const password=generatePassword();
   user.password=await bcrypt.hash(password,10);
   if (user.role!="admin")  user.role="user";
   const mailOptions= {
    from: '"W-selling" <w-selling@wevioo.com>',
    to: req.body.email,
    subject: "Invitation",
    text: `You now have access to the platform.\nYour credentials are:\n EMAIL: ${req.body.email}\n PASSWORD:${password} \n Please login and change your password ! `
    };
    await mailingService.sendMail(mailOptions);
    await user.save();
    res.send("user created successfully"); 
};

exports.authenticate=async function(req,res){
    const {error}=validateAuth(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message);
    }    
    const user = await User.findOne({email:req.body.email});
    if(!user){
        res.status(400).send('invalid user or password');
        return;
    }

    const validPassword = await bcrypt.compare(req.body.password,user.password,);
    if(!validPassword){
        res.status(400).send('invalid user or password');
        return;
    }
    const token = jwt.sign({ _id: user._id,fullname:user.fullname,email:user.email, role:user.role},process.env.myprivatekey);
    res.header("x-access-token", token).send(token); 
};

exports.userProfile = async function(req, res){
    console.log(req.user);
    const user = await User.findOne({email:req.user.email}).select("-password -__v");
    res.send(user);
};

exports.editUser=async function(req,res){
    const user =await User.findById(req.params.id);
    if (!user){res.status(400).send('invalid user id');}
    var updateObject={};
    if (req.body.fullname&&req.body.fullname.length>0) updateObject.fullname=req.body.fullname;
    if (req.body.email&&req.body.email.length>0) updateObject.email=req.body.email;
    if (req.body.position&&req.body.position.length>0) updateObject.position=req.body.position;
    if (req.body.phone&&req.body.phone.length>0) updateObject.phone=req.body.phone;
    if (req.body.phone&&req.body.phone.length>0) updateObject.phone=req.body.phone;
    if (req.body.dateOfBirth&&req.body.dateOfBirth.length>0) updateObject.dateOfBirth=req.body.dateOfBirth;
    if (req.body.role&&req.body.role.length>0) updateObject.role=req.body.role;

    try{ update =await User.findByIdAndUpdate(req.params.id, {$set: updateObject});}
    catch(e){res.status(400).send(e.codeName)}
    if (!update) {res.status(400).send('could not save changes to user')}
    res.status(200).send(user);
}

exports.editPassword=async function(req,res){
    const user =await User.findById(req.params.id);
    if (!user){res.status(400).send('invalid user id');}
    if (req.body.password&&req.body.password.length>0) newPassword=req.body.password;
    user.password=await bcrypt.hash(newPassword,10);
    const edited= await user.save();
    if (!edited) res.status(400).send('could not update password');
    res.status(200).send('password changed!')
}



exports.detailsUser=async function(req,res){
    const user = await User.findById(req.params.id);
    res.send(user);
}

exports.deleteUser=async function(req,res){
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(user);    
}

exports.getStats=async function(req,res){
    var nbUsers=0;
    try {nbUsers=await User.countDocuments().exec();console.log(nbUsers)}
    catch (e){console.log(e);}
    res.status(200).send((nbUsers).toString());}

exports.getUsers=async function(req,res){
    const users=await User.find();
    res.status(200).send(users);
}

function generatePassword() {
    return Math.random().toString(36).slice(-8);
}

function validateAuth(req){
    const schema = {
        email:Joi.string().required().min(3).max(255).email().required(),
        password:Joi.string().required().min(3).max(255).required()
    }
    return Joi.validate(req,schema);
};