import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACK_END_URL } from '../shared/app.globals';

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
    updateJobPostDetail(job_post_id, status) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/update_internal_job_detail/` + job_post_id + "/" + status);
    }
    applyJob(job_post_id, employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/apply_job/` + job_post_id + "/" + employee_id);
    }
    applyJobCheck(job_post_id, employee_id, employee_fitment_score) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/check_apply_job/` + job_post_id + "/" + employee_id + "/" + employee_fitment_score);
    }
    getAppliedJobPost(employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_applied_job_post/` + employee_id);
    }

}