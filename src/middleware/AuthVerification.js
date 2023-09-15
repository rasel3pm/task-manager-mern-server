const jwt = require("jsonwebtoken")
module.exports=(req,res,next)=>{
    try {
        let token = req.headers['token']
        let decoded = jwt.verify(token,process.env.JWT_SECRET)
        let email = decoded['email']
        console.log(email)
        req.headers.email=email
        next()
    } catch (error) {
        next("Unauthorized")
    }

}