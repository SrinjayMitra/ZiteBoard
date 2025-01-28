"use client";
import { IconChevronsDownLeft, IconTruckLoading } from "@tabler/icons-react";
import axios from "axios";
import { Socket } from "dgram";
import React, { Component, useEffect, useState, useRef } from "react";
const { WS_URL, HTTP_URL } = require("@repo/backend-common/config");

interface MycanvasProps {
  type: string;
  text?: string;
  roomId?: string;
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  socket?: WebSocket;
}

// interface MycanvasState {
//   isDrawing: boolean;
//   startX: number;
//   startY: number;
//   canvasCleared:boolean;
// }
type Shape = {
  type: string;
  startX?: number;
  startY?: number;
  width?: number;
  height?: number;
  text?: string;
  centerX?: number;
  centerY?: number;
  radiusX?: number;
  radiusY?: number;
  endX?: number;
  endY?: number;

  /// add more shapes here for more
};

function canvas_arrow(
  context: CanvasRenderingContext2D,
  fromx: number,
  fromy: number,
  tox: number,
  toy: number,
  head: number
) {
  let headlen = head; // length of head in pixels
  let dx = tox - fromx;
  let dy = toy - fromy;
  let angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}

const Mycanvas: React.FC<MycanvasProps> = ({
  type,
  text,
  canvas: externalCanvas,
  socket,
  roomId,
}) => {
  const canvasRef = externalCanvas
    ? { current: externalCanvas }
    : useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  // const [socket,setSocket] = useState<WebSocket | null> (null);
  const [canvasCleared, setCanvasCleared] = useState(false);
  // const existingShapes = useRef<Shape[]>([]);
  const [existingShapes, setExistingShapes] = useState<Shape[]>([]);
  const currentRect = useRef<{
    startX: number;
    startY: number;
    width: number;
    height: number;
  } | null>(null);
  const currentLine = useRef<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const currentCircle = useRef<{
    centerX: number;
    centerY: number;
    Width: number;
    Height: number;
  } | null>(null);

  const fetchRoomData = async (roomId: string) => {
    try {
      const res = await axios.get(`${HTTP_URL}/rooms/${roomId}`, {
        headers: {
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3MDg1MjcxLTYwZDctNDgwYS05Y2YyLTExMmRkNGFmODJjMCIsImlhdCI6MTczNzIzODU4N30.gnU2_iRbxpzcXWCdoS87qR0m6K-t7wzGd2ecFEK9GmY`, // Use environment variables for tokens
        },
      });
      const roomCode = res.data.id; // Handle the response data
      try {
        const response = await axios.get(`${HTTP_URL}/chats/${roomCode}`, {
          headers: {
            Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3MDg1MjcxLTYwZDctNDgwYS05Y2YyLTExMmRkNGFmODJjMCIsImlhdCI6MTczNzIzODU4N30.gnU2_iRbxpzcXWCdoS87qR0m6K-t7wzGd2ecFEK9GmY`, // Use environment variables for tokens
          },
        });
        const chats = response.data.chats;
        // @ts-ignore
        chats.map((element) => {
          // console.log(element.message);
          element.message = JSON.parse(element.message);
          // console.log(element.message);
          let shape: Shape | null = null;
          const {
            startX,
            startY,
            width,
            height,
            centerX,
            centerY,
            endX,
            endY,
          } = element.message;
          switch (element.message.type) {
            case "rect":
              // console.log(startX, startY, width, height);
              shape = {
                type: "rect",
                startX,
                startY,
                width,
                height,
              };
              break;
            case "circle":
              shape = {
                type: "circle",
                centerX,
                centerY,
                width,
                height,
              };
              break;
            case "diamond":
              shape = {
                type: "diamond",
                startX,
                startY,
                width,
                height,
              };
              break;
            case "arrow":
            case "line":
              shape = {
                type: element.message.type,
                startX,
                startY,
                endX,
                endY,
              };
              break;

            case "round-rect":
              shape = {
                type: "round-rect",
                startX,
                startY,
                width,
                height,
              };
              break;
          }
          console.log("existing shapes");
          if (shape) {
            setExistingShapes((prevShapes) => {
              console.log("Previous Shapes:", prevShapes);
              console.log("New Shape:", shape);
              return [...prevShapes, shape];
            });
            console.log(existingShapes);
            clearCanvas(
              existingShapes,
              canvasRef.current!,
              canvasRef.current?.getContext("2d")!
            );
          }
        });
      } catch (error) {
        console.error("Error fetching room data:", error); // Log errors
      }
    } catch (error) {
      console.error("Error fetching room data:", error); // Log errors
    }
  };

  useEffect(() => {
    fetchRoomData(roomId!);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context not found");
      return;
    }
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
          const parsedShape = JSON.parse(message.message);
          // existingShapes.current.push(parsedShape);
          setExistingShapes((prevShapes) => [...prevShapes, parsedShape]);

          // Redraw the canvas with the new shape
          clearCanvas(existingShapes, canvas, ctx);
        }
      };
    }

    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawing(true);
      setStartX(e.offsetX);
      setStartY(e.offsetY);
      clearCanvas(existingShapes, canvas, ctx);
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      // if (currentRect.current && type === "rect") {
      // const { startX, startY, width, height } = currentRect.current;
      //   const shape: Shape = {
      //     type: "rect",
      //     startX,
      //     startY,
      //     width,
      //     height,
      //   };

      if (currentRect.current) {
        let shape: Shape | null = null;
        switch (type) {
          case "rect":
            shape = {
              type: "rect",
              startX: currentRect.current.startX,
              startY: currentRect.current.startY,
              width: currentRect.current.width,
              height: currentRect.current.height,
            };
            break;
          case "round-rect":
            shape = {
              type: "round-rect",
              startX: currentRect.current.startX,
              startY: currentRect.current.startY,
              width: currentRect.current.width,
              height: currentRect.current.height,
            };
            break;

          case "diamond":
            shape = {
              type: "diamond",
              startX: currentRect.current.startX,
              startY: currentRect.current.startY,
              width: currentRect.current.width,
              height: currentRect.current.height,
            };
            break;

          case "arrow":
            shape = {
              type: "arrow",
              startX: currentLine.current?.startX,
              startY: currentLine.current?.startY,
              endX: currentLine.current?.endX,
              endY: currentLine.current?.endY,
            };
            break;

          case "line":
            shape = {
              type: "line",
              startX: currentLine.current?.startX,
              startY: currentLine.current?.startY,
              endX: currentLine.current?.endX,
              endY: currentLine.current?.endY,
            };
            break;

          case "circle":
            // shape = {
            //   type: "circle",
            //   centerX: (startX + centerX) / 2,
            //   centerY: (startY + currentY) / 2,
            //   radiusX: Math.abs(currentX - startX) / 2,
            //   radiusY: Math.abs(currentY - startY) / 2,
            // };
            shape = {
              type: "circle",
              centerX: currentCircle.current?.centerX,
              centerY: currentCircle.current?.centerY,
              height: currentCircle.current?.Height,
              width: currentCircle.current?.Width,
            };
            break;

          // case "text":
          //   shape = {
          //     type: "text",
          //     text: text || "",
          //     startX,
          //     startY,
          //   };
          //   break;

          default:
            console.error("Unknown type:", type);
            return;
        }
        if (shape) {
          setExistingShapes((prevShapes) => [...prevShapes, shape]);
          console.log("hi from mouse up");
          console.log(socket);
          console.log("Shape data:", shape);
          if (socket?.readyState === WebSocket.OPEN) {
            console.log("hello");
            socket.send(
              JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                room: roomId,
              })
            );
          } else {
            console.log("Socket is not open.");
          }
        }
      }
      console.log(existingShapes);
      clearCanvas(
        existingShapes,
        canvasRef.current!,
        canvasRef.current!.getContext("2d")!
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return;
      if (isDrawing && !canvasCleared) {
        clearCanvas(existingShapes, canvas, ctx);
        setCanvasCleared(true);
      }

      const currentX = e.offsetX;
      const currentY = e.offsetY;

      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      const rectStartX = currentX < startX ? currentX : startX;
      const rectStartY = currentY < startY ? currentY : startY;

      const EllipseWidth = Math.abs(currentX - startX) / 2;
      const EllipseHeight = Math.abs(currentY - startY) / 2;

      const EllipsecenterX = (currentX + startX) / 2;
      const EllipsecenterY = (currentY + startY) / 2;
      currentRect.current = {
        startX: rectStartX,
        startY: rectStartY,
        width,
        height,
      };
      currentLine.current = {
        startX: startX,
        startY: startY,
        endX: currentX,
        endY: currentY,
      };
      currentCircle.current = {
        centerX: EllipsecenterX,
        centerY: EllipsecenterY,
        Width: EllipseWidth,
        Height: EllipseHeight,
      };

      if (ctx && canvasRef.current) {
        clearCanvas(existingShapes, canvas, ctx);
        ctx.strokeStyle = "white";
        switch (type) {
          case "round-rect":
            ctx.beginPath();
            ctx.roundRect(rectStartX, rectStartY, width, height, 6 * Math.PI);
            ctx.stroke();
            break;
          case "rect":
            ctx.beginPath();
            ctx.strokeRect(rectStartX, rectStartY, width, height);
            ctx.stroke();
            break;
          case "diamond":
            ctx.save();
            ctx.translate(rectStartX + width / 2, rectStartY + height / 2);
            ctx.rotate((45 * Math.PI) / 180);
            ctx.beginPath();
            ctx.roundRect(-width / 2, -height / 2, width, width, 4 * Math.PI);
            ctx.stroke();
            ctx.restore();
            break;
          case "arrow":
            ctx.beginPath();
            console.log({ startX, startY, currentX, currentY });
            canvas_arrow(ctx, startX, startY, currentX, currentY, 10);
            ctx.stroke();
            break;
          case "line":
            ctx.beginPath();
            canvas_arrow(ctx, startX, startY, currentX, currentY, 0);
            ctx.stroke();
            break;
          case "circle":
            ctx.beginPath();
            ctx.ellipse(
              EllipsecenterX,
              EllipsecenterY,
              EllipseWidth,
              EllipseHeight,
              0,
              0,
              2 * Math.PI
            );
            ctx.stroke();
            break;
          case "text":
            ctx.strokeRect(rectStartX, rectStartY, width, height);
            ctx.fillStyle = "white";
            ctx.fillText(text as string, startX, startY);
            break;
          default:
            console.error("Unknown type:", type);
            break;
        }
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDrawing, startX, startY, canvasCleared, type, text]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      clearCanvas(existingShapes, canvas, ctx);
    }
  }, [existingShapes]);

  const clearCanvas = (
    shapes: Shape[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.map((shape) => {
      // if (shape.type === "rect") {
      //   ctx.strokeRect(shape.startX!, shape.startY!, shape.width!, shape.height!);
      // }
      switch (shape.type) {
        case "rect":
          ctx.strokeRect(
            shape.startX!,
            shape.startY!,
            shape.width!,
            shape.height!
          );
          break;

        case "round-rect":
          ctx.beginPath();
          ctx.roundRect(
            shape.startX!,
            shape.startY!,
            shape.width!,
            shape.height!,
            6 * Math.PI
          );
          ctx.stroke();
          break;

        case "diamond":
          ctx.save();
          ctx.translate(
            shape.startX! + shape.width! / 2,
            shape.startY! + shape.height! / 2
          );
          ctx.rotate((45 * Math.PI) / 180);
          ctx.beginPath();
          ctx.roundRect(
            -shape.width! / 2,
            -shape.height! / 2,
            shape.width!,
            shape.width!,
            4 * Math.PI
          );
          ctx.stroke();
          ctx.restore();
          break;

        case "arrow":
          ctx.beginPath();
          canvas_arrow(
            ctx,
            shape.startX!,
            shape.startY!,
            shape.endX!,
            shape.endY!,
            10
          );
          ctx.stroke();
          break;

        case "line":
          ctx.beginPath();
          canvas_arrow(
            ctx,
            shape.startX!,
            shape.startY!,
            shape.endX!,
            shape.endY!,
            0
          );
          ctx.stroke();
          break;

        case "circle":
          ctx.beginPath();
          ctx.ellipse(
            shape.centerX!,
            shape.centerY!,
            shape.width!,
            shape.height!,
            0,
            0,
            2 * Math.PI
          );
          ctx.stroke();
          break;
      }
    });
  };

  if (externalCanvas) return null;

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth||1000}
        height={window.innerHeight || 1000}
        style={{ backgroundColor: "black" }}
      />
    </div>
  );
};

export default Mycanvas;
