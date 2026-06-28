import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})
import {connectDB} from './db/index'
import { app } from './app'

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, "0.0.0.0", ()=>{
     console.log(`⚙️Server is running at port: ${process.env.PORT || 8000}`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!", err)
})