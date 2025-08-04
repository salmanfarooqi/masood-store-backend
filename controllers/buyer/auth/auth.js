
const db = require("../../../models")
const hashPassword = require("../../../utils/password")
const bcrypt=require('bcryptjs')
const generateToken = require("../../../utils/token");
const { where } = require("sequelize");

const buyerSignup = async (req, res) => {
   try {
     let { firstName, lastName, email, password } = req.body;
 
     // Check if the user already exists
     let isUserExist = await db.User.findOne({
       where: { email }
     });
 
     if (isUserExist) {
       // Send conflict response and return to stop further execution
       return res.status(409).send("User with this email already exists");
     }
 
     
     let hashedPassword = await hashPassword(password);
 
        console.log("haspassword",hashPassword, "password",password)
     await db.User.create({
       email,
       password: hashedPassword,
       first_name: firstName,
       last_name: lastName
     });
 
     // Send a success response
     return res.status(201).send("User account is successfully created");
   } catch (error) {
     
     console.error("Error during signup:", error.message);
     return res.status(500).send("An error occurred during signup");
   }
 };
 


const getUser=async(req,res)=>{
  try {

    const userId = req.user.id;
    console.log("uuu..",userId)
    let user=await db.User.findOne({
      where:{
        id:userId
      }
    })

    if(!user){
      return res.status(404).send("No user found ")
    }
    
    res.status(200).send(user)
  } catch (error) {
     throw error
  }
}

 const buyerLogin = async (req, res) => {
   try {
     const { email, password } = req.body;
 
     if (!email || !password) {
       return res.status(404).send("Email and password both are required");
     }
 
     const isUserExist = await db.User.findOne({
       where: { email },
     });
 
     if (!isUserExist) {
       return res.status(404).send("Invalid credentials");
     }
 
     let ismatch = await bcrypt.compare(password, isUserExist.password);
     if (!ismatch) {
       return res.status(404).send("Invalid credentials");
     }
 
     let payload = {
       id: isUserExist.id,
       email: isUserExist.email,
     };
 
     let token = await generateToken(payload, "123");
 
     return res.status(200).send({
       message: "User login successfully",
       token: token,
     });
 
   } catch (error) {
     return res.status(500).send({ message: "Internal Server Error", error: error.message });
   }
 };
 
module.exports={buyerSignup,buyerLogin,getUser}