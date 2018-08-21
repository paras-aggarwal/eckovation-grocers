const express= require('express')
const app=express()
var bodyParser= require('body-parser')
var cookieParser = require('cookie-parser') 
var expressValidator = require('express-validator')
var session=require('express-session')
var passport=require('passport')
var LocalStrategy=require('passport-local').Strategy
var ejs=require('ejs')
var flash=require('flash')
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('AuthKey');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));
var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');


  mongoose.connect('mongodb://paras:paras@ds211029.mlab.com:11029/paras_db',function(err,database){
    if(err)
      return console.log(err);
         return console.log("Connected to MLAB Cloud Database...");
  });
db1=mongoose.connection;
module.exports.db= db1;

//routes
var users=require('./routes/users');
var item=require('./routes/item');
var cart=require('./routes/cart');
app.use(function(req,res,next){
  res.locals.user = req.user || null;
  next();  
});

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validotors
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
    var namespace= param.split('.')
    , root=namespace.shift()
    , formParam=root;
   
   while(namespace.length) {
    formParam+= '['+namespace.shift() + ']';
   }
   return{
    param : formParam,
    msg : msg,
    value : value
   };
  }
}));

//Connect flash
app.use(flash());

// Global vars
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg= req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();  
});


app.get('/gateway',function(req,res){
 res.render('gateway.ejs');
});
app.use('/users',users);
app.use('/item',item);
app.use('/cart',cart);

app.get('/',function(req,res){
	var cursor = db1.collection('items').find().toArray(function(err1,result1){
     if(err1)
      return console.log(err1)
      res.render('index.ejs',{item: result1})
        }

)
});

app.listen(3000 || process.env.PORT, function() {
  console.log('Server started!');
});
module.exports = app;
