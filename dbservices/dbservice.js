require('dotenv').config();
const bcrypt = require('bcryptjs');
const  jwt = require('jsonwebtoken');
const database = require('../config/dbConfig');
const validator = require('validator');
const { Op } = require('sequelize');
const {startOfDay,endOfDay} = require('date-fns');
const User = database.users;

//SIGNUP
const signup = async (data) =>{
    try{
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
      const hashedPw = await bcrypt.hash(data.password,saltRounds);
      const user_details = await User.create({ username: data.username,email: data.email ,password:data.password, hashedPassword:hashedPw});
      return user_details;
    }catch (e){
      return e;
    }
};

//EXISTING USER CHECK
const isExistingUser=async (data)=>{
  try{
    // if(data.username ==""||data.email=="") return {error: "Missing username or email"};
    // const isEmail = validator.isEmail(data.email);
    // if(!isEmail) return {message:'Enter Valid Email'}
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          {username: data.username },
          {email: data.email }
        ]
      }
    });
    return  existingUser ? {message:"User already registered"} : false ;
  } catch (error) {
    return error;
  }
};

//VALID EMAIL CHECK FOR LOGIN
const validEmail = async (data) =>{
    try{
      const isEmail = validator.isEmail(data.usernameOrEmail);
      const user = await User.findOne({where: isEmail ? { email: data.usernameOrEmail } : { username: data.usernameOrEmail }});
      if (!user) {
          return {message:"User not found"};  
      }
      const isValidPassword = await bcrypt.compare(data.password, user.hashedPassword);
      if (!isValidPassword) {
          return {message:"Invalid Password"};
      } 
    }catch (error) {
      return error;
    }
}

//LOGIN
const login = async (data) => {
    try{
      const token = jwt.sign({ userId: data.usernameOrEmail.id },process.env.JWT_SECRET, { expiresIn: '1h' });
      return {message:"Logged In", token:token};
    }catch  (error){
      return error;
    }
};

//CHANGE PASSWORD
const changePassword = async (data) => {
    try{
      const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
      const hashedNewPassword = await bcrypt.hash(data.newPassword, saltRounds);
      await User.update({ password: data.newPassword, hashedPassword: hashedNewPassword },{where: { email: data.usernameOrEmail, username: data.usernameOrEmail  }});
      return { message: 'Password updated successfully' };
    }catch  (error) {
        return error;
    }
}


//GETTING USERS - PAGINATION, SEARCH, SORT AND FILTER with all fields
const getUsers = async (data,filters) => {
  try {
    let { page, pageSize, sortBy, sortOrder, searchTerm } = data;
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 50;
    const offset = (page - 1) * pageSize;
    let options = {
      offset,
      limit: pageSize,
      order: sortBy ? [[sortBy, sortOrder]] : [],
      where: {}
    };

    // Add search term condition
    if (searchTerm) {
      options.where[Op.or] = [
        { username: { [Op.like]: `%${searchTerm}%` } },
        { email: { [Op.like]: `%${searchTerm}%` } }
      ];
    }

    // Add filter conditions
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        options.where[key] = { [Op.like]: `%${filters[key]}%` };
      }
    }

    // Add date filtering if createdAt filter exists
    if (filters && filters.createdAt) {
      const specifiedDate = new Date(filters.createdAt);
      if (!isNaN(specifiedDate.getTime())) { // Check if it's a valid date
        const startOfSpecifiedDate = startOfDay(specifiedDate);
        const endOfSpecifiedDate = endOfDay(specifiedDate); 

        options.where.createdAt = {
          [Op.between]: [startOfSpecifiedDate, endOfSpecifiedDate] 
        };
      }
    }

    const users = await User.findAndCountAll(options);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};



module.exports = {signup,isExistingUser,validEmail,login,changePassword,getUsers} ;