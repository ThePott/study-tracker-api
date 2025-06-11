import dotenv from "dotenv"
import express from "express"
import http from "http"
import studentRoute from "./api/studentRoute"
dotenv.config()

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.get("/", (req, res) => {
    console.log("----- connected to client -----")
    res.send("Hello, welcome to my application!");
})

app.use("/student", studentRoute)

const port = process.env.PORT || 3030
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})