var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');




//User Schema
  var ItemSchema=mongoose.Schema({
    name: {
          type: String,
          index:true
    },
    price: {
      type: Number
    },
    stock: {
      type: Number
    },
    description:{
     type : String
    },
    quality: {
      type: String
    }

  });
var Item=module.exports = mongoose.model('Item',ItemSchema);

module.exports.createItem=function(newItem,callback){
   newItem.save(callback);
    };
    

