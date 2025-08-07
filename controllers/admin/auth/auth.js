const { where } = require('sequelize')
const db=require('../../../models')
const generateToken = require('../../../utils/token')

const adminLogin=async(req,res)=>{
    try {
        const {email,password}=req.body

        console.log("Admin login server is called", email, password)
        
        // Check if User model is available
        if (!db.User) {
            console.error("User model not available");
            return res.status(500).json({
                success: false,
                message: "Database model not available"
            });
        }

        console.log("Total users:", await db.User.findAll())

        let isUserExist=await db.User.findOne({
            where:{
                email
            }
        })
        
        if(!isUserExist){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        if(password != isUserExist.password){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        let payload={
            id:isUserExist.id,
            email:isUserExist.email,
        }
   
        token = await generateToken(payload,"123")
        console.log("Generated token:", token)

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            token: token,
            user: {
                id: isUserExist.id,
                email: isUserExist.email
            }
        });
    } catch (error) {
        console.log("Admin login error:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

module.exports={adminLogin}