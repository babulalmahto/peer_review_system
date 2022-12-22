const userModel = require('../model/user.model');
const encryptDecrypt = require('../services/encryptdecrypt');
const { schema } = require('../services/user.validate');
const { createToken } = require('../utils/jwt.util');


class AdminController {

    /**
     * createadmin - function to create admin
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async createAdmin(req, res) {
        try {
            const { username, firstname, lastname, password, age } = req.body;
            const validator = await schema.validateAsync(req.body);

            const [checkUserExist] = await userModel.checkUserExist(username);
            if (checkUserExist) return res.status(405).json({ code: 405, message: "User Already exist" });

            const pass = await encryptDecrypt.encryptPass(password);

            const createadminDb = await userModel.createadminDb(username, firstname, lastname, pass, age);

            return res.status(201).json({ code: 201, message: "New admin added" });

        } catch (error) {
            if (error.isJoi === true) {
                return res.status(401).json({ message: error.details[0].message })
            }
            res.status(404).json(error);
        }
    }


    /**
     * adminLogin- function to login for admin
     * @param {*} req 
     * @param {*} res 
     */
    async adminLogin(req, res) {
        try {
            const { username, password } = req.body;

            const [userData] = await userModel.getUserByUname(username);
            if (!userData) return res.status(404).json({ code: 404, message: "Username not found" });

            if (userData.role !== 'admin') return res.status(401).json({
                code: 401,
                message: 'Unauthorised User'
            });

            const decryptPass = await encryptDecrypt.decryptPass(password, userData.password);
            if (!decryptPass) return res.status(401).json({ code: 401, message: "Password entered is Incorrect" });
            console.log({user: userData.user_id})
            const token = createToken(userData);
            res.status(200).json({ code: 200, token: token });

        } catch (error) {
            console.log({error})
            res.status(400).json(error);
        }
    }


    /**
     * getAdmin - function to get admin details 
     * @param {*} req 
     * @param {*} res 
     */
    async getAdmin(req, res) {
        try {
            const { username, firstname, lastname, age, role } = req.user;

            res.status(200).json({
                username: username,
                name: `${firstname} ${lastname}`,
                age: age,
                role: role
            });
        } catch (error) {
            res.status(404).json(error);
        }
    }


    /**
     * updateAdmin - function to update admin data
     * @param {*} req 
     * @param {*} res 
     */
    async updateAdmin(req, res) {
        try {
            const { username, password, firstname, lastname, age } = req.body;
            const { id } = req.user;

            if (!username) return res.status(400).json({ code: 400, message: "Please enter username" });

            const pass = await encryptDecrypt.encryptPass(password);

            const updateAdminDb = await userModel.updateAdminDb(username, pass, firstname, lastname, age);

            res.status(200).json({ code: 200, message: 'User data updated' });
        } catch (error) {
            res.status(404).json(error);
        }
    }


    /**
     * deleteAdmin - function to delete admin
     * @param {*} req 
     * @param {*} res 
     */
    async deleteAdmin(req, res) {
        try {
            const { id } = req.user;

            const deleteAdminDb = await userModel.deleteAdminDb(id);
            res.status(200).json({ code: 200, message: 'Admin deleted' });

        } catch (error) {
            res.status(404).json(error);
        }
    }
}

module.exports = new AdminController;