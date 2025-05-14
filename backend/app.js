require('dotenv').config();
const express = require('express');
const cors = require('cors');

const uploadRouter = require('./routes/upload_routes');
const resumeRouter = require('./routes/resume_routes');
//const resumeBuild = require('./routes/resume_build');
const autoGenerate = require('./routes/auto-summaru');
const app = express();
const port = process.env.PORT ;

// middle ware

app.use(cors());
app.use(express.json());

//app.use(express.static('public'));


app.use('/api/upload' , uploadRouter);

app.use('/api/resume' , resumeRouter);

app.use('/api/resumeForm', autoGenerate);

app.listen(port , ()=>{
  console.log(`server running on the http://localhost:${port}`);
  console.log("hello world");

});
