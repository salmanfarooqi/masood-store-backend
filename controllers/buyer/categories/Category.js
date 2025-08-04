const db = require("../../../models")
    const getAllParentCategroyByBuyer=async(req,res)=>{
        try {
            
            category=await db.parentCategory.findAll()
            console.log("Category",category)
            if(category){
            return res.json(category)
                
            }
            return null
        } catch (error) {
            console.log("er",error)
            throw error
            
        }
    }


const getAllChildCategroyByBuyer=async(req,res)=>{
    try {
        
        category=await db.childCategory.findAll()
        console.log("Category",category)
        if(category){
           return res.json(category)
            
        }
        return null
    } catch (error) {
        console.log("er",error)
        throw error
        
    }
}
module.exports={getAllChildCategroyByBuyer,getAllParentCategroyByBuyer}