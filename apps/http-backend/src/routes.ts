// import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const { prismaClient }: any = require("@repo/db/client");
const { JWT_SECRET } = require('@repo/backend-common/config');

import { Router, Request, Response, response } from "express";
import { checkUser } from "./middleware";
import { hashPassword, verifyPassword } from "./helpers";

const router: Router = Router();
router.post('/signup', async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        res.status(403).json({
            message: "Please provide all the fields"
        });
        return;
    }
    else {
        try {
            const existingUser = await prismaClient.user.findUnique({
                where: {
                    email: email
                }
            });

            if (existingUser) {
                res.status(409).json({
                    message: "User already exists"
                });
                return;
            } else {
                const hashedPassword = await hashPassword(password);
                const user = await prismaClient.user.create({
                    data: {
                        email,
                        password : hashedPassword,
                        name,
                    }
                });
                res.status(201).json({
                    message: "user created successfully",
                    userId: user.id
                });
            }
        } catch (e) {
            console.error(e);
        }
    }
});

router.post('/signin', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(403).json({
            message: "Please provide all the fields"
        });
        return;
    }
    else {
        try {
            const user = await prismaClient.user.findFirst({
                where: {
                    email
                }
            });
            if (!user) {
                res.status(404).json({
                    "error": "User not found",
                    "message": "No user found with the provided email."
                  });
                return;
            }
            const passValid = await verifyPassword(password, user.password);
             if (!passValid) {
                res.status(403).json({
                    "error": "Invalid credentials",
                    "message": "Incorrect password. Please try again."
                  });
                return;
            }
            else {
                const token = jwt.sign({ id: user.id }, JWT_SECRET);
                res.status(200).json({
                    message: "Logged in successfully",
                    token,
                    user:{
                    id:user.id,
                    name:user.name,
                    email:user.email
                    }
                });
            }

        } catch (e) {
            res.status(402).json({
                    "error": "Authentication failed",
                    "message": "An unexpected error occurred. Please try again later."
            })
            console.error(e);
        }
    }
});

router.post('/rooms', checkUser, async (req: Request, res: Response) => {
    const { name } = req.body;
    //@ts-ignore
    const userId = req.userId;
    if (!name) {
        res.status(403).json({
            message: "Please provide all the fields"
        });
        return;
    } else {
        try {
            // Check if the room with the given slug exists
            let room = await prismaClient.room.findUnique({
                where: {
                    slug: name
                },
                include: {
                    users: true
                }
            });

            if (!room) {
                // Create a new room if it doesn't exist
                room = await prismaClient.room.create({
                    data: {
                        slug: name,
                        users: {
                            create: {
                                userId: userId
                            }
                        }
                    }
                });
                res.status(201).json({
                    message: "Room created successfully",
                    roomId: room.id
                });
            } else {
                //@ts-ignore
                const userAlreadyInRoom = room.users.some(user => user.userId === userId);
                if (userAlreadyInRoom) {
                    res.status(200).json({
                        message: "User already in this room"
                    });
                } else {
                    // Add user to the existing room
                    await prismaClient.roomUser.create({
                        data: {
                            roomId: room.id,
                            userId: userId
                        }
                    });
                    res.status(200).json({
                        message: "User added to room successfully"
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
});

router.get("/allRooms",checkUser,async (req:Request, res:Response) => {
    //@ts-ignore
    const userId = req.userId;
    try{
    const rooms = await prismaClient.roomUser.findMany({
        where:{
             userId
        },include:{
            room:true
        }
    })
    // console.log(rooms);
    res.status(200).json(rooms);
    }catch(err){
        console.error(err);
    }
})

router.get('/rooms/:slug', checkUser, async (req: Request, res: Response) => {
    const { slug } = req.params;
    //@ts-ignore
    const userId = req.userId;
    if (!slug) {
        res.status(403).json({
            message: "Please provide all the fields"
        });
        return;
    } else {
        try {
            const room = await prismaClient.room.findUnique({
                where: {
                    slug
                }
            });
            if (!room) {
                res.status(404).json({
                    message: "Room not found"
                });
                return;
            }
            res.status(200).json({
                message: "Room found",
                id: room.id
            });
        } catch (e) {
            console.error(e);
        }
    }
});

router.get('/chats/:slug', checkUser, async (req: Request, res: Response) => {
    const { slug } = req.params;
    //@ts-ignore
    const userId = req.userId;
    if (!slug) {
        res.status(403).json({
            message: "Please provide all the fields"
        });
        return;
    } else {
        try {
            const chats = await prismaClient.chat.findMany({
                where: {
                    roomId: Number(slug) 
                },
                orderBy:{
                    id:"desc"
                },
                take: 50
            });
            if (!chats) {
                res.status(404).json({
                    message: "Room not found"
                });
                return;
            }
            res.status(200).json({
                message: "Chats found",
                chats
            });
        } catch (e) {
            console.error(e);
        }
    }
});

export default router;
