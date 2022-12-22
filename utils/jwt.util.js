const jwt = require('jsonwebtoken');

/**
 * createToken - function to create token  
 * @param {*} username 
 * @param {*} name 
 * @returns 
 */
function createToken(userData) {
    const { user_id, first_name, last_name, age, role, department_id } = userData;

    const token = jwt.sign({
        id: user_id,
        firstName: first_name,
        lastName: last_name,
        age: age,
        role: role,
        department: department_id
    }, "secret");
    return token;
}


/**
 * verifyToken - function to verify token
 * @param {*} token 
 * @returns 
 */
function verifyToken(token) {
    return jwt.verify(token, 'secret');
}


module.exports = { createToken, verifyToken };