var createConnection = require('../db');
var md5 = require('md5');
var mysql = require('mysql');
var _this = this;

exports.getEmployeeDetail = async function (employee_id, result) {
    var response;
    var start_date;
    var employee_details = "SELECT emp.joined_date as joined_date, CONCAT(emp.employee_number,' ',emp.first_name, ' ',emp.last_name) AS employee_name,CONCAT(rm.employee_number,' ',rm.first_name, ' ',rm.last_name) AS manager_name,band.name as band, des.designation as designation,cs.name as unit,css.name as practice,cs.parent_id as sbu_id,csss.name as sub_practice,cv.configuration_value as category FROM employees AS emp  inner join employees as rm  on emp.manager=rm.id inner join bands as band on band.id=emp.band_id    inner join designations as des on des.id=emp.designation_id    inner join company_structures as cs on cs.id=emp.structure_name     inner join company_structures as css on css.id=emp.structure_name_subgroup    left join company_structures as csss on csss.id=emp.structure_name_subpractice    inner join configuration_values as cv on cv.configuration_key=emp.billable and cv.parent_id='52' where emp.id=?    LIMIT 1"
    var employee_experience = "select MIN(start_date) as start_date from dtl_employee_workexperience where employee_id=?"
    var employee_experience_all = " SELECT dew.end_date as end_date FROM employees AS emp LEFT JOIN dtl_employee_workexperience dew ON emp.id=dew.employee_id WHERE dew.employee_id=? AND dew.start_date=(SELECT MAX(start_date) FROM  dtl_employee_workexperience WHERE employee_id=?)"
    var project_detail = "SELECT PTA.project_id,CONCAT(Project.project_code,'-',Project.project_name) AS project_name, CONCAT(emp.employee_number,'-',emp.first_name,' ',emp.last_name) AS project_manager, PTA.start_date , PTA.end_date FROM project_team_allocations AS PTA INNER JOIN projects AS Project ON (Project.id = PTA.project_id) LEFT JOIN employees AS emp ON(project.project_manager = emp.id) WHERE PTA.employee_id = ? AND CURDATE() BETWEEN PTA.start_date AND PTA.end_date AND PTA.deleted = 0 AND Project.project_status IN ('e') GROUP BY PTA.project_id"
    try {
        createConnection(function (error, connection) {
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(employee_details, employee_id, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length > 0) {
                            if (res[0]["sub_practice"] == null)
                                res[0]["sub_practice"] = res[0]["practice"]
                            if (res[0]["sbu_id"] == 1) {
                                res[0]["practice_lable"] = "Business Unit";
                                res[0]["sub_practice_lable"] = "Practice";
                            } else if (res[0]["sbu_id"] == 12) {
                                res[0]["practice_lable"] = "Enabling Function";
                                res[0]["sub_practice_lable"] = "Sub Function";
                            } else if (res[0]["sbu_id"] == 52) {
                                res[0]["practice_lable"] = "Sales";
                                res[0]["sub_practice_lable"] = "Geography/Account";
                            }
                        }
                        response = res[0];
                    } catch (e) {
                        console.log(e)
                    }
                }

            }),
                connection.query(employee_experience, employee_id, function (err, res1) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    else {
                        try {
                            start_date = res1[0]['start_date']
                        } catch (e) {
                            console.log(e)
                        }
                        // result(null, res);
                    }

                }),
                connection.query(employee_experience_all, [employee_id, employee_id], function (err, res2) {

                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    else {
                        try {
                            if (res2.length == 0)
                                start_date = response["joined_date"];
                            response["htl_experience"] = getYearMonth(response["joined_date"]);
                            response["overall_experience"] = getYearMonth(start_date);
                            response["overall_experience_month"] = getOverallMonth(start_date);
                        } catch (e) {
                            console.log(e)
                        }
                    }

                }),
                connection.query(project_detail, [employee_id], function (err, res3) {

                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    else {
                        try {
                            response["project_detail"] = res3;
                            result(null, response);
                        } catch (e) {
                            console.log(e)
                        }
                    }

                });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}

