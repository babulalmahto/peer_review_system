const mysql = require('../mysql_connection/mysql.connection');

class UserModel {

    /**
     * checkUserExist - function to check/find username in database
     * @param {*} username 
     * @returns 
     */
    checkUserExist(username) {
        return new Promise((resolve, reject) => {
            const query = `SELECT username FROM users WHERE username = '${username}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * checkUserExistById - function to check/find id in database
     * @param {*} id 
     * @returns 
     */
    checkUserExistById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT user_id FROM users  WHERE user_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * checkUserExistByAdmin - function to check check user exist by username and admin_id
     * @param {*} id 
     * @param {*} username 
     * @returns 
     */
    checkUserExistByAdmin(id, username) {
        return new Promise((resolve, reject) => {
            const query = `SELECT username FROM users WHERE username = '${username}' AND admin_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        })
    }

    /**
     * getUserByUname - function to get user details by username
     * @param {*} username 
     * @returns 
     */
    getUserByUname(username) {
        return new Promise((resolve, reject) => {
            const query = `SELECT u.user_id, u.first_name, u.last_name, u.age, u.department_id, u.role, password, (SELECT d.department_name from departments d WHERE d.department_id = u.department_id) as departmentName
                           FROM users u WHERE u.username = '${username}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * getUserById - function to get user details by id
     * @param {*} id 
     */
    getUserById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT username, first_name, last_name, password, age, role, admin_id,
                            department_id FROM users WHERE user_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }


    /**
     * getDepartmentIdNull - function to get username where department_id  is null
     */
    getDepartmentIdNull() {
        return new Promise((resolve, reject) => {
            const query = `SELECT username FROM users WHERE department_id IS NULL AND role = 'employee';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }


    // getUsersByDepartment(id) {
    //     return new Promise((resolve, reject) => {
    //         const query = `SELECT username FROM users WHERE department_id = '${id}';`;
    //         mysql().query(query, (err, data) => {
    //             if (err) reject(err);
    //             resolve(data);
    //         });
    //     });
    // }

    getUsersByDepartment(ids) {
        return new Promise((resolve, reject) => {
            let query = ``;
            for (let i = 0; i < ids.length; i++) {
                if (!query) {
                    query += `SELECT username FROM users WHERE department_id = ${ids[i]} `;
                } else {
                    query += `OR department_id = ${ids[i]} `;
                }
            }

            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * checkAdminExist - function to check user_id and username exist or not
     * @param {*} username 
     * @param {*} id 
     */
    checkAdminExist(username, id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT username FROM users WHERE username = '${username}' AND user_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * createadminDb - function to create admin
     * @param {*} username 
     * @param {*} firstname 
     * @param {*} lastname 
     * @param {*} password 
     * @param {*} age 
     * @returns 
     */
    async createadminDb(username, firstname, lastname, password, age) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users (username, first_name, last_name, password, age, role)
            VALUES ('${username}', '${firstname}', '${lastname}', '${password}', '${age}', 'admin');`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * getRole - function to get role by username
     * @param {*} usrname 
     */
    getRole(username) {
        return new Promise((resolve, reject) => {
            const query = `SELECT role FROM users WHERE username = '${username}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * updateAdminDb - function to update admin data
     * @param {*} username 
     * @param {*} password 
     * @param {*} firstname 
     * @param {*} lastname 
     * @param {*} age 
     * @returns 
     */
    updateAdminDb(username, password, firstname, lastname, age) {
        return new Promise((resolve, reject) => {
            let updateStr = ``;
            if (firstname) {
                updateStr += updateStr ? `, first_name = '${firstname}'` : `SET first_name = '${firstname}'`;
            }

            if (lastname) {
                updateStr += updateStr ? `, last_name = '${lastname}'` : `SET last_name = '${lastname}'`;
            }

            if (password) {
                updateStr += updateStr ? `, password = '${password}'` : `SET password = '${password}'`;
            }

            if (age) {
                updateStr += updateStr ? ` , age = '${age}'` : `SET age = '${age}'`;
            }

            const query = `UPDATE users ${updateStr} WHERE username = '${username}';`

            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * deleteAdminDb - function to delete admin in db
     * @param {*} id 
     */
    deleteAdminDb(id) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM users WHERE user_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * createEmployeeDb - function to create employee by admin
     * @param {*} username 
     * @param {*} firstname 
     * @param {*} lastname 
     * @param {*} password 
     * @param {*} age 
     * @param {*} id 
     * @param {*} departmentId 
     * @returns 
     */
    createEmployeeDb(username, firstname, lastname, password, age, id, departmentId) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users (username, first_name, last_name, password, age, role, admin_id, department_id)
            VALUES ('${username}', '${firstname}', '${lastname}', '${password}', '${age}', 'employee', '${id}', '${departmentId}');`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * createEmployeeDb1 - function to create employee withing having department
     * @param {*} username 
     * @param {*} firstname 
     * @param {*} lastname 
     * @param {*} password 
     * @param {*} age 
     * @param {*} id 
     * @returns 
     */
    createEmployeeDb1(username, firstname, lastname, password, age, id) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users (username, first_name, last_name, password, age, role, admin_id)
            VALUES ('${username}', '${firstname}', '${lastname}', '${password}', '${age}', 'employee', '${id}');`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
    /**
     * getEmployeeDb - function to get employee details from db
     * @param {*} id 
     * @returns 
     */
    getEmployeeDb(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT u.username, u.first_name, u.last_name, u.age, u.department_id, u.admin_id, (SELECT d.department_name from departments d WHERE d.department_id = u.department_id) as departmentName 
                from users u WHERE u.admin_id = '${id}';`;

            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    getUnameById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT username FROM users WHERE user_id = '${id}';`;

            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * updateEmployeeDb - function to update employee in db
     * @param {*} username 
     * @param {*} firstname 
     * @param {*} lastname 
     * @param {*} password 
     * @param {*} age 
     * @param {*} departmentname 
     */
    updateEmployeeDb(username, firstname, lastname, password, age, departmentId) {
        return new Promise((resolve, reject) => {
            let updateStr = '';
            if (firstname) {
                updateStr += updateStr ? `, first_name = '${firstname}'` : `SET first_name = '${firstname}'`;
            }

            if (lastname) {
                updateStr += updateStr ? `, last_name = '${lastname}'` : `SET last_name = '${lastname}'`;
            }

            if (password) {
                updateStr += updateStr ? `, password = '${password}'` : `SET password = '${password}'`;
            }

            if (age) {
                updateStr += updateStr ? ` , age = '${age}'` : `SET age = '${age}'`;
            }

            if (departmentId) {
                updateStr += updateStr ? ` , department_id = '${departmentId}'` : `SET department_id = '${departmentId}'`;
            }

            const query = `UPDATE users ${updateStr} WHERE username = '${username}';`

            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * deleteEmployeeByAdminDb - function to delete employee by admin
     * @param {*} username 
     */
    deleteEmployeeByAdminDb(username) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM users WHERE username = '${username}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    searchUser(search) {
        return new Promise((resolve, reject) => {
            // const query = `SELECT u.user_id, u.username, u.first_name, u.last_name, u.age, u.role FROM users AS u WHERE (u.username LIKE '%${search}%' OR u.first_name LIKE '%${search}%' OR u.last_name LIKE '%${search}%');`;
            const query = `SELECT u.username FROM users AS u WHERE (u.username LIKE '%${search}%' OR u.first_name LIKE '%${search}%' OR u.last_name LIKE '%${search}%');`;

            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * getUsernamesByIds - function to get usernames by ids from Db
     * @param {*} ids 
     */
    getUsernamesByIds(ids) {
        return new Promise((resolve, reject) => {
            let query = ``;
            for (let i = 0; i < ids.length; i++) {
                if (!query) {
                    query += `SELECT user_id, username FROM users WHERE user_id = ${ids[i]} `;
                } else {
                    query += `OR user_id = ${ids[i]} `;
                }
            }

            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

}

module.exports = new UserModel;