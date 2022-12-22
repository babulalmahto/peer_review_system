const router = require('express').Router();
const employeeController = require('../controller/employee.controller');
const { authenticateToken, authoriseEmployee } = require('../middleware/auth.middleware');
const reviewRouter = require('./review.router');

/** 
 * @swagger
 * /employee/login:
 *   post:
 *     summary: Employee login.
 *     description: This is a post request for employee login.
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
 *               password:
 *                 type: string
 *                 description: password.
 *                 example: ramesh123
 *     responses:
 *       '200':
 *          description: Ok
 *       '401':
 *          description: Unauthorised
 *       '404':
 *          description: Not Found     
 */
router.post('/login', employeeController.employeeLogin);
 
router.use(authenticateToken, authoriseEmployee)

/**
 * @swagger
 * /employee/get:
 *   get:
 *     summary: Get employee details.
 *     description: This is get request to get details of employee who is logged in.
 *     security:
 *       - jwt: [] 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found       
 */
router.get('/get', employeeController.getEmployee);

router.use('/review', reviewRouter);

module.exports = router;