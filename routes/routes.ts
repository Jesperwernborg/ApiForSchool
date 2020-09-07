const expressRouter = require('express');
const crud = require('../controllers/crudController');

function routes() {
    const router = expressRouter.Router();
    const controller = crud();

    const query = (sp:string) => {
        return async function(req:any, res: any) {
            req.sql = { sp }
            await controller.crud(req, res);
        }
    }
    router.route('/students')
        .get(query('GetStudents'))
        .post(query('AddStudents'))

    router.route('/students/:Id')
        .get(query('GetStudent'))
        .put(query('UpdateStudent'))
        .delete(query('DeleteStudent'))     
        
        
        router.route('/teachers')
        .get(query('GetTeachers'))
        .post(query('AddTeachers'))

    router.route('/teachers/:Id')
        .get(query('GetTeacher'))
        .put(query('UpdateTeacher'))
        .delete(query('DeleteTeacher'))  

        return router;
};

module.exports = routes