import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()

app.use(cors({
    origin: 'http://localhost:5173', // Allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed methods
    allowedHeaders: ['Authorization', 'X-Refresh-Token', 'Content-Type'], // Allowed headers
    credentials: true // Allow sending credentials (e.g., cookies)
  }));


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
import subscriptionRouter from './Routes/subscription.routes.js'
//routes decaleration
app.use('/api/v1/users', userRouter)
app.use('/api/v1/posts', postRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)
export { app }