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

router.post('/update_internal_job_detail/:job_post_id/:status', EmployeeSkillMappingController.update_internal_job_detail);

router.get('/get_open_internal_jobs/', EmployeeSkillMappingController.get_open_internal_jobs);

router.get('/apply_job/:job_post_id/:employee_id/:manager_agreed/', EmployeeSkillMappingController.apply_job);

router.get('/check_apply_job/:job_post_id/:employee_id/:fitment_score', EmployeeSkillMappingController.check_apply_job);

router.get('/get_applied_job_post/:employee_id', EmployeeSkillMappingController.get_applied_job_post);

router.get('/get_rrf_creation_data/', EmployeeSkillMappingController.get_rrf_creation_data);

router.get('/get_project/:customer_id', EmployeeSkillMappingController.get_project);

router.get('/get_sub_work_locations/:location_name', EmployeeSkillMappingController.get_sub_work_locations);

router.post('/create_new_rrf/:employee_id', EmployeeSkillMappingController.create_new_rrf);

router.get('/get_rrf_list/:type/:employee_id', EmployeeSkillMappingController.get_rrf_list);

router.get('/get_rrf_detail/:rrf_id', EmployeeSkillMappingController.get_rrf_detail);

router.post('/update_rrf_status/:rrf_id', EmployeeSkillMappingController.update_rrf_status);

router.get('/get_rrf_edit_data/:rrf_id', EmployeeSkillMappingController.get_rrf_edit_data);

router.post('/upload_candidate/:rrf_id', EmployeeSkillMappingController.upload_candidate);

router.post('/schedule_interview/:rrf_id/:candidate_id', EmployeeSkillMappingController.schedule_interview);

router.get('/get_iof_pending_list/:employee_id', EmployeeSkillMappingController.get_iof_pending_list);

router.post('/save_iof_detail/:rrf_id/:candidate_id/:schedule_id/:status', EmployeeSkillMappingController.save_iof_detail);

router.get('/get_hr_approve_pending_list/', EmployeeSkillMappingController.get_hr_approve_pending_list);

router.post('/save_hr_iof_detail/:rrf_id/:candidate_id/:status', EmployeeSkillMappingController.save_hr_iof_detail);

router.get('/get_iof_detail/:schedule_id', EmployeeSkillMappingController.get_iof_detail);

router.get('/get_iof_detail/:schedule_id', EmployeeSkillMappingController.get_iof_detail);

router.post('/generate_offer_letter/:candidate_id/', EmployeeSkillMappingController.generate_offer_letter);

router.get('/candidate_duplicate_check/:rrf_id/:email_id', EmployeeSkillMappingController.candidate_duplicate_check);

router.post('/get_rrf_report_list/', EmployeeSkillMappingController.get_rrf_report_list);

router.post('/upload_candidate_document/', EmployeeSkillMappingController.upload_candidate_document);

router.get('/get_rrf_candidate_approve_list/:view_type', EmployeeSkillMappingController.get_rrf_candidate_approve_list);

router.get('/save_rrf_candidate_approve/:candidate_id/:status/:approver_id', EmployeeSkillMappingController.save_rrf_candidate_approve);

router.post('/generate_indicative_offer_letter/', EmployeeSkillMappingController.generate_indicative_offer_letter);

router.post('/check_candidate_document/', EmployeeSkillMappingController.check_candidate_document);

router.post('/get_organization_skill_list/', EmployeeSkillMappingController.get_organization_skill_list);
// Export the Router
module.exports = router;