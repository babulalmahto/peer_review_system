const router = require('express').Router();

const employeeController = require('../controller/employee.controller');

/** 
 * @swagger
 * /admin/employee/register:
 *   post:
 *     summary: Register a new Employee.
 *     description: This is post request for creating a new employee by admin.
 *     security:
 *       - jwt: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *                 example: ramesh123
 *               firstname:
 *                 type: string
 *                 description: The user's firstname.
 *                 example: Ramesh
 *               lastname:
 *                 type: string
 *                 description: The user's lastname.
 *                 example: Kumar
 *               password:
 *                 type: string
 *                 description: password.
 *                 example: ramesh123
 *               age:
 *                 type: number
 *                 description: The user's age
 *                 example: 24
 *               departmentname:
 *                 type: string
 *                 description: Name of department
 *                 example: php
 *     responses: 
 *       '201':
 *          description: Created
 *       '404':
 *          description: Not Found
 *       '405':
 *          description: Method not allowed 
 *       '400':
 *          description: Bad Request   
 */
router.post('/register', employeeController.createEmployee);

/**
 * @swagger
 * /admin/employee/list:
 *   get:
 *     summary: Get Employee's Names
 *     description: This is get request to get names of all employees created by admin
 *     security:
 *       - jwt: [] 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found       
 */
router.get('/list', employeeController.getEmployeeByAdmin);


router.get('/employeeDetails/:username', employeeController.getEmployeeDetailsByAdmin);
/** 
 * @swagger
 * /admin/employee/update:
 *   put:
 *     summary: Update employee.
 *     description: This is a put request for updating employee data by admin. 
 *     security:
 *       - jwt: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The employee's username.
 *                 example: ramesh123
 *               firstname:
 *                 type: string
 *                 description: The employee's firstname.
 *                 example: Ramesh
 *               lastname:
 *                 type: string
 *                 description: The employee's lastname.
 *                 example: Doe
 *               password:
 *                 type: string
 *                 description: password.
 *                 example: ramesh123
 *               age:
 *                 type: number
 *                 description: The user's age
 *                 example: 23
 *               departmentname:
 *                 type: string
 *                 description: Name of the department
 *                 example: php
 *     responses: 
 *       '205':
 *          description: Reset Content
 *       '404':
 *          description: Not Found
 *       '400':
 *          description: Bad Request  
 */
router.put('/update', employeeController.updateEmployeeByAdmin);

/**
 * @swagger
 * /admin/employee/delete:
 *   delete:
 *     summary: Delete Employee.
 *     description: This is a delete request to delete employee by admin.
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username which is to be deleted.
 *                 example: ramesh123 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found 
 *       '400':
 *          description: Bad Request       
 */
router.delete('/delete/:username', employeeController.deleteEmployeeByAdmin);

module.exports = router;