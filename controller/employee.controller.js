const userModel = require('../model/user.model');
const departmentModel = require('../model/department.model');
const { schema } = require('../services/user.validate');
const encryptDecrypt = require('../services/encryptdecrypt');
const { createToken } = require('../utils/jwt.util');
const e = require('express');

class EmployeeController {

    /**
     * createEmployee - function to create employee by admin
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async createEmployee(req, res) {
        try {
            const { username, firstname, lastname, password, age, departmentname } = req.body;
            const { id } = req.user;

            const validator = await schema.validateAsync({ username, firstname, lastname, password, age });

            const [checkUserExist] = await userModel.checkUserExist(username);

            if (checkUserExist) return res.status(405).json({ code: 405, message: "User Already exist" });

            const pass = await encryptDecrypt.encryptPass(password);

            if (!departmentname) {

                const createEmployeeDb1 = userModel.createEmployeeDb1(username, firstname, lastname, pass, age, id);

            } else {
                const [department] = await departmentModel.checkDeptExist(departmentname, id);

                if (!department) return res.status(400).json({ code: 400, message: "Department doesnot match" })

                const createEmployeeDb = userModel.createEmployeeDb(username, firstname, lastname, pass, age, id, department.department_id);
            }

            res.status(201).json({ code: 201, message: "New employee added" });
        } catch (error) {
            if (error.isJoi === true) {
                return res.status(405).json({ message: error.details[0].message })
            }
            res.status(404).json(error);
        }
    }

    async getEmployeeDetailsByAdmin(req, res) {
        try {
            const { username } = req.params;
            let userDataObj = {};

            const [userData] = await userModel.getUserByUname(username);

            if (userData.departmentName) {
                userDataObj = {
                    username: username,
                    firstname: userData.first_name,
                    lastname: userData.last_name,
                    age: userData.age,
                    department: userData.departmentName
                };
            } else {
                userDataObj = {
                    username: username,
                    firstname: userData.first_name,
                    lastname: userData.last_name,
                    age: userData.age,
                    department: null
                }
            }

            res.status(200).json({ code: 200, message: userDataObj })

        } catch (error) {
            res.status(404).json(error);
        }
    }


    /**
     * getEmployee - function to get list of employee by admin
     * @param {*} req 
     * @param {*} res 
     */
    async getEmployeeByAdmin(req, res) {
        try {
            const { id } = req.user;
            const getEmployeeDb = await userModel.getEmployeeDb(id);
            const employeeData = [];

            if (!getEmployeeDb.length) return res.status(200).json({ code: 200, message: 'You have not added any employee' });

            for (let elem of getEmployeeDb) {
                employeeData.push({
                    username: elem.username,
                    name: `${elem.first_name} ${elem.last_name}`,
                    age: elem.age,
                    departmentName: elem.departmentName
                });
            }

            res.status(200).json({ code: 200, message: employeeData });
        }
        catch (error) {
            res.status(404).json(error);
        }
    }


    /**
     * updateEmployee - function to update employee by admin
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async updateEmployeeByAdmin(req, res) {
        try {
            const { id } = req.user;
            const { username, firstname, lastname, password, age, departmentname } = req.body;
            if (!username) return res.status(400).json({ code: 400, message: "Please enter username" });

            // const [checkUserExistByAdmin] = await userModel.checkUserExistByAdmin(id, username);
            // if (!checkUserExistByAdmin) return res.status(400).json({ code: 400, message: "Username doestnot exist" });

            const pass = await encryptDecrypt.encryptPass(password);

            if (!departmentname) {
                const updateEmployeeDb = await userModel.updateEmployeeDb(username, firstname, lastname, pass, age);

                return res.status(200).json({ code: 200, message: 'Employee updated' });
            }

            const [department] = await departmentModel.checkDeptExist(departmentname, id);
            if (!department) return res.status(400).json({ code: 400, message: "Department doesnot exist" });

            const updateEmployeeDb = await userModel.updateEmployeeDb(username, firstname, lastname, pass, age, department.department_id);

            res.status(200).json({ code: 200, message: 'Employee updated' });

        } catch (error) {
            res.status(404).json(error);
        }
    }


    /**
     * deleteEmployeeByAdmin - function to delete employee by admin
     * @param {*} req 
     * @param {*} res 
     */
    async deleteEmployeeByAdmin(req, res) {
        try {
            const { id } = req.user;
            const { username } = req.params;

            if (!username) return res.status(400).json({ code: 400, message: "Please enter username" })

            // const [checkUserExistByAdmin] = await userModel.checkUserExistByAdmin(id, username);
            // if (!checkUserExistByAdmin) return res.status(400).json({ code: 400, message: "Username doestnot exist" });

            const deleteEmployeeByAdminDb = userModel.deleteEmployeeByAdminDb(username);
            res.status(200).json({ code: 200, message: `Employee named ${username} is deleted successfully` });

        } catch (error) {
            res.status(404).json(error);
        }
    }


    /**
     * employeeLogin - function to login for employee
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async employeeLogin(req, res) {
        try {
            const { username, password } = req.body;

            const [userData] = await userModel.getUserByUname(username);
            if (!userData) return res.status(404).json({ code: 404, message: 'Username not found' });

            if (userData.role !== 'employee') return res.status(404).json({
                code: 404,
                message: 'You are not an employee, only employee can login'
            });

            const decryptPass = await encryptDecrypt.decryptPass(password, userData.password);
            if (!decryptPass) return res.status(401).json({ code: 401, message: "Password entered is Incorrect" });

            const token = createToken(userData);
            res.status(200).json({ code: 200, token: token });

        } catch (error) {
            res.status(404).json(error);
        }
    }


    /**
     * getEmployee - function to get details of employee by employee
     * @param {*} req 
     * @param {*} res 
     */
    async getEmployee(req, res) {
        try {
            const { username, firstname, lastname, age, role, departmentId } = req.user;
            const [deptName] = await departmentModel.getDepartmentNameById(departmentId);

            if (!deptName) {
                res.status(200).json({
                    username: username,
                    name: `${firstname} ${lastname}`,
                    age: age,
                    role: role,
                    departmentname: null
                });
            } else {
                res.status(200).json({
                    username: username,
                    name: `${firstname} ${lastname}`,
                    age: age,
                    role: role,
                    departmentname: deptName.department_name
                });
            }
        } catch (error) {
            res.status(404).json(error);
        }
    }
}

module.exports = new EmployeeController;