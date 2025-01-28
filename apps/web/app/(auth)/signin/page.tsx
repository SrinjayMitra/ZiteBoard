
import React from "react";
import Signup2 from "./signin";
import { useSession,SessionProvider } from "next-auth/react";
import Signin from "./signin";

const Page: React.FC = () => {
  return (
    <div className="h-screen w-full  bg-gray-50 dark:bg-black">
        <Signin />
    </div>
  );
};

export default Page;

