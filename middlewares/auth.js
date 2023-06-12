const jwt=require('jsonwebtoken');

module.exports={
    ensureAuthentication: function (req,res,next) {
        const token=req.cookies.jwt;
        if(token) {
            jwt.verify(token,`${process.env.jwtSecret}`,(err,decodedToken)=> {
                if(err) {
                    console.log(err);
                    res.status(400).json({msg:"Access Denied"});
                }
                else  {
                    console.log(decodedToken);
                    next();
                }
            })
        }
        else {
            res.status(400).json({msg:"Access Denied"});
        }
    }
};