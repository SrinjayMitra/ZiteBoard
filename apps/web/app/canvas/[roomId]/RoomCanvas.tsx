"use client";
import React, { useEffect, useState } from "react";
import Mycanvas from "./canvas";
import { ArrowRightIcon, CircleIcon, Diamond, Link, LogOutIcon, Minus, MousePointer, Pencil, RectangleHorizontalIcon, Square } from "lucide-react";
import { IconSquareRounded } from "@tabler/icons-react";
const { WS_URL } = require("@repo/backend-common/config");

interface RoomCanvasProps {
  text?: string;
  roomId?: string;
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
}

const RoomCanvas: React.FC<RoomCanvasProps> = ({
  text = "Default Text",
  roomId,
  canvas,
  ctx,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [closeSocket,setCloseSocket] = useState<WebSocket | null>(null);
  const [canvasType,setCanvasType] = useState("rect");
  const logout = () => {
    if (socket) {
      socket.send(JSON.stringify({
        type: "unsubscribe",
        room: roomId
      }));
      socket.close();
    }
  };


  useEffect(() => {
    const wss = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE0MzBmYmY0LWJjYzMtNDAxMy04Y2M1LTFlM2JhOTVkNDg3MyIsImlhdCI6MTczNzk2ODkwNX0.zUreLLV0tUdcL1KV8m_OGX0ykJXBQUT0pW7g2Uuje-o`);
    wss.onopen = () => {
      setSocket(wss);
      console.log("connected");
      wss.send(JSON.stringify({
        type:"subscribe",
        room:roomId
      }))
    };
 
    
    wss.onclose = ()=>{
      setCloseSocket(wss);
      wss.send(JSON.stringify({
        type:"unsubscribe",
        room:roomId
      }));
    }


    // return () => {
    //   ws.close();
    // };
  }, []);


  return (
    <div className="relative">
  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 p-4 rounded-lg shadow-xl z-10 flex gap-x-6 items-center">
   
   <MousePointer
    className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
    onClick={() => setCanvasType("pan")} 
    />

    <RectangleHorizontalIcon 
      className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
      onClick={() => setCanvasType("rect")} 
    />
    
    <IconSquareRounded
    className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
    onClick={() => setCanvasType("round-rect")} 
    />

    <Diamond 
    className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
    onClick={() => setCanvasType("diamond")} 
    />

    <CircleIcon 
      className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
      onClick={() => setCanvasType("circle")} 
    /> 

    <ArrowRightIcon 
     className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
     onClick={() => setCanvasType("arrow")} 
    />

    <Minus 
    className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
    onClick={() => setCanvasType("line")} 
    />

    <Pencil 
    className="w-6 h-6 text-white hover:w-9 hover:h-9 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
    onClick={() => setCanvasType("pencil")} 
    />

    <a href="/dashboard" target="_blank" onClick={logout}>
    <LogOutIcon 
    className="w-6 h-6 text-white hover:w-9 hover:h-9 transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
    />
    </a>
   

    
    

   

  </div>
  
  <Mycanvas 
    // type = "pencil"
    type={canvasType} 
    text={text} 
    roomId={roomId} 
    canvas={canvas} 
    ctx={ctx} 
    socket={socket!} 
  />
</div>

  
  );
};

export default RoomCanvas;
