const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { route } = require('./route/teacherRoute');
const { studentRoute } = require('./route/studentRoute');
const PORT = 5000;
const app = express();
require('./database/database');

app.use(express.json());
app.use('/', route);
app.use('/', studentRoute)
app.listen(process.env.PORT, () => {
    console.log('app listening on PORT ' + process.env.PORT);
    
});