const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
 
const createUser = async (req, res) => {
    // res.send("Create user API is working!")
 
    //1.Check incoming data
    console.log(req.body);
 
    //2.Destructure the incoming data
    const { firstName, lastName, email, password } = req.body;
 
    //3.Validate the data
    if (!firstName || !lastName || !email || !password) {
        // res.send("Please enter all fields!")
        res.json({
            "success": false,
            "message": "Please enter all fields!"
        })
    }
    //4.Error Handling(try catch)
    try {
        //5.Check if the user is already registered
        const existingUser = await userModel.findOne({ email: email })
        //5.1 If user found: send response
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "User already exists!"
            })
        }
 
        // Hashing / encryption of the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, randomSalt)
 
        //5.2 If user is new:
 
        const newUser = new userModel({
            //Field : Client's Value
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        })
 
        //Save to database
        await newUser.save()
 
        //send the response
        res.json({
            "success": true,
            "message": "User Created Successfully!"
        })
    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message": "Internal server Error!"
        })
    }
 
}
 
//login function
const loginUser = async (req,res) => {
    // res.send("Login API is working!")
 
    //Check incoming data
    console.log(req.body)
   
    //Destructuring
    const {email, password } = req.body;
 
    //Validation
    if(!email || !password){
        return res.json({
            "success": false,
            "message": "Please enter all fields!"
        })
    }
 
 
    //try catch
    try{
 
        //find user (email)
        const user = await userModel.findOne({email : email})
        //found data: firstName, lastName, email, password
 
        //not found(error message)
        if(!user){
            return res.json({
                "success": false,
                "message": "User does not exist!"
            })
        }
 
        //compare password(bcrypt)
        const isValidPassword = await bcrypt.compare(password,user.password)
 
        //not valid(error)
        if(!isValidPassword){
            return res.json({
                "success": false,
                "message": "Password not matched!"
            })
        }
        //token(Generate - user Data+KEY)  
        const token = await jwt.sign(
            {id : user._id},
            process.env.JWT_SECRET
        )    
        //response (token, user data)
        res.json({
            "success": true,
            "message": "User logged in successfully!",
            "token": token,
            "userData": user
        })
 
 
    } catch (error){
        console.log(error)
        return res.json({
            "success": false,
            "message":"Please enter all fields!"
        })
    }
}
 
//Check incoming data
//Validate the password
//Find the user
//If found check password and send response
//If not found : register
 
 
//change password
 
// Exporting
module.exports = {
    createUser,
    loginUser
}