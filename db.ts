const sql = require('mssql');
const cfg = require('./config');

const getParameters = (req: any) => {
    /* Id Parameter */
    req.sql.hasId = req.route.path.endsWith('/:Id');
    req.sql.params = req.sql.hasId ? `@Id=${req.params.Id}, ` : '';

    /* Query Parameters */
    Object.getOwnPropertyNames(req.query).forEach(param => {
        if (!isNaN(req.query[param]))
        req.sql.params += `@${param}=${req.query[param]}, `
        else if (typeof req.query[param] === 'boolean')
        req.sql.params += `@${param}=${req.query[param] ? 1 : 0}, `
        else if (typeof req.query[param] === 'string')
        req.sql.params += `@${param}='${req.query[param]}', `
    });

    /* Params Parameters */
    Object.getOwnPropertyNames(req.params).forEach(param => {
        if (param != 'Id') {
            if (!isNaN(req.params[param]))
                req.sql.params += `@${param}=${req.params[param]}, ` 
            else if (typeof req.params[param] === 'boolean')
                req.sql.params += `@${param}=${req.params[param] ? 1 : 0}, `
            else if (typeof req.params[param] === 'string')
                req.sql.params += `@${param}='${req.params[param]}', `
        }
    });

    /* Body Parameters */
    Object.getOwnPropertyNames(req.body).forEach(param => {
        if (param != 'Id') {
            if (!isNaN(req.body[param]))
                req.sql.params += `@${param}=${req.body[param]}, ` 
            else if (typeof req.body[param] === 'boolean')
                req.sql.params += `@${param}=${req.body[param] ? 1 : 0}, `
            else if (typeof req.body[param] === 'string')
                req.sql.params += `@${param}='${req.body[param]}', `;
        }
    });

    // Deletes ,
      if (req.sql.params.endsWith(', '))
          req.sql.params = req.sql.params.substring(0, req.sql.params.length - 2);  
}

const callDatabase = async (req: any, res: any) => {
    try {

        console.log('callDatabase:', `${req.sql.sp} ${req.sql.params}`);
      
        await sql.connect(cfg);
        let result = await sql.query(`${req.sql.sp} ${req.sql.params}`);

        if (req.method == 'GET' && result.recordset.length == 0) {
            result.status(404);
            result.sqlError = 'Could not find the resource.'
        }

        if (req.method == 'PUT' || req.method == 'DELETE') result.status(204);
        else if (req.method == 'POST') result.status(201);
        result.message =
               req.method == 'PUT' ? 'Updated successfully.' :
               req.method == 'DELETE' ? 'Deleted successfully.' : '';


        return result;  
    }
    catch (err) {
        res.sqlError =
                 req.method == 'GET' ? 'Could not find the resource.' : '';
                 req.method == 'PUT' ? 'Could not update the resource.' : '';
                 req.method == 'POST' ? 'Could not create the resource.' : '';
                 req.method == 'DELETE' ? 'Could not delete the resource.' : '';
        res.status(400);         
    }
};


const query = async (req: any, res: any) => {
    try {
        getParameters(req);

        const result = await callDatabase(req, res);

        
        if (res.sqlError) return res.send(res.sqlError);

        if (req.method == 'PUT' || req.method == 'DELETE'){
            return res.send(res.message);
        }
        else if (req.method === 'POST') {
            if (result.recordset === undefined)
            return res.send('Resource added');
            else
            return res.json(result.recordset[0]);
        }

        return res.json(req.hasId ? result.recordset[0] : result.recordset);


    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { query };