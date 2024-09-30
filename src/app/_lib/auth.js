import { hash, compare } from 'bcryptjs';

export const hashPassword = async (password) => {
   const hashedPassord =  await hash(password, 12);
   return hashedPassord;
}

export const verifyPassword = async (password, hashedPassword) => {
   const isValid = await compare(password, hashedPassword);
   return isValid;
}