const express = require('express');
const companiesController= require('../controllers/companiesController');
const { Company } = require('../models/company.model');
const router = express.Router();

router.get('/getAll',companiesController.getAllCompanies);
router.get('/details/:id',companiesController.detailsCompany);
router.post('/search',companiesController.searchCompanies);
router.post('/recommendation',companiesController.recommendCompanies);
router.get('/stats',companiesController.getStats);
module.exports=router;
