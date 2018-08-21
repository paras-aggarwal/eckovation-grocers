var express=require('express');
var router=express.Router();
var request = require('request');
var d=require('../app');
var User=require('../models/user');
var Item=require('../models/item');
var Cart=require('../models/cart');
var async = require('async');
var app=require('../app');
  //AddItem

/*
router.get('/additem',function(req,res){

	res.render('additem.ejs');
});
*/
router.post('/additem/',function(req,res){
	console.log('user is '+req.body.user);
	var num = req.body.quantity;
	var id = req.body.user;
	var price = req.body.price;
	
	Item.findOne({name:req.body.item},function(err,doc){
		if(err)
			throw err;
		else
        {
		// console.log(doc._id);
       var it={itemquantity:num, itemid:doc._id};
       Cart.findByIdAndUpdate(id, {$push: {products: it}, $inc: {
		noofitem: num,
		price:num*price
	 }
	},function(err,doc){
	 	if (err) {console.log(err);}
	 	else{
	 		console.log('id: '+doc._id+' no: '+doc.noofitem+' price: '+doc.price+' item: ');
	 	}});
      }
	});

	
	
		res.redirect('/');
});

router.post('/addcart',function(req,res){
	

	var price=0;
	var noofitem=0;
	
		var newCart=new Cart({
			price:price,
			noofitem:noofitem
		});
	 
	    Cart.createCart(newCart,function(err, cart){
           if(err) throw err;
           console.log(cart);

	    });
	  
	  
});


router.post('/showcart',function(req,res){
	var id = req.body.user;
	console.log(id);
	Cart.findOne({_id:id}).populate('products.itemid').exec(function(err,doc){
		if (err) {console.log(err);}
		res.render('cart',{cart:doc});
		console.log('cart id: '+doc._id);
	});
	
});


router.post('/checkout',function(req,res){
	var id = req.body.cartid;
	console.log("checkout id= "+id);
	
     Cart.findByIdAndUpdate(id, { $set: { products: [] }, 
		noofitem: 0,
		price:0 }
		,function(err,doc){
	 	if (err) {
	 		console.log(err);
	 	}
	 	else{
	 		console.log('id: '+doc._id+' no: '+doc.noofitem+' price: '+doc.price+' item: ');
	 	}
	 }
);


  res.redirect('/cart/showcart');
});
	




module.exports= router;

