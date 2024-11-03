const requireKey = (req,res,key) =>{
    if(!req.body[key]){
        return res.status(401).send({
            message : key + " is required"
        })
    }
   
}

module.exports = requireKey