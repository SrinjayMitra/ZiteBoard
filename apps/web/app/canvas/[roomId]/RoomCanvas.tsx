"use client";
import React, { useEffect, useState } from "react";
import Mycanvas from "./canvas";
import { ArrowRightIcon, CircleIcon, Diamond, Minus, RectangleHorizontalIcon, Square } from "lucide-react";
import { IconSquareRounded } from "@tabler/icons-react";
const { WS_URL } = require("@repo/backend-common/config");

interface RoomCanvasProps {
  type: string;
  text?: string;
  roomId?: string;
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
}

const RoomCanvas: React.FC<RoomCanvasProps> = ({
  type,
  text = "Default Text",
  roomId,
  canvas,
  ctx,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [closeSocket,setCloseSocket] = useState<WebSocket | null>(null);
  const [canvasType,setCanvasType] = useState("rect");


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
   
    <RectangleHorizontalIcon 
      className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110" 
      onClick={() => setCanvasType("rect")} 
    />
    
    <IconSquareRounded
    className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110" 
    onClick={() => setCanvasType("round-rect")} 
    />

    <Diamond 
    className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110" 
    onClick={() => setCanvasType("diamond")} 
    />

    <CircleIcon 
      className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110" 
      onClick={() => setCanvasType("circle")} 
    /> 

    <ArrowRightIcon 
     className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110" 
     onClick={() => setCanvasType("arrow")} 
    />

    <Minus 
    className="w-8 h-8 text-white hover:w-12 hover:h-12 transition-all duration-300 ease-in-out transform hover:scale-110" 
    onClick={() => setCanvasType("line")} 
    />
    
    

   

  </div>
  
  <Mycanvas 
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
