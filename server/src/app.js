import express, { urlencoded } from 'express';
import userRouter from './routes/user.routes.js';
import chatRouter from './routes/chat.routes.js';
import messageRouter from './routes/message.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express()
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials : true
    })
)

app.use(express.json());
//reads json data from frontend without it :req.body  // ❌ undefined
app.use(express.urlencoded({extended:true}));
//takes html form data; extended true → allows nested objects false → only simple key-value
app.use(express.static("public"));
//if someone request a file , look in the public folder
app.use(cookieParser())

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);

export { app }