const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const route = require('./routes/routes')();
app.use('/api', route);

app.server = app.listen(port, () => {
    console.log(`Running on port ${port}`);
});

module.exports = app;