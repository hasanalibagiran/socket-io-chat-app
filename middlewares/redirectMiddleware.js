module.exports = (req,res,next) =>{
    if(!userIN) {
        next()
    }else {
        return res.redirect('/private')
    }
    
}