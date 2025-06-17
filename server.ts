import dotenv from "dotenv"
dotenv.config()

import express from "express"
import http from "http"
import cors from "cors"  // Add this import

import studentRoute from "./api/studentRoute"
import bookRoute from "./api/bookRoute"


const app = express()
const server = http.createServer(app)

// Add CORS middleware BEFORE other middleware
app.use(cors({
    origin: ['http://localhost:5173'], // Your frontend URLs
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

const port = process.env.PORT || 3030
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})