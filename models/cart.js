var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');

var User=require('../models/user');
var Item=require('../models/item');

//User Schema
  var CartSchema=mongoose.Schema({
    cartuserid: {
           type: String
    },
    price: {
      type: Number
    },
    noofitem:{
     type : Number
    },
    products :[{
      itemquantity: Number,
      itemid : {
        type :mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      }
    }]

  });


  var Cart=module.exports = mongoose.model('Cart',CartSchema);

module.exports.createCart=function(newCart,callback){
  newCart.save(callback);
  }

