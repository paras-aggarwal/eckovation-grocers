const express= require('express')
const app=express()
var bodyParser= require('body-parser')
var cookieParser = require('cookie-parser') 
// var exphbs = require('express-handlebars')
var expressValidator = require('express-validator')
var session=require('express-session')
var passport=require('passport')
var LocalStrategy=require('passport-local').Strategy
var bcrypt=require('bcrypt')
var ejs=require('ejs')
var flash=require('flash')
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('AuthKey');
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));
app.set('port', 8080);
app.listen(app.get('port'));
var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');


  mongoose.connect('mongodb://tushar8:bitspilani@ds251849.mlab.com:51849/grocersusers',function(err,database)
  {
    if(err)
      return console.log(err);
         return console.log("connected to mongo");
  });
db1=mongoose.connection;
module.exports.db= db1;

//routes

//var routes=require('./routes/index');
var users=require('./routes/users');
var item=require('./routes/item');
var cart=require('./routes/cart');
var gateway=require('./routes/gateway');

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

//app.use('/',routes);
app.use('/users',users);
app.use('/item',item);
app.use('/cart',cart);

app.use('/gateway',gateway);

app.get('/',function(req,res){
	var cursor = db1.collection('items').find().toArray(function(err1,result1){
     if(err1)
      return console.log(err1)
      res.render('index.ejs',{item: result1})
        }

)
});
module.exports = app;
