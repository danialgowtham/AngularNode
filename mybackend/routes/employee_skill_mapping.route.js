var express = require('express')

var router = express.Router()

// Getting the User Controller that we just created

var EmployeeSkillMappingController = require('../controllers/employee_skill_mapping.controller');

// Map each API to the Controller FUnctions

router.get('/get_units/:parent_id', EmployeeSkillMappingController.get_units)

router.post('/get_competency/:sub_sbu_id', EmployeeSkillMappingController.get_competency)

router.post('/get_skill/:com_str_map_id', EmployeeSkillMappingController.get_skill)

router.post('/save_competency_mapping', EmployeeSkillMappingController.save_competency_mapping)

router.get('/get_competency_mapping/:employee_id/:type/:experience_type', EmployeeSkillMappingController.get_competency_mapping)

router.get('/get_employee_detail/:employee_id', EmployeeSkillMappingController.get_employee_detail)

router.get('/get_reportee_mapping_list/:manager_id', EmployeeSkillMappingController.get_reportee_mapping_list)

router.get('/get_proficiency/', EmployeeSkillMappingController.get_proficiency)

router.post('/save_manger_proficiency/:employee_id/:manager_id', EmployeeSkillMappingController.save_manger_proficiency)

router.get('/get_bands/', EmployeeSkillMappingController.get_bands)

router.get('/get_proficiency_list/:id', EmployeeSkillMappingController.get_proficiency_list)

router.get('/get_roles/:unit_id/:band_name', EmployeeSkillMappingController.get_roles)

router.get('/get_job_codes/:role_name/:band_name', EmployeeSkillMappingController.get_job_codes)

// router.post('/get_job_detail/:id/:employee_id', function (req, res) {
//     EmployeeSkillMappingController.get_job_detail
// });
router.get('/get_job_detail/:id/:employee_id/:job_post_id', EmployeeSkillMappingController.get_job_detail);

router.get('/get_job_detail/:id/:employee_id/', EmployeeSkillMappingController.get_job_detail);

router.get('/get_employee_list/', EmployeeSkillMappingController.get_employee_list)

router.get('/get_reportee_list/:employee_id', EmployeeSkillMappingController.get_reportee_list)

router.post('/get_employee_mapping_list/', EmployeeSkillMappingController.get_employee_mapping_list)

router.get('/get_skill_list/', EmployeeSkillMappingController.get_skill_list)

router.get('/get_role/:employee_id', EmployeeSkillMappingController.get_role)

router.get('/get_role_list/:filtered_value', EmployeeSkillMappingController.get_role_list)

router.get('/get_filtered_employee_list/:filtered_value', EmployeeSkillMappingController.get_filtered_employee_list)

router.post('/create_new_internal_job/:employee_id', EmployeeSkillMappingController.create_new_internal_job);

router.get('/get_internal_job/', EmployeeSkillMappingController.get_internal_job);

router.get('/get_internal_job_detail/:job_id', EmployeeSkillMappingController.get_internal_job_detail);

router.get('/update_internal_job_detail/:job_post_id/:status', EmployeeSkillMappingController.update_internal_job_detail);

router.get('/get_open_internal_jobs/', EmployeeSkillMappingController.get_open_internal_jobs);

router.get('/apply_job/:job_post_id/:employee_id', EmployeeSkillMappingController.apply_job);

router.get('/check_apply_job/:job_post_id/:employee_id/:fitment_score', EmployeeSkillMappingController.check_apply_job);

router.get('/get_applied_job_post/:employee_id', EmployeeSkillMappingController.get_applied_job_post);

// Export the Router
module.exports = router;