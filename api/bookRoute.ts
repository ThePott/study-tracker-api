import express from "express"
import { errorHandler } from "../config/errorHandler"
import { bookCollection, progressCollection, studentCollection } from "../config/database"
import { ObjectId } from "mongodb"

import convertToBook from "../demo/old/synergy-book-converter"
import { convertGoogleSheetToBook } from "../utils/googleSheetToBook/convertGoogleSheetToBook"

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        const result = await bookCollection.find({}).toArray()
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})
router.get("/:id", async (req, res, next) => {
    try {
        const stringId = req.params.id
        const objectId = ObjectId.createFromHexString(stringId)
        const result = await bookCollection.findOne({ _id: objectId })
        if (!result) {
            const error = new Error("Book Not Found")
            error.name = "NotFoundError"
            throw error
        }
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.post("/old-development", async (req, res, next) => {
    try {
        const { title, topicArray } = req.body
        // const result = await bookCollection.insertOne({title, topicArray})
        const result = await bookCollection.findOneAndUpdate(
            { title },
            { $set: { topicArray } },
            { upsert: true }
        )

        res.status(200).json({ message: "inserted book", result })
    } catch (error) {
        next(error)
    }
})

router.post("/development", async (req, res, next) => {
    try {
        const book = convertGoogleSheetToBook("마플 시너지 수학(상)")
        // const { title, topicArray } = book

        const result = await bookCollection.insertOne(book)

        console.log("---- synergy result:", result)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.delete("/:bookId", async (req, res, next) => {
    try {
        const stringId = req.params.bookId
        const objectId = ObjectId.createFromHexString(stringId)
        const result = await bookCollection.findOneAndDelete({_id: objectId})

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler);

export default router
