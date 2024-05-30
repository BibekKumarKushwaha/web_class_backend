const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    productName : {
        type: String,
        require : true
    },
    productPrice : {
        type : Number ,
        require : true
    },
    productCategory: {
        type : String,
        require : true,
        unique : true,
        
    },
    productDescription : {
        type : String,
        require : true,
        maxLength: 500
    },
    productIamge: {
        type: String,
        require: true
    },
    createdAt :{
        type: Date,
        default: Date.now()
    }
})

const Product = mongoose.model('products',productSchema)
module.exports = Product;