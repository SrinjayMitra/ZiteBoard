import type { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; 
import axios from "axios"; // Make sure axios is imported
import { signin } from "./utils";
const { BACKEND_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET } = require("@repo/backend-common/config");

export const authOptions: NextAuthOptions = {
    pages:{
       signIn:"/signin"
    },
    session:{
      strategy: "jwt"
    },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email;
          const password = credentials?.password;
      
          // Debugging the request
          console.log("email", email);
          console.log("password", password);
      
          // Use the signin function to send login request
          const response = await signin(email as string, password as string);
          console.log("Signin response:", response);
      
          // Check if the response contains the required user data and token
          if (response?.user && response?.token) {
            return {
              id: response.user.id,        // Use actual properties from the API response
              name: response.user.name,
              email: response.user.email,
              token: response.token,       // Add the token here if needed for session management
            };
          }
      
          // Return null if response is invalid or lacks the required data
          return null;
        } catch (error:any) {
          console.error("Error during authorization:", error);

          return null; // Return null in case of an error
        }
      }
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID ,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || GOOGLE_CLIENT_SECRET
      })
  ],
  callbacks:{
    async jwt({token,user}){
      if(user){
        //@ts-ignore
        token.id = user.token;
        token.email = user.email
      }
      return token;
    },
    //@ts-ignore
    async session({session,token}){
      if (token){
        session.user = {
          email:token.email,
          name:token.name
        }

      }
    }
  },
  secret: NEXTAUTH_SECRET, // Ensure this is set properly in your environment variables
};
