const express = require('express');
const router = express.Router();
const usersController=require('../controllers/usersController');
const auth = require('../middlewares/auth');

router.post('/auth',usersController.authenticate);
router.post('/register',usersController.registerUser);
router.get('/me',auth, usersController.userProfile);
router.get('/stats',usersController.getStats);
router.get('/all',usersController.getUsers);

router.get('/user/:id', usersController.detailsUser);
router.patch('/user/:id', usersController.editUser);
router.delete('/user/:id', usersController.deleteUser);
router.post('/user/password/:id',usersController.editPassword)

module.exports=router;
