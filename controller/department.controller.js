const departmentModel = require('../model/department.model');

class DepartmentController {

    /**
    * createDepartment - function to create department
    * @param {*} req 
    * @param {*} res 
    */
    async createDepartment(req, res) {
        try {
            const { departmentname } = req.body;
            const { id } = req.user;

            if (!departmentname) return res.status(400).json({
                code: 400,
                message: 'Please enter departmentname'
            });

            const [checkDeptExist] = await departmentModel.checkDeptExist(departmentname, id)

            if (checkDeptExist) return res.status(405).json({
                code: 405,
                message: "Department already created by you"
            });

            const createDepartmentDb = await departmentModel.createDepartmentDb(departmentname, id);

            res.status(201).json({
                code: 201,
                message: `New Department Created named ${departmentname}`
            });
        } catch (error) {
            res.status(404).json(error);
        }
    }


    /**
     * getDepartment - function to get department list
     * @param {*} req 
     * @param {*} res 
     */
    async getDepartment(req, res) {
        try {
            const { id } = req.user;
            const departmentList = await departmentModel.getDepartmentList(id);
            if (!departmentList.length) {
                return res.status(200).json({
                    code: 200,
                    message: `You haven't created any department yet`
                });
            }
            res.status(200).json({ code: 200, message: departmentList });
        } catch (error) {
            res.status(404).json(error);
        }
    }


    /**
     * updateDepartment - function to update department
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async updateDepartment(req, res) {
        try {
            const { id } = req.user;
            const { departmentname1, departmentname2 } = req.body;

            if ((!departmentname1) || (!departmentname2)) return res.status(400).json({
                code: 400,
                message: 'Please Enter Department Name'
            });

            // const [checkDeptExist] = await departmentModel.checkDeptExist(departmentname1, id);

            // if (!checkDeptExist) return res.status(400).json({
            //     code: 400,
            //     message: `There is no department named ${departmentname1} created by you`
            // });

            const [checkDept2Exist] = await departmentModel.checkDeptExist(departmentname2, id);
            if (checkDept2Exist) return res.status(400).json({
                code: 400,
                message: `There is already a department named ${departmentname2} created by you. Name cannot be changed.`
            })
            const updateDepartmentDb = await departmentModel.updateDepartmentDb(id, departmentname1, departmentname2);

            res.status(200).json({ code: 200, message: `${departmentname1} changed to ${departmentname2} successfully` });
        } catch (error) {
            res.status(404).json(error);
        }
    }

    /**
     * deleteDepartment - function to delete department
     * @param {*} req 
     * @param {*} res 
     */
    async deleteDepartment(req, res) {
        try {
            const { departmentname } = req.params;
            const { id } = req.user;

            if (!departmentname) return res.status(400).json({
                code: 400,
                message: 'Please enter departmentname'
            });

            // const [checkDeptExist] = await departmentModel.checkDeptExist(departmentname, id);
            // if (!checkDeptExist) return res.status(400).json({
            //     code: 400,
            //     message: `There is no department named ${departmentname} created by you`
            // });

            const deleteDepartmentDb = await departmentModel.deleteDepartmentDb(id, departmentname);

            res.status(200).json({ code: 200, message: `Department named '${ departmentname}' deleted successfully` });
        } catch (error) {
            res.status(404).json(error);
        }
    }
}

module.exports = new DepartmentController;