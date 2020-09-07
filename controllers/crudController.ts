const db = require('../db');

const crudController = () => {
    const crud = async (req:any, res:any) => {
        try {
            return await db.query(req, res);
        }
        catch (err) {
            res.status(500);
            return res.send('Server Error. Try again later.')
        }
    };

    return { crud };
}

module.exports = crudController