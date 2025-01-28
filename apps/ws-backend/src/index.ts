import { WebSocketServer, WebSocket } from 'ws';
import { checkUser } from './helper';
const { prismaClient } = require('@repo/db/client');
const  {BACKEND_URL} = require('@repo/backend-common/config');
import axios from 'axios';

const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log("Server started on port 8080");
});

interface User {
  ws: WebSocket;
  rooms: { room: string, roomId: number }[];  // Store room and its corresponding roomId
  userId: string;
}

const users: User[] = [];

wss.on('connection', function connection(ws, request) {
  try {
    const url = request.url || "";
    const queryParams = new URLSearchParams(url.split('?')[1] || "");
    const token = queryParams.get('token') || "";

    // Ensure checkUser is awaited if it's async
    const userId = checkUser(token); // Use await if checkUser is async
    if (!userId) {
      ws.send(JSON.stringify({ error: "Invalid token" }));
      ws.close();
      return;
    }

    users.push({ ws, rooms: [], userId });

    ws.on('message', async function message(jsondata) {
      try {
        const data = JSON.parse(jsondata.toString());
        const user = users.find(u => u.ws === ws);

        if (!data.type || !user) {
          ws.send(JSON.stringify({ error: "Invalid message format or user not found" }));
          return;
        }

        switch (data.type) {
          case 'subscribe':
            if (data.room && typeof data.room === 'string') {
              // Check if user is already subscribed to this room
              if (user.rooms.find(r => r.room === data.room)) {
                ws.send(JSON.stringify({ error: `Already subscribed to room ${data.room}` }));
                return;
              }

              try {
                const roomResponse = await axios.get(`${BACKEND_URL}rooms/${data.room}`, {
                  headers: { Authorization: `${token}` }
                });

                const room = roomResponse.data;
                if (room && room.id) {
                  user.rooms.push({ room: data.room, roomId: room.id });
                  ws.send(JSON.stringify({ success: `Subscribed to room ${data.room}` }));
                } else {
                  ws.send(JSON.stringify({ error: "Room not found" }));
                }
              } catch (err) {
                console.error("Error fetching room", err);
                ws.send(JSON.stringify({ error: "Error fetching room" }));
              }
            } else {
              ws.send(JSON.stringify({ error: "Invalid room name" }));
            }
            break;

          case 'unsubscribe':
            if (data.room && typeof data.room === 'string') {
              user.rooms = user.rooms.filter(r => r.room !== data.room);
              ws.send(JSON.stringify({ success: `Unsubscribed from room ${data.room}` }));
            } else {
              ws.send(JSON.stringify({ error: "Invalid room name" }));
            }
            break;

          case 'chat':
            if (data.room && data.message && typeof data.room === 'string' && typeof data.message === 'string') {
              const roomData = user.rooms.find(r => r.room === data.room);
              if (!roomData) {
                ws.send(JSON.stringify({ error: "Not subscribed to room" }));
                return;
              }

              const roomId = roomData.roomId;
              console.log("Room ID:", roomId);

              await prismaClient.chat.create({
                data: {
                  roomId,
                  message: data.message,
                  userId
                }
              });

              // Notify all users in the room
              users.forEach(user => {
                if (user.rooms.some(r => r.room === data.room)) {
                  user.ws.send(JSON.stringify({
                    type: "chat",
                    message: data.message,
                    roomId: data.room
                  }));
                }
              });
            } else {
              ws.send(JSON.stringify({ error: "Invalid chat data" }));
            }
            break;

          default:
            ws.send(JSON.stringify({ error: "Unknown message type" }));
        }
      } catch (err) {
        console.error("Error processing message", err);
        ws.send(JSON.stringify({ error: "Error processing message" }));
      }
    });

    ws.on('close', () => {
      const index = users.findIndex(u => u.ws === ws);
      if (index !== -1) {
        users.splice(index, 1);
      }
    });

    ws.on('error', console.error);

  } catch (err) {
    console.error("Error establishing connection", err);
    ws.close();
  }
});
