const express = require('express');
const apiRouter = express.Router();
//Import variable instance of routers below
const employeesRouter = require('./employees.js');
const menusRouter = require('./menus');



//ALL routers using /api mounted below
apiRouter.use('/employees', employeesRouter);

apiRouter.use('/menus', menusRouter);




module.exports = apiRouter;