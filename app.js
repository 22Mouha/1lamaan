//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const path = require('path');
const fs= require('fs');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/lamaanDB");

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });


const userSchema = new mongoose.Schema ({
  name: String,
  email: String,
  tel:String,
  password: String
});
const User= new mongoose.model('User',userSchema);

const pubSchema = new mongoose.Schema({
  objet: String,
  lieu:String,
  type: String,
  surface:String,
  username:String,
  name: String,
    img: {
        data: Buffer,
        contentType: String
    }
});
const Pub = new mongoose.model('Pub',pubSchema);

app.get('/',function(req,res){
  res.render('home');
});

app.get('/contacts', function(req,res){
  res.render('contacts');
});

app.get('/publications', function(req,res){
  res.render('publications');
});

app.get('/ventes', function(req,res){
  res.render('ventes');
});


app.get('/services', function(req,res){
  res.render('services');
});

app.get("/location", function(req,res){
  res.render('location');
});

app.get("/pubform", function(req,res){
  res.render('pubform');
});

app.get("/inscription", function(req, res){
  res.render('inscription')
});
app.get("/identification", function(req, res){
  res.render('identification')
});


// app.get("/publications/:pubId", function(req, res){
//   const requestedId = req.params.postId;
//   Post.findOne({_id:requestedId}).then(function(post){
//     res.render("post", {
//       title: post.title,
//       content: post.content
//     });
//
//   }).catch(function(err){
//     console.log(err);
//   });
//
// });

app.post("/identification", function(req,res){
  const tel=  req.body.usertel;
  const password= req.body.password;

});



app.post("/inscription",function(req,res){
  const name = req.body.username;
  const email = req.body.useremail;
  const tel = req.body.usertel;
  const password = req.body.password

  const user ={
    name: name,
    email: email,
    tel: tel,
    password: password
  }
  User.insertMany(user).then(function(err){
    console.log(user);
    user.save()
  }).catch(function(err) {
    console.log(err);
  });
  res.redirect("/");
});

app.post('/pubform', upload.array('file', 12),function(req,res,next){
  if (!req.file) {
        return res.status(400).send('Aucun fichier téléchargé.');
    }
  const username = req.body.username;
  const choixObjet= req.body.choixObjet;
  const choixType= req.body.choixType;
  const lieu= req.body.lieu;
  const surface = req.body.surface;
  const imgPath = req.file.path;

  const pub =new Pub({
    objet: choixObjet,
    lieu:lieu,
    type: choixType,
    surface:surface,
    username:name,
    name: req.file.filename,
    img: {
        data: fs.readFileSync(imgPath),
        contentType: req.file.mimetype
      }
    });

    pub.save(function(err, image){
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ success: true, image: image });
    });
      res.redirect("/");
});









app.listen(3000, function() {
  console.log("Server started on port 3000");
});
