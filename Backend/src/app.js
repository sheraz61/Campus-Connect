import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from this origin
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}))

// Configure middleware to parse JSON requests
app.use(express.json({
    limit: "16kb" // Limit JSON payload size to 16kb
}))

app.use(express.urlencoded({ 
    extended: true, // Allow parsing of nested objects
    limit: "16kb" // Limit URL-encoded payload size to 16kb
}))

// Serve static files from the 'public' directory
app.use(express.static("Public"))
// Parse cookies in incoming requests
app.use(cookieParser())
//routes
import userRouter from './Routes/user.routes.js'
import postRouter from './Routes/post.routes.js'
//routes decaleration
app.use('/api/v1/users',userRouter)
app.use('/api/v1/posts',postRouter)
export {app}