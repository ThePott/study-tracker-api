import express from "express"
import { errorHandler } from "../config/errorHandler"
import { bookCollection, progressCollection, studentCollection } from "../config/database"

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        const result = await bookCollection.find({}).toArray()

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.post("/", async (req, res, next) => {
    try {
        const existingBookArray = await bookCollection.find({}).toArray()
        
        
        console.log(req.body)
        const { title, topicArray } = req.body
        // const result = await bookCollection.insertOne({title, topicArray})
        const result = await bookCollection.findOneAndUpdate(
            { title },
            {$set: { topicArray }, upsert: true},
        )

        res.status(200).json({ message: "inserted book", result})
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler);

export default router
