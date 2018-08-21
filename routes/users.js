var express=require('express');
var router=express.Router(); 
var passport =require('passport');
var request = require('request');

var LocalStrategy = require('passport-local').Strategy;
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('AuthKey');
var User=require('../models/user');
var Cart=require('../models/cart');

//Register
router.get('/register',function(req,res){

	res.render('registerscreen.ejs',{detail: {phone:req.query.phone}});
});

//Login
router.get('/login',function(req,res){
	req.flash('success', 'You Must Login First');
   res.render('loginscreen.ejs');
});

router.get('/phone',function(req,res){
   res.render('phone.ejs');
});

	


router.post('/phone',function(req,res){

var phone=req.body.phone;
request('https://2factor.in/API/V1/5c6cd9bf-45ea-11e8-a895-0200cd936042/SMS/+91'+phone+'/AUTOGEN',function(error,response,body){
	  	if(!error){
          var json=JSON.parse(body);
	  	   console.log(json.Details);
	  	    detail=json.Details;
	  	res.redirect('/users/otpver?det=' + json.Details+'&phone=' + phone);
	  
	  	}
	  else
	  {
	  	res.redirect('/phone');
	  }
	  });
});



router.post('/ver',function(req,res){
	    var f=0;
	request('https://2factor.in/API/V1/5c6cd9bf-45ea-11e8-a895-0200cd936042/SMS/VERIFY/'+req.body.detail+'/'+req.body.otp,function(error,response,body){
	  	if(!error){
          console.log(body);
	      var json=JSON.parse(body);
	  	    if(json.Status=="Success")
	  	    {
                 f=1;
	  	    }
	  	}
	    if(f==1)
	    {
	    	res.redirect('/users/register?phone=' + req.body.phone);
	    }
	    else
	    {
	    	res.redirect('/users/otpver?det=' + req.body.detail+'&phone=' + req.body.phone+'&otp=wrong otp');
	    }
	  })
      
});
router.get('/otpver',function(req,res){
	req.flash('success', 'You Must Login First');
   console.log("oe"+req.query.det +req.query.phone+req.query.otp);
   res.render('otpver.ejs',{detail: {det:req.query.det}, phone: {phone:req.query.phone}, otp: {otp:req.query.otp}});
});


//Register User
router.post('/register',function(req,res){
	
	  
    
	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var password2=req.body.password2;
	var phone=req.body.phone;
	var houseno = req.body.houseno;
	var locality = req.body.locality;
	var city = req.body.city;
	var state=req.body.state;
	
	//validation
	req.checkBody('name','Name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('username','UserName is required').notEmpty();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);
	req.checkBody('phone','Contact No is required').notEmpty();
	req.checkBody('houseno','House No is required').notEmpty();
	req.checkBody('locality','Locality is required').notEmpty();
	req.checkBody('city','City is required').notEmpty();
	req.checkBody('state','State is required').notEmpty();
	
	var errors=req.validationErrors();
	
	if(errors)
	{
		res.render('registerscreen.ejs',{errors:errors
		});
	}
	else
	{
		
            var price=0;
      
	var noofitem=0;
	       
		var newCart=new Cart({
			price:price,
			noofitem:noofitem,
		});
	 
	    Cart.createCart(newCart,function(err, cart){
           if(err) throw err;
            
             var cartid=cart._id;
              console.log(cartid);
            console.log(cart);
	        
           
	         var newUser=new User({
			name:name,
			email:email,
			username:username,
			password:password,
			cartid:cartid,
			phone:phone,
		    
            address: {
            houseno:houseno,
		    locality:locality,
		    city:city,
		    state:state
		    }

		});
	    
	    User.createUser(newUser,function(err, user){
           if(err) throw err;
           console.log(user);
        });

	    });
	

	  
       res.redirect('/users/login')
	}
});

passport.use(new LocalStrategy(
     function(username, password, done)
     {
       User.getUserByUsername(username,function(err,user)
       {
         if (err)
         	throw err;
         if(!user){
         	return done(null, false, {message: 'Unknown User'});
              }
         User.comparePassword(password,user.password,function(err, isMatch){
             if(err) throw err;
             if(isMatch){
             	return done(null,user);
         }
         else{
         	return done(null,false,{message: 'Invalid password'});
         }
         });
       });
     }));

passport.serializeUser(function(user, done){
 done(null,user.id);
});

passport.deserializeUser(function(id, done){
  	User.getUserById(id, function(err,user){
       done(err, user);
  	});
});




router.post('/login',
	passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login' ,failureFlash: true}),
     function(req,res){
        res,redirect('/');
     });

router.get('/logout',function(req,res){
	req.logout();
	req.flash('success_msg','You are logged out');
	res.redirect('/');
})

module.exports= router;

