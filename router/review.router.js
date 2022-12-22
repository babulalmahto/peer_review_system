const router = require('express').Router();
const reviewController = require('../controller/review.controller');

/**
 * @swagger
 * /employee/review/review_list:
 *   get:
 *     summary: Get employee username which can be reviewed.
 *     description: This is get request to get usernames of employee which can be reviewed
 *     security:
 *       - jwt: [] 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found       
 */
router.get('/review_list', reviewController.getReviewToWhom);

/** 
 * @swagger
 * /employee/review/give:
 *   post:
 *     summary: Employee give review.
 *     description: This is a post request for employee giving review to their peer.
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
 *               score:
 *                 type: number
 *                 description: Score between 1 to 10.
 *                 example: 7
 *               comment:
 *                 type : string
 *                 description: Comment how employee think of their peer
 *                 example: He is hard working
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
router.post('/give', reviewController.giveReview);

/**
 * @swagger
 * /employee/review/get:
 *   get:
 *     summary: Get review details.
 *     description: This is get request to get review details by employee.
 *     security:
 *       - jwt: [] 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found       
 */
router.get('/get', reviewController.getReview);

/** 
 * @swagger
 * /employee/review/update:
 *   put:
 *     summary: Update review.
 *     description: This is a put request for updating review by employee. 
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
 *                 example: abc123
 *               score:
 *                 type: number
 *                 description: Score between 1 to 10.
 *                 example: 9
 *               comment:
 *                 type : string
 *                 description: Comment how employee think of their peer
 *                 example: He is hard working
 *     responses: 
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found
 *       '400':
 *          description: Bad Request  
 */
router.put('/update', reviewController.updateReview);

/**
 * @swagger
 * /employee/review/delete:
 *   delete:
 *     summary: Delete Review.
 *     description: This is a delete request to delete review by admin.
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
 *                 example: abc123 
 *     responses:
 *       '200':
 *          description: Ok
 *       '404':
 *          description: Not Found 
 *       '400':
 *          description: Bad Request      
 */
router.delete('/delete/:username', reviewController.deleteReview);

module.exports = router;