import express, { json, Router, } from "express";
import { Jwt } from "jsonwebtoken";
import router from "./routes";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", router);
const port = process.env.PORT || 3001;


app.listen(port, () => {
    console.log("Server is running on port 3001");
});
