const router = require('express').Router();
const adminController = require('../controller/admin.controller');
const adminDepartmentRouter = require('./admin.department.router');
const adminEmployeeRouter = require('./admin.employee.router');
const { authenticateToken, authoriseAdmin } = require('../middleware/auth.middleware');

/** 
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new admin.
 *     description: This is post request for creating a new admin. 
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
 *                 example: johndoe123
 *               firstname:
 *                 type: string
 *                 description: The user's firstname.
 *                 example: John
 *               lastname:
 *                 type: string
 *                 description: The user's lastname.
 *                 example: Doe
 *               password:
 *                 type: string
 *                 description: password.
 *                 example: JohnDoe123
 *               age:
 *                 type: number
 *                 description: The user's age
 *                 example: 23
 *     responses: 
 *       '201':
 *          description: User created
 *       '401':
 *          description: Unauthorised
 *       '404':
 *          description: Not Found
 *       '405':
 *          description: Method not allowed    
 */
router.post('/register', adminController.createAdmin);

/** 
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login.
 *     description: This is a post request for admin login.
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
 *                 example: johndoe123
 *               password:
 *                 type: string
 *                 description: password.
 *                 example: JohnDoe123
 *     responses:
 *       '200':
 *          description: Ok
 *       '400':
 *          description: Bad request
 *       '401':
 *          description: Unauthorised
 *       '404':
 *          description: Not Found     
 */
router.post('/login', adminController.adminLogin);

router.use(authenticateToken, authoriseAdmin);

/**
 * @swagger
 * /admin/get:
 *   get:
 *     summary: Get admin details.
 *     description: This is get request to get details of admin who is logged in.
 *     security:
 *       - jwt: [] 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found       
 */
router.get('/get', adminController.getAdmin);

/** 
 * @swagger
 * /admin/update:
 *   put:
 *     summary: Update admin.
 *     description: This is a put request for updating admin data. 
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
 *                 example: johndoe123
 *               firstname:
 *                 type: string
 *                 description: The user's firstname.
 *                 example: John
 *               lastname:
 *                 type: string
 *                 description: The user's lastname.
 *                 example: Doe
 *               password:
 *                 type: string
 *                 description: password.
 *                 example: JohnDoe123
 *               age:
 *                 type: number
 *                 description: The user's age
 *                 example: 23
 *     responses: 
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found
 *       '400':
 *          description: Bad Request  
 *       '401':
 *          description: Unauthorised   
 */
router.put('/update', adminController.updateAdmin);

/**
 * @swagger
 * /admin/delete:
 *   delete:
 *     summary: Delete Admin.
 *     description: This is a delete request to delete admin who is logged in.
 *     security:
 *       - jwt: [] 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found       
 */
router.delete('/delete', adminController.deleteAdmin);

router.use('/department', adminDepartmentRouter);

router.use('/employee', adminEmployeeRouter);

module.exports = router;