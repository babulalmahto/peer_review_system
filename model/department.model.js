const mysql = require('../mysql_connection/mysql.connection');

class DepartmentModel {

    /**
    * checkDeptExist - function to check if department and id present
    * @param {*} departmentName 
    * @param {*} id 
    * @returns 
    */
    checkDeptExist(departmentname, id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT department_id FROM departments
                            WHERE department_name = '${departmentname}' AND admin_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }


    /**
     * getDepartmentIdByName - funtion to get department_id by department_name
     * @param {*} name 
     */
    getDepartmentIdByName(departmentname) {
        return new Promise((resolve, reject) => {
            const query = `SELECT department_id FROM departments
                            WHERE department_name = '${departmentname}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }



    /**
     * getDepartmentNameById - function to get department_name by department_id
     * @param {*} id 
     */
    getDepartmentNameById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT department_name from departments 
                WHERE department_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
    

    /**
     * createDepartmentDb - function to create department in db
     * @param {*} departmentname 
     * @param {*} id 
     * @returns 
     */
    createDepartmentDb(departmentname, id) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO departments (department_name, admin_id)
                            VALUES ('${departmentname}', '${id}');`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }


    /**
     * getDepartmentList - function to get list of department List from DB
     * @returns 
     */
    getDepartmentList(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT department_name FROM departments WHERE admin_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }


    /**
     * getDepartmentName - function to get department name
     * @param {*} departmentId 
     * @param {*} id 
     */
    getDepartmentName(departmentId, id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT department_name from departments 
                    WHERE department_id = '${departmentId}' AND admin_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    getDepartmentName1(departmentIds, id) {
        return new Promise((resolve, reject) => {
            let query = ``;
            for (let i = 0; i < departmentIds.length; i++) {
                if (!query) {
                    query += `SELECT department_id, department_name FROM departments WHERE department_id = ${departmentIds[i].departmentId} `;
                } else {
                    query += `OR department_id = ${departmentIds[i].departmentId} `;
                }
            }
            query += `AND admin_id = '${id}'`;
            
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * updateDepartmentDb - function to update department
     * @param {*} id 
     * @param {*} departmentname1 
     * @param {*} departmentname2 
     * @returns 
     */
    updateDepartmentDb(id, departmentname1, departmentname2) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE departments SET department_name = '${departmentname2}'
                        WHERE department_name = '${departmentname1}' AND admin_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }


    /**
     * deleteDepartmentDb - function to delete department
     * @param {*} id 
     * @param {*} departmentname 
     */
    deleteDepartmentDb(id, departmentname) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM departments WHERE 
                        department_name = '${departmentname}' AND admin_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
}

module.exports = new DepartmentModel;