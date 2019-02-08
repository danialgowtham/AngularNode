var express = require('express')

var router = express.Router()

// Getting the User Controller that we just created

var EmployeeSkillMappingController = require('../controllers/employee_skill_mapping.controller');

// Map each API to the Controller FUnctions

router.get('/get_units/:parent_id', EmployeeSkillMappingController.get_units)

router.post('/get_competency/:sub_sbu_id', EmployeeSkillMappingController.get_competency)

router.post('/get_skill/:com_str_map_id', EmployeeSkillMappingController.get_skill)

router.post('/save_competency_mapping', EmployeeSkillMappingController.save_competency_mapping)

router.get('/get_competency_mapping/:employee_id/:type', EmployeeSkillMappingController.get_competency_mapping)

router.get('/get_employee_detail/:employee_id', EmployeeSkillMappingController.get_employee_detail)

router.get('/get_employee_mapping_list/:manager_id', EmployeeSkillMappingController.get_employee_mapping_list)

router.get('/get_proficiency/', EmployeeSkillMappingController.get_proficiency)

router.post('/save_manger_proficiency/:employee_id', EmployeeSkillMappingController.save_manger_proficiency)

// router.get('/get_mapping_detail/:employee_id', EmployeeSkillMappingController.get_mapping_detail)
// Export the Router
module.exports = router;