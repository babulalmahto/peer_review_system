const router = require('express').Router();

const employeeRouter = require('./employee.router')

const adminRouter = require('./admin.router');

const { authenticateToken } = require('../middleware/auth.middleware');

const userModel = require('../model/user.model');

const departmentModel = require('../model/department.model')

const encryptDecrypt = require('../services/encryptdecrypt');

const { createToken } = require('../utils/jwt.util');

router.use('/admin', adminRouter);

router.use('/employee', employeeRouter);

module.exports = { router };