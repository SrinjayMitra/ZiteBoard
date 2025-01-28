
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// const { BACKEND_URL , NEXTAUTH_SECRET } = require("@repo/backend-common/config");
// import axios from "axios";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "email", type: "text", placeholder: "you@example.com" },
//         // name: { label: "Name", type: "text" },
//         password: { label: "password", type: "password" }
//       },
//       async authorize(credentials, req) {
//         try {
//           console.log("hi");  
//           const email = credentials?.email;
//           const password = credentials?.password;
//           console.log("email", email);
//           console.log("password", password);

//           // Use axios for the POST request
//           const response = await axios.post(`${BACKEND_URL}signin`, {
//             email,
//             password,
//           });

//           // Extract user data from the response
//           const user = response.data;
//           console.log("user", user.token);

//           if (user && user.id) {
//             return user; // Return the user object if login/signup is successful
//           } else {
//             return null; // Return null to indicate failure
//           }
//         } catch (error) {
//           console.error(error);
//           return null; // Handle errors by returning null
//         }
//       }
//     })
//   ],
// //   secret: NEXTAUTH_SECRET // Ensure to set this in your environment variables
// });

// export { handler as GET, handler as POST };


import NextAuth from "next-auth"
import  {authOptions}  from "../../../(lib)/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
