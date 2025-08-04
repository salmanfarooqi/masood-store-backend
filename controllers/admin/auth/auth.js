const { where } = require('sequelize')
const db=require('../../../models')
const generateToken = require('../../../utils/token')

const adminLogin=async(req,res)=>{
    try {

        const {email,password}=req.body

        console.log("Total",await db.User.findAll())

           console.log("amdin login server is called", email ,password)
        let isUserExist=await db.User.findOne({
            where:{
                email
            }
        })
       if(!isUserExist){
        return res.status(400).send("invalid Credential")
       }

        
        if( password!=isUserExist.password){
          return res.send("invalid Credential")
        }

        let payload={
            id:isUserExist.id,
            email:isUserExist.email,

        }
   
        token= await generateToken(payload,"123")
        console.log("token",token)

        res.status(200).send({
            message:"user Login sucessfully",
            token:token
        });
    } catch (error) {
        console.log("error",error)
        throw new Error(error)
        
    }
}

module.exports={adminLogin}