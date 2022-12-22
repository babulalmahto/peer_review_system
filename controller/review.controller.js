const departmentModel = require('../model/department.model');
const userModel = require('../model/user.model');
const reviewModel = require('../model/review.modal');

class ReviewController {
    /**
     * getReviewToWhom - function for employee to check whom can they review
     * @param {*} req 
     * @param {*} res 
     */
    async getReviewToWhom(req, res) {
        try {
            const { username, departmentId } = req.user;
            const revieweeList = [];

            if (!departmentId) {
                const revieweeListDb = await userModel.getDepartmentIdNull();
                for (let i = 0; i < revieweeListDb.length; i++) {
                    if (revieweeListDb[i].username !== username) {
                        revieweeList.push(revieweeListDb[i].username);
                    }
                }
            } else {
                const [reviewerDept] = await departmentModel.getDepartmentNameById(departmentId);
                const deptIds = await departmentModel.getDepartmentIdByName(reviewerDept.department_name);

                for (let i = 0; i < deptIds.length; i++) {
                    deptIds[i] = deptIds[i].department_id;
                }

                const revieweeListDb = await userModel.getUsersByDepartment(deptIds);

                for (let i = 0; i < revieweeListDb.length; i++) {
                    if (revieweeListDb[i].username !== username) {
                        revieweeList.push(revieweeListDb[i].username);
                    }
                }
            }

            res.status(200).json({ code: 200, message: revieweeList });
        } catch (error) {
            res.status(404).json(error);
        }
    }

    /**
     * giveReviewList = [] - function to give review by employee
     * @param {*} req 
     * @param {*} res 
     */
    async giveReview(req, res) {
        try {
            const { id, departmentId } = req.user;
            const { username, score, comment } = req.body;

            // const [checkUserExist] = await userModel.checkUserExist(username);
            // if (!checkUserExist) return res.status(400).json({ code: 400, message: "Reviewee username doesn't exist" });

            const [reviewerDept] = await departmentModel.getDepartmentNameById(departmentId);

            const [revieweeData] = await userModel.getUserByUname(username);
           
            const [revieweeDept] = await departmentModel.getDepartmentNameById(revieweeData.department_id);

            if (revieweeData.role !== 'employee') return res.status(405).json({
                code: 405,
                message: 'You cannot review those who are not an employee'
            });

            if (id === revieweeData.user_id) return res.status(405).json({
                code: 405,
                messsage: 'You cannot give review to yourself'
            });

            if ((score > 10) || (score < 1)) return res.status(400).json({
                code: 400,
                message: 'You can give score between 1 to 10'
            });

            // const [checkReviewExist] = await reviewModel.checkReviewExist(id, revieweeData.user_id);
            // if (checkReviewExist) return res.status(400).json({
            //     code: 400,
            //     message: `You have already reviewed ${username}, you can't review again`
            // });

            if (reviewerDept && revieweeDept) {
                const reviewerDeptName = reviewerDept.department_name;
                const revieweeDeptName = revieweeDept.department_name;

                if (reviewerDeptName === revieweeDeptName) {
                    const createReview = await reviewModel.createReview(id, revieweeData.user_id, score, comment);
                } else {
                    return res.status(400).json({
                        code: 400,
                        message: 'You cannot review as your department is not same of the reviewee department'
                    })
                }
            }

            if (reviewerDept && !revieweeDept) return res.status(400).json({
                code: 400,
                message: `You cannot review those employee who are not in any department`
            });

            if (!reviewerDept && revieweeDept) return res.status(400).json({
                code: 400,
                message: `You are not in any department you can only review employees those are not in any department`
            });

            if (!reviewerDept && !revieweeDept) {
                const createReview = await reviewModel.createReview(id, revieweeData.user_id, score, comment);
            }

            res.status(201).json({
                code: 201,
                message: `You have reviewed ${username}`
            });

        } catch (error) {
            res.status(404).json(error);
        }
    }

