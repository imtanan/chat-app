import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express()
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials : true
    })
)

app.use(express.json());//This reads JSON data sent by the frontend
app.use(express.urlencoded({extended:true}));//extended to not proper form data
app.use(cookieParser())

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

export { app }