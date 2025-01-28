"use client";  

import React, { useState } from "react";
import { cn } from "@repo/ui/lib";
import { Label } from "@repo/ui/ui";
import { motion } from "framer-motion";
import {  signIn } from "next-auth/react"; // Importing next-auth's signIn method
import { useRouter } from "next/navigation";
import { IconAlertTriangle, IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"; // Add icons
import { signin } from "../../(lib)/utils";
import axios from "axios";
import Credentials from "next-auth/providers/credentials";
const {BACKEND_URL} = require("@repo/backend-common/config");

// Custom Input with animated border effect
const CustomInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    //@ts-ignore
    <motion.input 
      {...props}
      className={cn(
        "bg-gray-800 text-white rounded-md h-10 p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out",
        className
      )}
      initial={{ borderColor: "rgba(255, 255, 255, 0.3)", borderWidth: "1px" }}
      whileHover={{
        borderColor: "rgba(0, 255, 255, 0.6)",
        borderWidth: "2px",
      }}
      whileFocus={{
        borderColor: "rgba(0, 255, 255, 1)",
        borderWidth: "4px",
      }}
      transition={{
        type: "tween",
        stiffness: 100,
        damping: 5,
      }}
    />
  );
};

const Signin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [responseMessage, setResponseMessage] = useState<string>(''); // State to store response message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      console.log("hi from signin");
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      // const response = await axios.post(`${BACKEND_URL}signin`,{
      //   email: email,
      //   password: password
      // })
      // Return structured data: user info and token
      console.log(`${response} from signin.tsx`);
      if (response?.ok && response.status == 200) {
        setResponseMessage("SignIn successful");
  
        // Redirect or update the UI accordingly after successful login
        // For example:
        router.push('/dashboard');  // Adjust this as per your app's flow
      } 
      else if (response?.error) {
        let status = response.status
        if (response.status === 401) {
          setResponseMessage("Incorrect email or password. Please try again.");
        } else if (status === 404) {
          setResponseMessage("User not found. Please try again.");
       } 
      //  else {
        //   setResponseMessage(response.error);  // Display server-provided message
        // }
      } else {
        // This block handles network or other types of errors without response
        setResponseMessage("Network error. Please try again.");
      }

    } catch (error: any) {
      console.error("Error during signin:", error);  // Log the error object
    
      // Check if error has a response property (i.e., server-side error response)
      // if (error?.response) {
      //   const { status } = error.response;
      //   const message = error.response.data?.message || "Authentication failed.";
    
      //   if (status === 403) {
      //     setResponseMessage("Incorrect email or password. Please try again.");
      //   } else if (status === 404) {
      //     setResponseMessage("User not found. Please try again.");
      //   } else {
      //     setResponseMessage(message);  // Display server-provided message
      //   }
      // } else {
      //   // This block handles network or other types of errors without response
      //   setResponseMessage("Network error. Please try again.");
      // }
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-lg w-full mx-auto rounded-lg md:rounded-2xl p-8 shadow-2xl bg-gray-900 space-y-6">
        <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 className="font-extrabold text-4xl text-white">Welcome Back to Ziteboard</h2>
        </motion.div>
        <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-neutral-400 text-sm max-w-sm mt-2">
            Sign in to continue collaborating on your creative projects with your team.
          </p>
        </motion.div>
        <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <p className="font-bold text-xl text-white">Sign In</p>
        </motion.div>

        {responseMessage && (
            // <p className="text-center text-white mt-4">{responseMessage}</p> 
            <div className="bg-red-200 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600" >
              <IconAlertTriangle/>
              <p>{responseMessage}</p>
            </div>
          )}

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <CustomInput
              id="email"
              placeholder="johndoe@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="password" className="text-white">Password</Label>
            <CustomInput
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </LabelInputContainer>

          <button
            className="relative group/btn bg-gradient-to-br from-cyan-500 to-indigo-500 text-white rounded-md h-12 font-medium shadow-lg w-full transform transition-all duration-300 ease-in-out hover:scale-105"
            type="submit"
          >
            Sign in &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-white rounded-md h-10 font-medium shadow-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out"
              type="button"
              onClick={() => signIn("github")}
            >
              <IconBrandGithub className="h-4 w-4 text-white" />
              <span className="text-white text-sm">Sign in with GitHub</span>
              <BottomGradient />
            </button>
            
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-white rounded-md h-10 font-medium shadow-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out"
              type="button"
              onClick={async () => {
                  await signIn("google");
                  router.push("/dashboard"); // Redirect after sign-in
                }
              }
            >
              <IconBrandGoogle className="h-4 w-4 text-white" />
              <span className="text-white text-sm">Sign in with Google</span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Signin;
