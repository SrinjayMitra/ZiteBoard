"use client";
import React, { useEffect } from "react";
import { Plus, Users, Folders, Moon, Sun, X, LogOut } from "lucide-react";
import Modal from "./modal";
import Loader from "./loader";
import Alert, { AlertVariant } from "./alert";
import { useRouter } from "next/navigation";
import { createNewRoom, getAllRooms } from "../(lib)/utils";
import RoomsModal from "./roomodal";
import Email from "next-auth/providers/email";
import NotSignedIn from "./notSigned";

// function Dashboard() {
//   const [darkMode, setDarkMode] = React.useState(() => {
//     const savedMode = localStorage.getItem("darkMode");
//     return savedMode ? JSON.parse(savedMode) : false;
//   });

  function Dashboard() {
    const [darkMode, setDarkMode] = React.useState(true); // Initialize with a default value (false)
  
    useEffect(() => {
      const savedMode = localStorage.getItem("darkMode");
      if (savedMode) { // Check if a value exists
        setDarkMode(JSON.parse(savedMode));
      }
    }, []); // Empty dependency array: This runs only once after the component mounts
  
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [joinModalOpen, setJoinModalOpen] = React.useState(false);
  const [roomsModalOpen, setRoomsModalOpen] = React.useState(false);
  const [roomName, setRoomName] = React.useState("");
  const [token, setToken] = React.useState(false);
  const [roomCode, setRoomCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [alert, setAlert] = React.useState<{
    variant: AlertVariant;
    title: string;
    message: string;
  } | null>(null);
  const [rooms, setRooms] = React.useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);


  const router = useRouter();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);
    try {
      const res = await createNewRoom(roomName);
      console.log(res);
      if (
        res == "Room created successfully" ||
        res == "User added to room successfully"
      ) {
        router.push(`/canvas/${roomName}`);
        console.log("Creating room:", roomName);
      } else if (res == "User already in this room") {
        setAlert({
          variant: "error",
          title: "Error",
          message:
            "This room already exists. Please try a different room name.",
        });
      }
      //  Handle room creation logic here
    } catch (error) {
      console.error(error);
    } finally {
      setRoomName(roomName);
      setCreateModalOpen(false);
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      //  Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Joining room:", roomCode);
      router.push(`/canvas/${roomCode}`);
      //  Handle room joining logic here
    } catch (error) {
      console.error("Error joining room:", error);
    } finally {
      setRoomCode("");
      setJoinModalOpen(false);
      setIsLoading(false);
    }
  };
  const removetoken = ()=>{
     localStorage.removeItem('token');
  }

  const handleGetRooms = async () => {
    setIsLoading(true); ///Show a loading spinner or indicator
    try {
      
      const response = await getAllRooms();

      //  Ensure the response is correctly typed
      if (Array.isArray(response)) {
        const formattedRooms = response.map((room: any) => ({
          id: room.room.id.toString(), // Convert room ID to string
          name: room.room.slug, //Use the slug as the room name
        }));

        setRooms(formattedRooms); //Update state with formatted rooms
        setRoomsModalOpen(true); //Open the modal
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false); // Hide the loading spinner or indicator
    }
  };
  useEffect(() => {
    if( localStorage.getItem("token"))
    setToken(true); 
  }, []);
 
  if (!token) {
    return <NotSignedIn />; 
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              ZiteBoard
            </h1>
            <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-600">
              Welcome {localStorage.getItem('name')?.split(" ")[0]}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <img
                  src="https:images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </button>
              <a href="/signin" onClick={removetoken}>
                 <LogOut className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"/>
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {alert && (
            <Alert
              variant={alert.variant}
              title={alert.title}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div
              onClick={() => setCreateModalOpen(true)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  New
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Create Room
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Start a new collaborative drawing space
              </p>
            </div>

            <div
              onClick={() => setJoinModalOpen(true)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Join
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Join Room
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enter an existing room with a code
              </p>
            </div>

            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-gray-100 dark:border-gray-700"
              onClick={handleGetRooms}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <Folders className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  View
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                My Rooms
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Access your created drawing rooms
              </p>
            </div>
          </div>

          {/* Recent Rooms */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Rooms
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((room) => (
                <div
                  key={room}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <Folders className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Project Brainstorm {room}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last edited 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      <img
                        src="https:images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Member"
                        className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800"
                      />
                      <img
                        src="https:images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Member"
                        className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800"
                      />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Create Room Modal */}
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New Room"
        >
          <form onSubmit={handleCreateRoom}>
            <div className="mb-4">
              <label
                htmlFor="roomName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Room Name
              </label>
              <input
                type="text"
                id="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter room name"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Create Room
              </button>
            </div>
          </form>
        </Modal>

        {/* Join Room Modal */}
        <Modal
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          title="Join Room"
        >
          <form onSubmit={handleJoinRoom}>
            <div className="mb-4">
              <label
                htmlFor="roomCode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Room Code
              </label>
              <input
                type="text"
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter room code"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
              >
                Join Room
              </button>
            </div>
          </form>
        </Modal>
        <RoomsModal
          isOpen={roomsModalOpen}
          onClose={() => setRoomsModalOpen(false)}
          rooms={rooms}
        />

        {/* Loading Overlay */}
        {isLoading && <Loader />}
      </div>
    </div>
            
  );
}

 export default Dashboard;



























































































































































































































































//  "use client";
//  import React, { useEffect, useState } from 'react';
//  import { Plus, Users, Folders, Moon, Sun, X } from 'lucide-react';
//  import Modal from './modal';
//  import Loader from './loader';
//  import Alert, { AlertVariant } from './alert';
//  import { useRouter } from 'next/navigation';
//  import { createNewRoom, getAllRooms } from '../(lib)/utils';
//  import axios from 'axios';
//  import RoomsModal from './roomodal';  Import the new RoomsModal component

//  function Dashboard() {
//    const [darkMode, setDarkMode] = React.useState(() => {
//      const savedMode = localStorage.getItem('darkMode');
//      return savedMode ? JSON.parse(savedMode) : false;
//    });

//    const [createModalOpen, setCreateModalOpen] = React.useState(false);
//    const [joinModalOpen, setJoinModalOpen] = React.useState(false);
//    const [roomsModalOpen, setRoomsModalOpen] = React.useState(false);  State for RoomsModal
//    const [roomName, setRoomName] = React.useState('');
//    const [roomCode, setRoomCode] = React.useState('');
//    const [isLoading, setIsLoading] = React.useState(false);
//    const [alert, setAlert] = React.useState<{ variant: AlertVariant; title: string; message: string } | null>(null);
//    const [rooms, setRooms] = React.useState<{ id: string; name: string }[]>([]);  State to store rooms

//    useEffect(() => {
//      localStorage.setItem('darkMode', JSON.stringify(darkMode));
//    }, [darkMode]);

//    const router = useRouter();

//    const handleCreateRoom = async (e: React.FormEvent) => {
//      e.preventDefault();
//      setIsLoading(true);
//      setAlert(null);
//      try {
//        const res = await createNewRoom(roomName);
//        console.log(res);
//        if (res == "Room created successfully" || res == "User added to room successfully") {
//          router.push(`/canvas/${roomName}`);
//          console.log('Creating room:', roomName);
//        } else if (res == "User already in this room") {
//          setAlert({
//            variant: "error",
//            title: "Error",
//            message: 'This room already exists. Please try a different room name.',
//          });
//        }
//      } catch (error) {
//        console.error(error);
//      } finally {
//        setRoomName(roomName);
//        setCreateModalOpen(false);
//        setIsLoading(false);
//      }
//    };

//    const handleJoinRoom = async (e: React.FormEvent) => {
//      e.preventDefault();
//      setIsLoading(true);
//      try {
//        console.log('Joining room:', roomCode);
//        router.push(`/canvas/${roomCode}`);
//      } catch (error) {
//        console.error('Error joining room:', error);
//      } finally {
//        setRoomCode('');
//        setJoinModalOpen(false);
//        setIsLoading(false);
//      }
//    };

//    const handleGetRooms = async () => {
//      setIsLoading(true);  Show a loading spinner or indicator
//      try {
//         Fetch rooms from the API
//        const response = await getAllRooms();

//         Ensure the response is correctly typed
//        if (Array.isArray(response)) {
//          const formattedRooms = response.map((room: any) => ({
//            id: room.room.id.toString(),  Convert room ID to string
//            name: room.room.slug,  Use the slug as the room name
//          }));

//          setRooms(formattedRooms);  Update state with formatted rooms
//          setRoomsModalOpen(true);  Open the modal
//        } else {
//          console.error('Unexpected response format:', response);
//        }
//      } catch (error) {
//        console.error('Error fetching rooms:', error);
//      } finally {
//        setIsLoading(false);  Hide the loading spinner or indicator
//      }
//    };

//    return (
//      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
//        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
//          {/* Header */}
//          <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
//            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
//              <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Excalidraw</h1>
//              <div className="flex items-center space-x-4">
//                <button
//                  onClick={() => setDarkMode(!darkMode)}
//                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
//                >
//                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//                </button>
//                <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
//                  <img
//                    src="https:images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                    alt="Profile"
//                    className="h-8 w-8 rounded-full"
//                  />
//                </button>
//              </div>
//            </div>
//          </header>

//          {/* Main Content */}
//          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//            {alert && (
//              <Alert
//                variant={alert.variant}
//                title={alert.title}
//                message={alert.message}
//                onClose={() => setAlert(null)}
//              />
//            )}
//            {/* Action Cards */}
//            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//              <div
//                onClick={() => setCreateModalOpen(true)}
//                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-gray-100 dark:border-gray-700"
//              >
//                <div className="flex items-center justify-between mb-4">
//                  <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
//                    <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
//                  </div>
//                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">New</span>
//                </div>
//                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Room</h2>
//                <p className="text-gray-600 dark:text-gray-400">Start a new collaborative drawing space</p>
//              </div>

//              <div
//                onClick={() => setJoinModalOpen(true)}
//                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-gray-100 dark:border-gray-700"
//              >
//                <div className="flex items-center justify-between mb-4">
//                  <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
//                    <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
//                  </div>
//                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Join</span>
//                </div>
//                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Join Room</h2>
//                <p className="text-gray-600 dark:text-gray-400">Enter an existing room with a code</p>
//              </div>

//              <div
//                onClick={handleGetRooms}
//                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border border-gray-100 dark:border-gray-700"
//              >
//                <div className="flex items-center justify-between mb-4">
//                  <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
//                    <Folders className="h-6 w-6 text-purple-600 dark:text-purple-400" />
//                  </div>
//                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">View</span>
//                </div>
//                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">My Rooms</h2>
//                <p className="text-gray-600 dark:text-gray-400">Access your created drawing rooms</p>
//              </div>
//            </div>

//            {/* Recent Rooms */}
//            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
//              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Rooms</h2>
//              <div className="space-y-4">
//                {[1, 2, 3].map((room) => (
//                  <div key={room} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
//                    <div className="flex items-center space-x-4">
//                      <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
//                        <Folders className="h-5 w-5 text-gray-600 dark:text-gray-400" />
//                      </div>
//                      <div>
//                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Project Brainstorm {room}</h3>
//                        <p className="text-sm text-gray-500 dark:text-gray-400">Last edited 2 hours ago</p>
//                      </div>
//                    </div>
//                    <div className="flex items-center space-x-2">
//                      <div className="flex -space-x-2">
//                        <img
//                          src="https:images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                          alt="Member"
//                          className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800"
//                        />
//                        <img
//                          src="https:images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                          alt="Member"
//                          className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800"
//                        />
//                      </div>
//                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
//                        <Plus className="h-5 w-5" />
//                      </button>
//                    </div>
//                  </div>
//                ))}
//              </div>
//            </div>
//          </main>

//          {/* Create Room Modal */}
//          <Modal
//            isOpen={createModalOpen}
//            onClose={() => setCreateModalOpen(false)}
//            title="Create New Room"
//          >
//            <form onSubmit={handleCreateRoom}>
//              <div className="mb-4">
//                <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                  Room Name
//                </label>
//                <input
//                  type="text"
//                  id="roomName"
//                  value={roomName}
//                  onChange={(e) => setRoomName(e.target.value)}
//                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
//                  placeholder="Enter room name"
//                  required
//                />
//              </div>
//              <div className="flex justify-end">
//                <button
//                  type="submit"
//                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
//                >
//                  Create Room
//                </button>
//              </div>
//            </form>
//          </Modal>

//          {/* Join Room Modal */}
//          <Modal
//            isOpen={joinModalOpen}
//            onClose={() => setJoinModalOpen(false)}
//            title="Join Room"
//          >
//            <form onSubmit={handleJoinRoom}>
//              <div className="mb-4">
//                <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                  Room Code
//                </label>
//                <input
//                  type="text"
//                  id="roomCode"
//                  value={roomCode}
//                  onChange={(e) => setRoomCode(e.target.value)}
//                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
//                  placeholder="Enter room code"
//                  required
//                />
//              </div>
//              <div className="flex justify-end">
//                <button
//                  type="submit"
//                  className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
//                >
//                  Join Room
//                </button>
//              </div>
//            </form>
//          </Modal>

//          {/* Rooms Modal */}
//          <RoomsModal
//            isOpen={roomsModalOpen}
//            onClose={() => setRoomsModalOpen(false)}
//            rooms={rooms}
//          />

//          {/* Loading Overlay */}
//          {isLoading && <Loader />}
//        </div>
//      </div>
//    );
//  }

//  export default Dashboard;
