const userService = require('../dbservices/dbservice');
const validator = require('validator');
const { users } = require('../config/dbConfig');

//SIGNUP
const signup = async (req, res) => {
    try {
      let data = req.body;
      const isEmail = validator.isEmail(data.email);
      if(data.username ==""||data.email=="") res.status(400).json({error: "Missing username or email"});
      else if(!isEmail) res.status(400).json({error: "Enter Valid Email"});
      else {
        const existingUser = await userService.isExistingUser(req.body);
        if(!existingUser){
          const user = await userService.signup(req.body);
          res.status(201).json(user);
        }
        else{
          res.status(400).json(existingUser);
        }}
        } catch (e) {
            res.status(500).json({message:"Failed to create user."});
            console.error(e);
        };
};

//LOGIN
const login = async (req,res) => {
    try{
        const validEmail = await userService.validEmail(req.body);
        if(!validEmail){
          const user = await userService.login(req.body);
          res.status(200).json(user);
        }else{
          res.status(400).json(validEmail)
        }
    }catch (e){
        res.status(500).json({message:"Login Failed"});
        console.error(e);
    }
}

//CHANGE PASSWORD
const changePassword = async (req,res) => {
  try{
    const validEmail = await userService.validEmail(req.body);
    if(!validEmail){
      const user = await userService.changePassword(req.body);
      res.status(200).json(user);
    }else{
      res.status(400).json(validEmail)
    }
}catch (e){
    res.status(500).json({message:"Password Change Failed"});
    console.error(e);
}
}

//GETTING USERS FROM DATABASE
const getUsers = async (req, res) => {
    try {
      const filters = req.body;
      const users = await userService.getUsers(req.query,filters);
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }  


module.exports = {signup,login,changePassword,getUsers};