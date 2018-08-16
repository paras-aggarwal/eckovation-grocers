var express=require('express');
var router=express.Router(); 
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'public/' })
var d=require('../app');


var Item=require('../models/item');
  //AddItem
router.get('/additem',function(req,res){

	res.render('additem.ejs');
});




router.post('/upload',upload.any(),function(req,res,next){
  console.log("upload");
  res.send(req.files);
})

//Register User
router.post('/additem',upload.any(),function(req,res,next){
	console.log("wdsd");
    console.log(req.body.itemname);
	req.body.photo=req.files[0].filename;
	
	/*
		var newItem=new Item({
			name:name,
			price:price,
			description:description,
			quality:quality,
			stock:stock,
		  });
	 
	    Item.createItem(newItem,function(err, item){
           if(err) throw err;
           console.log(item);

	    });
	  
	  */
	  d.db.collection('items').save(req.body,req.files[0].path,function(err,result)
  {
    if(err)
      return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
	
});


module.exports= router;

