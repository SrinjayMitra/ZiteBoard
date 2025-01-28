import axios from "axios";
const { BACKEND_URL } = require("@repo/backend-common/config");

export const signup = async (
  email: string,
  password: string,
  name: string
): Promise<any> => {
  try {
    const response = await axios.post(`${BACKEND_URL}signup`, {
      email,
      password,
      name,
    });
    
    // Log the status code and handle the successful response
    // console.log("Response Status:", response.status);
    return response.data; // Return the response data if successful
  } catch (err: any) {
    console.error("Error:", err);

    // Handle different error scenarios based on status code
    if (err.response) {
      const status = err.response.status;
      if (status === 409) {
        // If the status is 409, it means the user already exists
        // console.log("User already exists. Please try with a different email.");
        return { message: "User already exists. Please try with a different email." }; // Return the error message for the UI
      } else {
        // Fallback error message for other cases
        const errorMessage = err.response.data?.message || "Signup failed. Please try again.";
        console.log(errorMessage);
        return { message: errorMessage }; // Return the error message for the UI
      }
    }
    return { message: "An unexpected error occurred. Please try again." }; // Handle cases where no response was received
  }
};

export const signin = async (email: string, password: string): Promise<any> => {
    try {
      const response = await axios.post(`${BACKEND_URL}signin`, {
        email,
        password,
      });
      
      // Check if the response contains user data and token
      if (response.data && response.data.token) {
        return {
          user: {
            id: response.data.id, // Adjust to the correct property name from your response
            name: response.data.name, // Adjust if your response has a user name
            email: email,
          },
          token: response.data.token,
        };
      }
      return null;
    } catch (err: any) {
      console.error("Error during signin:", err);
  
      if (err.response) {
        const { status } = err.response;
        const message = err.response.data?.message || "Authentication failed.";
  
        switch (status) {
          case 403:
            return { error: "Invalid credentials", message: "Incorrect password. Please try again." };
          case 404:
            return { error: "User not found", message: "No user found with the provided email." };
          default:
            return { error: "Authentication failed", message };
        }
      }
  
      return { error: "Network error", message: "Unable to connect to the server." };
    }
  };

export const createNewRoom = async(room:string)=>{
  try{
    const response = await axios.post(`${BACKEND_URL}/rooms`,
        {
          "name":room
      },{
        headers:{
          "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3MDg1MjcxLTYwZDctNDgwYS05Y2YyLTExMmRkNGFmODJjMCIsImlhdCI6MTczNzIzODU4N30.gnU2_iRbxpzcXWCdoS87qR0m6K-t7wzGd2ecFEK9GmY"
        }
      })
      return  response.data.message;

  }catch(e){
    console.error(e);
  }

}

export const getAllRooms = async()=>{
  try{
    const response = await axios.get(`${BACKEND_URL}/allRooms`,
       {
        headers:{
          "Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3MDg1MjcxLTYwZDctNDgwYS05Y2YyLTExMmRkNGFmODJjMCIsImlhdCI6MTczODA1NjgyNH0.xWyQuAJZ3_CUUnbZfyqo5cFgWPrJay3-2nTRh0ioKq8"
        }
      })
     const result = response.data;
     console.log(result);

  }catch(e){
    console.error(e);
  }

}