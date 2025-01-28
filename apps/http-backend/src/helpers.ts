import bcrypt from "bcrypt";
const { SALT_ROUNDS } = require('@repo/backend-common/config');
export async function verifyPassword(userPassword: string, storedHashedPassword: string) {
    try {
      const isMatch = await bcrypt.compare(userPassword, storedHashedPassword);
      return isMatch;
    } catch (error) {
      console.error("Error verifying password:", error);
      return false;
    }
}


export async function hashPassword(userPassword: string) {
    try {
      const pass = await bcrypt.hash(userPassword, SALT_ROUNDS);
      return pass;
    } catch (error) {
      console.error("Error hashing password:", error);
      return "";
    }
}

