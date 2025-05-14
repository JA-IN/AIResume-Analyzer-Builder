const { error } = require('console');
const multer = require('multer');
const path = require('path');

// multer storage setup
const storage = multer.diskStorage(
  {
    destination: function(req ,file , cb){
      cb(null , 'uploads'); //save uploaded resumes to this folder
    },
    filename: function(req,file,cb){
      const uniquesuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
      cb(null , uniquesuffix + path.extname(file.originalname)); //unique filename
    }
  }
);

// multer upload instance
const upload = multer(
  {
    storage: storage ,
    limits: {fileSize: 2 * 1024 * 1024},  //2 mb limit
    fileFilter: function(req , file , cb){
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if(allowedTypes.includes(file.mimetype)){
        cb(null , true);
      }
      else{
        cb(new Error('only .pdf , .doc , .docx formats allowed!'));
      }
    }
  }
);

module.exports = upload;