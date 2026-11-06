import jwt from "jsonwebtoken";

const jwtverify = (req,res,next) => {
    try {
        let token = req.cookies.jwt || "";
        console.log(token);
        if (!token) {
            return res.status(401).json({
                message:"authentication failed",
                success:false
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;
        next();
        


        
    } catch (error) {
        console.log(error.message,"error in jwt verify");
        return res.status(400).json({
            message:"authentication failed",
            success:false
        })

    }

}
export default jwtverify;