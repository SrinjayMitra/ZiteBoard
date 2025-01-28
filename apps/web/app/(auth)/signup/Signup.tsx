"use client";
import React from "react";
import { cn } from "@repo/ui/lib";
import { Label } from "@repo/ui/ui";
import { motion } from "framer-motion";
import { IconBrandGithub, IconBrandGoogle, IconBrandOnlyfans } from "@tabler/icons-react";

const formVariants = {
  hidden: { opacity: 0, y: 200 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
};

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
        borderWidth: "2px",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    />
  );
};

const Signup: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div
        className="max-w-lg w-full mx-auto rounded-lg md:rounded-2xl p-8 shadow-2xl bg-gray-900 space-y-6"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 className="font-extrabold text-4xl text-white">Welcome to Ziteboard</h2>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <p className="text-neutral-400 text-sm max-w-sm mt-2">
            Unlock your creative potential and collaborate like never before! Join Ziteboard for real-time brainstorming, freehand drawing, and creating amazing ideas with your team.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
          <p className="font-bold text-xl text-white">SignUp Today</p>
        </motion.div>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname" className="text-white">
                First name
              </Label>
              <CustomInput id="firstname" placeholder="John" type="text" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname" className="text-white">
                Last name
              </Label>
              <CustomInput id="lastname" placeholder="Doe" type="text" />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <CustomInput id="email" placeholder="johndoe@example.com" type="email" />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <CustomInput id="password" placeholder="••••••••" type="password" />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="confirmPassword" className="text-white">
              Confirm Password
            </Label>
            <CustomInput id="confirmPassword" placeholder="••••••••" type="password" />
          </LabelInputContainer>

          <button
            className="relative group/btn bg-gradient-to-br from-cyan-500 to-indigo-500 text-white rounded-md h-12 font-medium shadow-lg w-full transform transition-all duration-300 ease-in-out hover:scale-105"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-white rounded-md h-10 font-medium shadow-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out"
              type="button"
            >
              <IconBrandGithub className="h-4 w-4 text-white" />
              <span className="text-white text-sm">Sign up with GitHub</span>
              <BottomGradient />
            </button>
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-white rounded-md h-10 font-medium shadow-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out"
              type="button"
            >
              <IconBrandGoogle className="h-4 w-4 text-white" />
              <span className="text-white text-sm">Sign up with Google</span>
              <BottomGradient />
            </button>
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-white rounded-md h-10 font-medium shadow-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 ease-in-out"
              type="button"
            >
              <IconBrandOnlyfans className="h-4 w-4 text-white" />
              <span className="text-white text-sm">Sign up with OnlyFans</span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
);

export default Signup;
