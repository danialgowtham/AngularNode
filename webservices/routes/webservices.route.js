var express = require('express')

var router = express.Router()

// Getting the User Controller that we just created

var WebServiceController = require('../controllers/webservices.controller');

// Map each API to the Controller FUnctions

router.get('/getEmployeeDetail/:employee_id', WebServiceController.getEmployeeDetail);
router.get('/getEmployeeByID/:employee_id', WebServiceController.getEmployeeByID);
router.get('/login/:username/:password', WebServiceController.login);
router.get('/getReporteeList/:manager_id', WebServiceController.getReporteeList);
router.get('/getBands/', WebServiceController.getBands);
router.get('/getEmployeeList/', WebServiceController.getEmployeeList);
router.post('/getSelectedEmployeeList/', WebServiceController.getSelectedEmployeeList);
router.get('/getEmployeeBandAndUnitDetail/:employee_id', WebServiceController.getEmployeeBandAndUnitDetail);
router.get('/getFliteredEmployeeList/:filtered_value', WebServiceController.getFliteredEmployeeList);

// Export the Router
module.exports = router;