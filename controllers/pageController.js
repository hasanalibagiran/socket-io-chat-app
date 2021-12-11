
exports.getRegister = async (req, res) => {
  res.status(200).render("register");
};

exports.logout= (req,res)=>{
  req.session.destroy(()=>{
    res.status(200).redirect('/')
  })
  
}