exports.login = async function (username, password, result) {
    md5_password = md5(password);
    var valid_user_query = 'SELECT employee_id FROM users inner join employees as emp WHERE emp.employment_status not in ("r","t","b","q","o","y") and username=? and password=? limit 1';
    try {
        createConnection(function (error, connection) {
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(valid_user_query, [username, md5_password], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            var employee_details = 'SELECT employees.*,bands.name as band_name, designations.designation as designation_name FROM employees inner join bands on bands.id=employees.band_id inner join designations on designations.id=employees.designation_id  WHERE employees.id=? limit 1';
                            // var employee_details = "SELECT emp.id as id,emp.employee_number,emp.first_name, emp.last_name,rm.id AS manager_id,band.name as band, des.designation as designation,cs.name as unit,css.name as practice,cs.parent_id as sbu_id,csss.name as sub_practice,cv.configuration_value as category FROM employees AS emp  inner join employees as rm  on emp.manager=rm.id inner join bands as band on band.id=emp.band_id    inner join designations as des on des.id=emp.designation_id    inner join company_structures as cs on cs.id=emp.structure_name     inner join company_structures as css on css.id=emp.structure_name_subgroup    left join company_structures as csss on csss.id=emp.structure_name_subpractice    inner join configuration_values as cv on cv.configuration_key=emp.billable and cv.parent_id='52' where emp.id=?    LIMIT 1"
                            connection.query(employee_details, res[0]["employee_id"], function (err, res1) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                                else {
                                    var is_manager = 'SELECT id from employees where employment_status not in ("r","t","b","q","o") and manager=?';
                                    connection.query(is_manager, res[0]["employee_id"], function (err, res2) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                        else {
                                            if (res2.length != 0)
                                                res1[0]["is_manager"] = true;
                                            else
                                                res1[0]["is_manager"] = false;

                                            result(null, res1[0]);
                                        }
                                    });
                                }
                            });
                        } else {
                            result(null, {});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }

}

exports.getEmployeeById = async function (employee_id, result) {
    console.log(employee_id);
    var employee_check = "SELECT * FROM employees WHERE id=? limit 1";
    try {
        createConnection(function (error, connection) {
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(employee_check, [employee_id], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            result(null, res);
                        } else {
                            result(null, {});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}


exports.getReporteeList = async function (manager_id, result) {
    var employee_list = 'SELECT employees.id,concat(employee_number," - ",first_name," ",last_name)as employee_name, bands.name as band_name,company_structures.name as unit FROM employees INNER JOIN bands ON bands.id=band_id inner join company_structures on company_structures.id=employees.structure_name   WHERE employment_status NOT IN ("r","t","b","q","o") AND manager=?';
    try {
        createConnection(function (error, connection) {
            console.log("inside Reportee");
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(employee_list, [manager_id], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            var employee_detail = {};
                            for (var emp_data of res) {
                                employee_detail[emp_data.id] = emp_data;
                            }
                            result(null, employee_detail);
                        } else {
                            result(null, {});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}

exports.getBands = async function (result) {
    var band_query = 'SELECT child.id,child.name FROM bands AS parent INNER JOIN bands AS child ON child.parent_id=parent.id WHERE parent.parent_id IS NULL AND child.parent_id!=31 order by child.sort_order desc ';
    try {
        createConnection(function (error, connection) {
            console.log("inside Band");
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(band_query, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            band_list = res.map((item) => item.name)
                            result(null, band_list);
                        } else {
                            result(null, {});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}


exports.getEmployeeList = async function (result) {
    var employee_list_query = 'SELECT employees.id,concat(employee_number," - ",first_name," ",last_name)as employee_name, bands.name as band_name,company_structures.name as unit FROM employees INNER JOIN bands ON bands.id=band_id inner join company_structures on company_structures.id=employees.structure_name     WHERE employment_status NOT IN ("r","t","b","q","o")';
    try {
        createConnection(function (error, connection) {
            console.log("inside Employee List");
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(employee_list_query, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            var employee_detail = {};
                            for (var emp_data of res) {
                                employee_detail[emp_data.id] = emp_data;
                            }
                            result(null, employee_detail);
                        } else {
                            result(null, {});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}

exports.getSelectedEmployeeList = async function (selected_employee_ids, result) {
    var employee_list_query = 'SELECT employees.id,concat(employee_number," - ",first_name," ",last_name)as employee_name, bands.name as band_name,company_structures.name as unit FROM employees INNER JOIN bands ON bands.id=band_id inner join company_structures on company_structures.id=employees.structure_name where employees.id in (?)';
    var employee_ids = [];
    employee_ids.push(selected_employee_ids);
    employee_list_query = mysql.format(employee_list_query, employee_ids)
    try {
        createConnection(function (error, connection) {
            console.log("inside Employee List");
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(employee_list_query, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            var employee_detail = {};
                            for (var emp_data of res) {
                                employee_detail[emp_data.id] = emp_data;
                            }
                            console.log(res);
                            result(null, employee_detail);
                        } else {
                            result(null, {});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}

exports.getEmployeeBandAndUnitDetail = async function (employee_id, result) {
    console.log(employee_id);
    var employee_detail = "SELECT employees.structure_name,bands.name as band_name FROM employees INNER JOIN bands ON bands.id=band_id WHERE employees.id=? limit 1";
    var response_object = {};
    try {
        createConnection(function (error, connection) {
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(employee_detail, [employee_id], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            response_object["band_name"] = res[0]["band_name"];
                            if (res[0]["structure_name"] == 2) {
                                response_object["unit_id"] = "1";
                            } else if (res[0]["structure_name"] == 5) {
                                response_object["unit_id"] = "2";
                            } else {
                                response_object["unit_id"] = "3";
                            }
                            result(null, response_object);
                        } else {
                            result(null, {});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}

exports.getFliteredEmployeeList = async function (filtered_value, result) {
    var filtered_value = "%" + filtered_value + "%";
    var employee_list_query = 'SELECT employees.id,concat(employee_number," - ",first_name," ",last_name)as employee_name, bands.name as band_name,company_structures.name as unit FROM employees INNER JOIN bands ON bands.id=band_id inner join company_structures on company_structures.id=employees.structure_name     WHERE (employee_number like ? or first_name like ? or last_name like ? ) and employment_status NOT IN ("r","t","b","q","o") limit 15';
    try {
        createConnection(function (error, connection) {
            console.log("inside Employee List");
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(employee_list_query, [filtered_value, filtered_value, filtered_value], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            var employee_detail = {};
                            for (var emp_data of res) {
                                employee_detail[emp_data.id] = emp_data;
                            }
                            result(null, employee_detail);
                        } else {
                            result(null, {});
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}
exports.geRRFCreationDetail = async function (result) {
    var response = {};
    var employee_list_query = 'SELECT employees.id,concat(employee_number," - ",first_name," ",last_name)as itemName FROM employees INNER JOIN bands ON bands.id=band_id inner join company_structures on company_structures.id=employees.structure_name     WHERE employment_status NOT IN ("r","t","b","q","o")';
    var customers_query = 'SELECT id,concat(customer_code," - ",customer_name) as customer_name FROM customers WHERE deleted=0 and status="a"';
    var work_location_query = 'SELECT name FROM work_locations WHERE parent_id=0';
    var base_location_query = 'SELECT cl.id as id,ci.city,CONCAT(cl.address_line1,", ",r.region,", ",c.country,", ",ci.city) as name FROM company_locations AS cl INNER JOIN countries AS c ON c.id=cl.country_id INNER JOIN regions AS r ON r.id=cl.region_id INNER JOIN cities AS ci ON ci.id=cl.city_id WHERE deleted=0';
    var band_query = 'SELECT child.id,child.name FROM bands AS parent INNER JOIN bands AS child ON child.parent_id=parent.id WHERE parent.parent_id IS NULL ORDER BY child.sort_order DESC';
    var manager_list_query = 'SELECT employees.id,concat(employee_number," - ",first_name," ",last_name)as employee_name, bands.name as band_name,company_structures.name as unit FROM employees INNER JOIN bands ON bands.id=band_id inner join company_structures on company_structures.id=employees.structure_name     WHERE employment_status NOT IN ("r","t","b","q","o")';
    try {
        createConnection(function (error, connection) {
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(manager_list_query, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                } else {
                    if (res.length != 0) {
                        var employee_detail = {};
                        for (var emp_data of res) {
                            employee_detail[emp_data.id] = emp_data;
                        }
                        response['managers'] = employee_detail;
                    } else {
                        response['managers'] = {};

                    }
                }
            }),
                connection.query(employee_list_query, function (err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    } else {
                        response['employees'] = res;
                    }
                }),
                connection.query(customers_query, function (err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    } else {
                        response['customer'] = res;
                    }
                }),
                connection.query(work_location_query, function (err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    } else {
                        response['work_location'] = res;
                    }
                }),
                connection.query(band_query, function (err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    } else {
                        response['band'] = res;
                    }
                }),
                connection.query(base_location_query, function (err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    } else {
                        response['base_location'] = res;
                        result(null, response);
                    }
                })
            connection.release();

        });
    }
    catch (e) {
        console.log(e);
    }
}


exports.getProject = async function (customer_id, result) {
    var project_query = 'SELECT id,CONCAT(project_code," - ",project_name) as project_name FROM projects WHERE project_status="e" AND customer_id=? ';
    try {
        createConnection(function (error, connection) {
            console.log("inside Project");
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(project_query, customer_id, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            result(null, res);
                        } else {
                            result(null, []);
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}

exports.getSubWorkLocations = async function (location_name, result) {
    var sub_location_query = 'SELECT wls.name FROM work_locations AS wl INNER JOIN work_locations AS wls ON (wls.parent_id=wl.id) WHERE wl.name=?';
    try {
        createConnection(function (error, connection) {
            console.log("inside SubLocation");
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(sub_location_query, location_name, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else {
                    try {
                        if (res.length != 0) {
                            result(null, res);
                        } else {
                            result(null, []);
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}


exports.getRrfDetail = async function (rrf_detail, result) {
    var response = {};
    var base_location_query = 'SELECT cl.id as id,CONCAT(cl.address_line1,", ",r.region,", ",c.country,", ",ci.city) as name FROM company_locations AS cl INNER JOIN countries AS c ON c.id=cl.country_id INNER JOIN regions AS r ON r.id=cl.region_id INNER JOIN cities AS ci ON ci.id=cl.city_id WHERE cl.id=?';
    var project_customer_query = 'SELECT CONCAT(project_code," - ",project_name)AS project_name,CONCAT(customer_code," - ",customer_name) AS customer_name FROM customers INNER JOIN projects ON projects.customer_id=customers.id WHERE projects.id=? AND customers.id=?';
    try {
        createConnection(function (error, connection) {
            console.log("inside getRrfDetail");
            if (error) {
                console.log("error: ", error);
                result(error, null);
            }
            connection.query(base_location_query, [rrf_detail['base_location']], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                } else {
                    response['base_location'] = res[0];
                }
            }),
                connection.query(project_customer_query, [rrf_detail['project'], rrf_detail['customer_name']], function (err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    else {
                        try {
                            response['customer_project'] = res[0];
                            result(null, response);
                        } catch (e) {
                            console.log(e)
                        }
                    }
                });
            connection.release();
        });
    }
    catch (e) {
        console.log(e);
    }
}

function getYearMonth(start_date) {
    var end_date = new Date();
    var diff_in_days = Math.floor(Math.abs((start_date.getTime() - end_date.getTime())) / (1000 * 60 * 60 * 24));
    var no_years = Math.floor(diff_in_days / 365);
    var no_remaining_month = Math.floor((diff_in_days - (no_years * 365)) / 30.5);
    if (no_years > 1)
        experience_text = no_years + " Years ";
    else
        experience_text = no_years + " Year ";
    if (no_remaining_month > 1)
        experience_text += no_remaining_month + " Months ";
    else
        experience_text += no_remaining_month + " Month ";
    return experience_text;
}

function getOverallMonth(start_date) {
    var end_date = new Date();
    var diff_in_days = Math.floor(Math.abs((start_date.getTime() - end_date.getTime())) / (1000 * 60 * 60 * 24));
    var no_years = Math.floor(diff_in_days / 365);
    var no_remaining_month = Math.floor((diff_in_days - (no_years * 365)) / 30.5);
    return no_remaining_month + (no_years * 12);
}

