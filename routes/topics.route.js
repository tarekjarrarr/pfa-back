const express = require('express');
const router = express.Router();
const topicsController=require('../controllers/topicsContoller');

router.get('/getAll',topicsController.getAllTopics);
router.get('/details/:id',topicsController.detailsTopic);
router.patch('/updateTopic/:id',topicsController.updateTopic);
router.delete('/deleteTopic/:id',topicsController.deleteTopic);
 router.post('/create',topicsController.createTopic);
router.post('/affect/:companyId/:topicId',topicsController.affectCompany);
router.delete('/deleteFromTopic/:companyId/:topicId',topicsController.deleteCompanyFromTopic);
router.get('/getCompaniesByTopic/:id',topicsController.getCompaniesByTopic);
router.get('/getTopicsByCompany/:id',topicsController.getTopicsByCompany);
router.post('/addTicket/:topicId/:companyId',topicsController.addTicket);
router.get('/CompanyTopicTickets/:topicId/:companyId',topicsController.getTicketsOfCompanyTopic);
router.delete('/deleteTicket/:topicId/:companyId/:ticketId',topicsController.deleteTicket);
router.get('/detailsTicket/:id',topicsController.detailsTicket);
router.get('/stats',topicsController.getStats);

module.exports=router;
