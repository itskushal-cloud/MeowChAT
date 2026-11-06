import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.routes.js";
// import Conversationroutes from "./routes/conversation.routes.js";
import connect_to_db from "./db/connect_to_db.js";
import { setServers } from "node:dns/promises";
import cors from "cors";
// import Conversation from "./model/conersation.model.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/User.routes.js";


setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const app = express();
const PORT=process.env.PORT || 5000;


app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());

app.use("/auth",authroutes); // to parse the incoming request with json payload (from req.body)
// app.use("/",Conversationroutes);
app.use("/api/users", userRoutes);

app.listen(PORT,() => {
    connect_to_db();
    console.log(` HEHE MEOW IS MEOWING ON PORT ${PORT}`)
}); // http://localhost:5000/

