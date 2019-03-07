const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const express = require('express');
const morgan = require('morgan')


const apiRouter = require('./api/api');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));


//ROUTERS BELOW HERE, ABOVE ERRORHANDLER
app.use('/api', apiRouter);

app.use(errorHandler());

app.listen(PORT, () => {
  console.log(`Sever is now listening on port: ${PORT}`)
});

module.exports = app; 