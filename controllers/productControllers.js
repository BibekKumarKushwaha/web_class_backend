const path=require('path')
const productModel = require('../models/productModel')
const CreateProduct = async (req,res) => {
    //check incoming data
    console.log(req.body)
    console.log(req.files)

    //destructiing the body data (json)
    const{productName,
        productPrice,
        productCategory,
        productDescription
    }    
        =req.body;
    //validation (task)
    if(!productName || !productPrice || !productCategory || !productDescription){
        return res.status(400).json({
            "success" : false,
            "message": "enter all fields"
        })
    }
    //validate if there is image '
    if(!req.files || !req.files.productImage){
        return res.status(400).json({
            "success": false,
            "message": "Image not foumd"
        })
    }
    const {productImage}=req.files;

    //upload image
    //1. generate new image name (abc.png) -> (213456-abc.png)
    const imageName= `${Date.now()}-${productImage.name}`;
    //2. make a upload path(/path/upload-directory)
    const imageUploadPath= path.join(__dirname,`../public/products/${imageName}`)
    //3. Move to that directory (await,try-catch)
    try{
        await productImage.mv(imageUploadPath)
        //save to database
        const newProduct = new productModel({
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            productImage : imageName
        })
        const product =await newProduct.save()
        res.status (201).json({
            "success": true,
            "message": "product create successfully",
            "data": productImage
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "internal server error",
            "error": error
        })

    }

    
};

//fetch all products
const getAllProducts = async (req,res)=> {
    //try catch
    try{
        const allProducts = await productModel.find({})
        res.status(201).json({
            "success": true,
            "message": "products fethched successfully",
            "products" : allProducts
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            "success" : false,
            "message" : "internal server error",
            "error" : error
        })

    }
    //fetch all products
    //send response

}
module.exports={
    CreateProduct,
    getAllProducts
};