    /**
     * getReview - function to get review
     * @param {*} req 
     * @param {*} res 
     */
    async getReview(req, res) {
        try {
            const { id } = req.user;
            const getReviewList = [], giveReviewList = [], reviewDataGet = [], reviewDataGive = [], userId = [], userIdUnique = [];

            const reviewData = await reviewModel.getReviews(id);

            for (let elem of reviewData) {
                if (elem.reviewee_id === id) {
                    reviewDataGet.push(elem);
                } else {
                    reviewDataGive.push(elem);
                }
                userId.push(elem.reviewer_id);
                userId.push(elem.reviewee_id);
            }

            userId.forEach(id => {
                if (!userIdUnique.includes(id)) {
                    userIdUnique.push(id);
                }
            });

            const usernames = await userModel.getUsernamesByIds(userIdUnique);

            for (let elem of reviewDataGet) {
                let index = usernames.findIndex(x => x.user_id === elem.reviewer_id);

                getReviewList.push({
                    reviewBy: usernames[index].username,
                    score: elem.score,
                    comment: elem.comments
                });
            }

            for (let elem of reviewDataGive) {
                let index = usernames.findIndex(x => x.user_id === elem.reviewee_id);

                giveReviewList.push({
                    giveReviewTo: usernames[index].username,
                    score: elem.score,
                    comment: elem.comments
                });
            }

            if (!getReviewList.length) getReviewList.push('No one has reviewed you yet');

            if (!giveReviewList.length) giveReviewList.push(`You haven't reviewed anyone yet`);

            res.status(200).json({
                code: 200,
                reviewsGot: getReviewList,
                reviewsGiven: giveReviewList
            });
        }
        catch (error) {
            res.status(404).json(error);
        }
    }

    /**
     * updateReview - function to update review
     * @param {*} req 
     * @param {*} res 
     */
    async updateReview(req, res) {
        try {
            const { id } = req.user;
            const { username, score, comment } = req.body;
            const limit = 365;

            // const [checkUserExist] = await userModel.checkUserExist(username);
            // if (!checkUserExist) return res.status(400).json({ code: 400, message: "Reviewee username doesn't exist" });

            const [revieweeData] = await userModel.getUserByUname(username);
            const revieweeId = revieweeData.user_id;

            const [checkReviewExist] = await reviewModel.checkReviewExist(id, revieweeId);
            if (!checkReviewExist) return res.status(404).json({
                code: 404,
                message: `You haven't reviewed ${username} yet`
            });

            const reviewId = checkReviewExist.review_id;

            const [getReviewByTimestamp] = await reviewModel.getReviewByTimestamp(reviewId, limit);
            if (!getReviewByTimestamp) return res.status(400).json({
                code: 400,
                message: `You cannot update review of ${username}`
            });

            const updateReviewDb = await reviewModel.updateReviewDb(reviewId, score, comment);

            res.status(200).json({ code: 200, message: 'Review updated' });
        }
        catch (error) {
            res.status(404).json(error);
        }
    }

    /**
     * deleteReview - function to delete review
     * @param {*} req 
     * @param {*} res 
     */
    async deleteReview(req, res) {
        const { id } = req.user;
        const { username } = req.params;
        const limit = 365;

        // const [checkUserExist] = await userModel.checkUserExist(username);
        // if (!checkUserExist) return res.status(400).json({ code: 400, message: "Reviewee username doesn't exist" });

        const [revieweeData] = await userModel.getUserByUname(username);
        const revieweeId = revieweeData.user_id;

        const [checkReviewExist] = await reviewModel.checkReviewExist(id, revieweeId);
        if (!checkReviewExist) return res.status(404).json({
            code: 404,
            message: `You haven't reviewed ${username} yet`
        });

        const reviewId = checkReviewExist.review_id;

        const [getReviewByTimestamp] = await reviewModel.getReviewByTimestamp(reviewId, limit);
        if (!getReviewByTimestamp) return res.status(400).json({
            code: 400,
            message: `You cannot delete review of ${username}`
        });

        const deleteReviewDb = await reviewModel.deleteReviewDb(reviewId);

        res.status(200).json({ code: 200, message: 'Review deleted' });

    }
}

module.exports = new ReviewController;