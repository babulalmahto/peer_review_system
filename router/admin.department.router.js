const router = require('express').Router();

const departmentController = require('../controller/department.controller');

/**
 * @swagger
 * /admin/department/create:
 *   post:
 *     summary: Create New Department.
 *     description: This is post request for creating a new department by admin.
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentname:
 *                 type: string
 *                 description: New department name.
 *                 example: php
 *     responses:
 *       '201':
 *          description: Created 
 *       '400':
 *          description: Bad Request
 *       '404':
 *          description: Not Found
 *       '405':
 *          description: Method Not Allowed                   
 */
router.post('/create', departmentController.createDepartment);

/**
 * @swagger
 * /admin/department/list:
 *   get:
 *     summary: Get Department's Names.
 *     description: This is get request to get names of all departments created by admin
 *     security:
 *       - jwt: [] 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found       
 */
router.get('/list', departmentController.getDepartment);

/** 
 * @swagger
 * /admin/department/update:
 *   put:
 *     summary: Update Department.
 *     description: This is a put request for updating department by admin. 
 *     security:
 *       - jwt: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentname1:
 *                 type: string
 *                 description: The department's name which is to be changed.
 *                 example: nodejs
 *               departmentname2:
 *                 type: string
 *                 description: The new dapartment name.
 *                 example: ios
 *     responses: 
 *       '200':
 *          description: Ok
 *       '400':
 *          description: Bad Request
 *       '404':
 *          description: Not Found  
 */
router.put('/update', departmentController.updateDepartment);

/**
 * @swagger
 * /admin/department/delete:
 *   delete:
 *     summary: Delete Department.
 *     description: This is a delete request to delete department by admin.
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentname:
 *                 type: string
 *                 description: The department's name which is to be deleted.
 *                 example: nodejs 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found 
 *       '400':
 *          description: Bad Request       
 */
router.delete('/delete/:departmentname', departmentController.deleteDepartment);

module.exports = router;