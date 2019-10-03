import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACK_END_URL } from '../shared/app.globals';
import { Observable, Subject } from 'rxjs';
@Injectable()
export class EmployeeSkillMappingService {
    constructor(private http: HttpClient) { }

    getUnit(parent_id: String) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_units/` + parent_id);
    }
    getCompetency(sub_sbu_id: String, selected_competency) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/get_competency/` + sub_sbu_id, selected_competency);
    }
    getSkill(com_str_map_id: String, already_selected_skill) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/get_skill/` + com_str_map_id, already_selected_skill);
    }
    saveCompetencyMapping(save_data) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/save_competency_mapping/`, save_data);
    }
    getCompetencyMapping(employee_id, type, experience_type) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_competency_mapping/` + employee_id + '/' + type + '/' + experience_type);
    }
    getEmployeeDetail(employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_employee_detail/` + employee_id);
    }
    getMappingDetail(employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_mapping_detail/` + employee_id);
    }
    getEmployeeSkillMappingList(search_value) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/get_employee_mapping_list/`, search_value);
    }
    getProficiency() {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_proficiency/`);
    }
    saveManagerProficiency(mapping_data, employee_id, manager_id, current_role) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/save_manger_proficiency/` + employee_id + "/" + manager_id, { mapping_data, current_role });
    }
    getBands() {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_bands/`);
    }
    getRoles(unit_id, band_name) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_roles/` + unit_id + "/" + band_name);
    }
    getJobCodes(role_name, band_name) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_job_codes/` + role_name + "/" + band_name);
    }
    getJobDetail(job_master_id, employee_id, type) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_job_detail/` + job_master_id + "/" + employee_id + "/" + type);
    }
    getproficiencyDecription(mapping_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_proficiency_list/` + mapping_id);
    }
    getEmployeeList() {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_employee_list/`);
    }
    getReporteeList(manager_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_reportee_list/` + manager_id);
    }
    getReporteeSkillMappingList(employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_reportee_mapping_list/` + employee_id);
    }
    getSkillList() {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_skill_list/`)
    }
    getRole(employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_role/` + employee_id)
    }
    getRoleList(filtered_value) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_role_list/` + filtered_value)
    }
    getFilteredEmployeeList(filtered_value) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_filtered_employee_list/` + filtered_value);
    }
    creatNewInternalJob(mapping_data, employee_id) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/create_new_internal_job/` + employee_id, mapping_data);
    }
    getJobPost() {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_internal_job/`);
    }
    getJobPosts() {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_open_internal_jobs/`);
    }
    getJobPostDetail(job_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_internal_job_detail/` + job_id);
    }
    updateJobPostDetail(job_post_id, status, employee_status) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/update_internal_job_detail/` + job_post_id + "/" + status, employee_status);
    }
    applyJob(job_post_id, employee_id, manager_agreed) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/apply_job/` + job_post_id + "/" + employee_id + "/" + manager_agreed);
    }
    applyJobCheck(job_post_id, employee_id, employee_fitment_score) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/check_apply_job/` + job_post_id + "/" + employee_id + "/" + employee_fitment_score);
    }
    getAppliedJobPost(employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_applied_job_post/` + employee_id);
    }
    getRRFCreationData() {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_rrf_creation_data/`);
    }
    getProject(customer_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_project/` + customer_id);
    }
    getSubWorkLocation(work_location_name) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_sub_work_locations/` + work_location_name);
    }
    creatNewRRF(mapping_data, employee_id) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/create_new_rrf/` + employee_id, mapping_data);
    }
    getRRFList(type, employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_rrf_list/` + type + '/' + employee_id);
    }
    getRRFDetail(rrf_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_rrf_detail/` + rrf_id);
    }
    updateRRFStatus(rrf_data, rrf_id) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/update_rrf_status/` + rrf_id, rrf_data);
    }
    getRRFEditDetail(rrf_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_rrf_edit_data/` + rrf_id);
    }
    uploadCandidate(rrf_id, save_data) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/upload_candidate/` + rrf_id, save_data);
    }
    scheduleInterview(save_data, rrf_id, candidate_id) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/schedule_interview/` + rrf_id + '/' + candidate_id, save_data);
    }
    getIOFPendingList(employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_iof_pending_list/` + employee_id);
    }
    saveIOFDetail(save_data, rrf_id, candidate_id, schedule_id, status) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/save_iof_detail/` + rrf_id + '/' + candidate_id + '/' + schedule_id + '/' + status, save_data);
    }
    getHrApprovePendingList() {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_hr_approve_pending_list/`);
    }
    saveHRIOFDetail(save_data, rrf_id, candidate_id, status) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/save_hr_iof_detail/` + rrf_id + '/' + candidate_id + '/' + status, save_data);
    }
    getIOFDetail(schedule_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_iof_detail/` + schedule_id);
    }
    candidateDuplicateCheck(rrf_id, email_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/candidate_duplicate_check/` + rrf_id + '/' + email_id);
    }
    getRRFReportList(filter_data) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/get_rrf_report_list/`, filter_data);
    }
    uploadCandidateDocuments(save_data) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/upload_candidate_document/`, save_data);
    }
    checkCandidateDocuments(candidate_id) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/check_candidate_document/`, { candidate_id });
    }
    getRRFCandidateApproveList(view_type) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_rrf_candidate_approve_list/` + view_type);
    }
    saveRRFCandidateApprove(candidate_id, status, approver_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/save_rrf_candidate_approve/` + candidate_id + '/' + status + '/' + approver_id);
    }
    generateOfferLetter(candidate_id, grand_ctc) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/generate_offer_letter/` + candidate_id + '/' + grand_ctc, '');
    }

}