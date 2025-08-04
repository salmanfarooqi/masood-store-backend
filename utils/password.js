const bcrypt=require('bcryptjs')

const hashPassword=async(password)=>{
    try {

        let hashedPassword=  await bcrypt.hash(password,10)
     return hashedPassword
        
    } catch (error) {
        throw new Error(error)
    }
}


module.exports=hashPassword