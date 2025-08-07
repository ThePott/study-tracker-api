import dotenv from "dotenv"
dotenv.config()

import express from "express"
import http from "http"
import cors from "cors"  // Add this import

import studentRoute from "./api/studentRoute"
import bookRoute from "./api/bookRoute"
import progressRoute from "./api/progressRoute"
import reviewCheckRoute from "./api/reviewCheckRoute"


const app = express()
const server = http.createServer(app)

// Add CORS middleware BEFORE other middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Your frontend URLs
    credentials: true,
    methods: ['GET', 'POST', 'PUT', "PATCH", 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.get("/", (req, res) => {
    console.log("----- connected to client -----")
    res.send("Hello, welcome to my application!");
})

app.use("/student", studentRoute)
app.use("/book", bookRoute)
app.use("/progress", progressRoute)
app.use("/review-check", reviewCheckRoute)

const port = process.env.PORT || 3030
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})