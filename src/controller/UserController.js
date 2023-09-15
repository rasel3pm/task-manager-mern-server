const UserModel = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.register = async (req, res) => {
  try {
    let reqBody = req.body;
    let existAccount = await UserModel.findOne({ email: reqBody.email });
    if (existAccount) {
      return res.status(200).json({ status: "Already have an account" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(reqBody.password, salt);
    req.body.password = hash;
    // Replace the original password with the hashed password
    reqBody.password = hash;
    // Create the user with the hashed password
    let data = await UserModel.create(reqBody);
    res
      .status(200)
      .json({ message: "Account created successfully", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email: email });
    if (user && user.length > 0) {
      const validPassword = await bcrypt.compare(password, user[0].password);
      if (validPassword) {
        const token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Login Success", token: token,user:user });
      } else {
        res.status(401).json({ message: "wrong email or password" });
      }
    } else {
      res.status(401).json({ message: "wrong email or password" });
    }
  } catch (err) {
    res.status(401).json({ message: "wrong email or password" });
  }
};

exports.ProfileUpdate= async(req,res)=>{
  try {
    let email = req.headers['email']
    let reqBody = req.body 
    let updatedData= await UserModel.updateOne({email:email},{$set:reqBody} ,{upsert:true})
      if(updatedData){
        res.status(200).json({status:"Save Changes"})
      }else{
        res.status(200).json({status:"fail",})
      }
  } catch (error) {
    res.status(200).json({status:"fail",message:"Something went wrong"})
  }
}

exports.GetProfile=async(req,res)=>{
  let data = await UserModel.find()
  res.json(data)
}