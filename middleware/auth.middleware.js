const { verifyToken } = require('../utils/jwt.util');
const userModel = require('../model/user.model');

async function authenticateToken(req, res, next) {
    try {
        let tokenFromReq = req.body.token || req.query.token || req.headers['x-access-token'];
        if (req.headers['authorization']) {
            const authHeader = req.headers['authorization'];
            if (!authHeader) return res.status(401).json({ code: 401, message: "Access Denied token required" })
            tokenFromReq = authHeader.split(" ")[1];
        }

        if (tokenFromReq == null) return res.status(404).json({ code: 404, message: "Access Denied" });
        
        const payload = verifyToken(tokenFromReq);
        const [userData] = await userModel.getUserById(payload.id);

        payload.username = userData.username;
        payload.role = userData.role;
        payload.departmentId = userData.department_id;
        payload.adminId = userData.admin_id;
        payload.age = userData.age;

        req.user = payload;
        next();
    } catch (error) {
        res.status(404).json({ code: 404, message: "Authentication Failed" })
    }
}


async function authoriseAdmin(req, res, next) {
    try {
        const { role } = req.user;
        if (role == 'admin') next();
        else return res.status(404).json({ code: 404, message: `You are not authorised to do this operation` });
    } catch (error) {
        next(error);
    }
}


async function authoriseEmployee(req, res, next) {
    try {
        const { role } = req.user;
        if (role == 'employee') next();
        else return res.status(404).json({ code: 404, message: `You are not authorised to do this operation` });
    } catch (error) {
        next(error);
    }
}

module.exports = { authenticateToken, authoriseAdmin, authoriseEmployee };