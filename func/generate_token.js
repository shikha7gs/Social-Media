"use server";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

export const generateToken = async() => {
  const id = uuidv4(); 
  const payload = { id };
  const options = { expiresIn: '1m' };
  const token =  jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
  return { token, id };
};

export const validateJWT = async(token,id) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      decoded.id=id
      console.log(decoded.id , id)
      return { valid: true, decoded };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  };