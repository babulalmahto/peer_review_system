const mysql = require('../mysql_connection/mysql.connection');

class ReviewModel {

    /**
     * checkReviewExist - function to check review alredy present in db
     * @param {*} reviewerId 
     * @param {*} revieweeId 
     * @returns 
     */
    checkReviewExist(reviewerId, revieweeId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT review_id FROM reviews 
                    WHERE reviewer_id = '${reviewerId}' AND reviewee_id = '${revieweeId}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * createReview - function to create review
     * @param {*} reviewerId 
     * @param {*} revieweeId 
     * @param {*} score 
     * @param {*} comment 
     * @returns 
     */
    createReview(reviewerId, revieweeId, score, comment) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO reviews (reviewer_id, reviewee_id, score, comments)
                 VALUES ('${reviewerId}', '${revieweeId}', '${score}', '${comment}');`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * getReviewDbByReviewee - function to get review details by review_id
     * @param {*} id 
     * @returns 
     */
    getReviewDbByReviewee(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM reviews WHERE reviewee_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * getReviewByreviewer - function to get details by reviewer_id
     * @param {*} id 
     * @returns 
     */
    getReviewByReviewer(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM reviews WHERE reviewer_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
    * getReviewByreviewer - function to get details by reviewer_id
    * @param {*} id 
    * @returns 
    */
    getReviews(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM reviews WHERE reviewer_id = '${id}' OR reviewee_id = '${id}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * getReviewByTimestamp - function to get 
     * @param {*} reviewId 
     */
    getReviewByTimestamp(reviewId, limit) {
        return new Promise((resolve, reject) => {
            const query = `SELECT *
            FROM reviews WHERE (review_id = '${reviewId}') AND
             (updated_at > DATE_SUB(now(), INTERVAL ${limit} DAY));`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * updateReviewDb - function to update review in Db
     * @param {*} reviewId 
     * @param {*} score 
     * @param {*} comment 
     */
    updateReviewDb(reviewId, score, comment) {
        return new Promise((resolve, reject) => {
            let updateStr = ``;

            if (score) {
                updateStr += updateStr ? `, score = '${score}'` : `SET score = '${score}'`;
            }
            if (comment) {
                updateStr += updateStr ? `, comments = '${comment}'` : `SET comments = '${comment}'`;
            }

            const query = `UPDATE reviews ${updateStr} WHERE review_id = '${reviewId}';`;

            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }

    /**
     * deleteReviewDb - function to delete review in Db
     * @param {*} reviewId 
     */
    deleteReviewDb(reviewId) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM reviews WHERE 
                        review_id = '${reviewId}';`;
            mysql().query(query, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    }
}

module.exports = new ReviewModel;