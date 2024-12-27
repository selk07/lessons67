const express = require('express');
const cors= require ('cors');
const dotenv= require ('dotenv');
require("dotenv").config();
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 8080;
dotenv.config();

app.use(cors());
app.use(bodyParser.json())

app.set('view engine', 'pug');


require('./routes/')(app);

app.listen(port, () => {
   console.log(`Server listening on port ${port}`);
});