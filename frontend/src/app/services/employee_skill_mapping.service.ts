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
    getCompetencyMapping(employee_id, type) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_competency_mapping/` + employee_id + '/' + type);
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
    saveManagerProficiency(mapping_data, employee_id, manager_id) {
        return this.http.post(BACK_END_URL + `employee_skill_mapping/save_manger_proficiency/` + employee_id + "/" + manager_id, mapping_data);
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
    getJobDetail(job_master_id, employee_id) {
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_job_detail/` + job_master_id + "/" + employee_id);
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
        return this.http.get(BACK_END_URL + `employee_skill_mapping/get_skill_list/`);
    }

}