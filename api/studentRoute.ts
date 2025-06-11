import express from "express"
import { errorHandler } from "../config/errorHandler"
import { studentCollection } from "../config/database"

const router = express.Router()

router.post("/", async (req, res, next) => {
    try {
        const { name } = req.body
        const result = await studentCollection.insertOne({ name })
        res.status(200).json({ result })
    } catch (error) {
        next(error)
    }
})

router.get("/", async (req, res, next) => {
    try {
        const result = await studentCollection.find({}).toArray()
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler);

export default router
