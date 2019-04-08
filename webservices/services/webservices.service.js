var createConnection = require('../db');
var md5 = require('md5');

exports.getEmployeeDetail = async function (employee_id, result) {
    var response;
    var start_date;
    var employee_details = "SELECT emp.joined_date as joined_date, CONCAT(emp.employee_number,' ',emp.first_name, ' ',emp.last_name) AS employee_name,CONCAT(rm.employee_number,' ',rm.first_name, ' ',rm.last_name) AS manager_name,band.name as band, des.designation as designation,cs.name as unit,css.name as practice,cs.parent_id as sbu_id,csss.name as sub_practice,cv.configuration_value as category FROM employees AS emp  inner join employees as rm  on emp.manager=rm.id inner join bands as band on band.id=emp.band_id    inner join designations as des on des.id=emp.designation_id    inner join company_structures as cs on cs.id=emp.structure_name     inner join company_structures as css on css.id=emp.structure_name_subgroup    left join company_structures as csss on csss.id=emp.structure_name_subpractice    inner join configuration_values as cv on cv.configuration_key=emp.billable and cv.parent_id='52' where emp.id=?    LIMIT 1"
    var employee_experience = "select MIN(start_date) as start_date from dtl_employee_workexperience where employee_id=?"
    var employee_experience_all = " SELECT dew.end_date as end_date FROM employees AS emp LEFT JOIN dtl_employee_workexperience dew ON emp.id=dew.employee_id WHERE dew.employee_id=? AND dew.start_date=(SELECT MAX(start_date) FROM  dtl_employee_workexperience WHERE employee_id=?)"
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
                            console.log("start_date");
                            console.log( res1);
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
                               
                                console.log(response["joined_date"]);
                            response["htl_experience"] = getYearMonth(response["joined_date"]);
                            response["overall_experience"] = getYearMonth(start_date);
                            response["overall_experience_month"] = getOverallMonth(start_date);
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
    console.log(manager_id);
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

