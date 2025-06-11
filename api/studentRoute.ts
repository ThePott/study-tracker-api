import express from "express"
import { errorHandler } from "../config/errorHandler"
import { studentCollection, progressCollection, bookCollection } from "../config/database"
import { AnyBulkWriteOperation, ObjectId, Document } from "mongodb"

import { prepareForAssigningBook } from "./studentOperation"

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

router.get("/:id/progress", async (req, res, next) => {
    try {
        const studentIdString = req.params.id
        console.log(`---- length: ${studentIdString.length} "${studentIdString}"`)
        const studentId = ObjectId.createFromHexString(studentIdString)
        // const student = await studentCollection.findOne({ _id })

        const progressArray = await progressCollection.find({ studentId }).toArray()

        res.status(200).json(progressArray)

    } catch (error) {
        next(error)
    }
})

router.post("/:id/progress", async (req, res, next) => {
    try {
        const studentIdString = req.params.id
        const studentId = ObjectId.createFromHexString(studentIdString)

        const { bookIdString } = req.body
        const bookId = ObjectId.createFromHexString(bookIdString)
        const book = await bookCollection.findOne({ _id: bookId })
        if (!book) {
            const error = new Error("Book Not Found")
            error.name = "NOT_FOUND_ERROR"
            throw error
        }

        const bulkProgressOperationArray: readonly AnyBulkWriteOperation<Document>[] = prepareForAssigningBook(studentId, book)
        // const 
        const result = await progressCollection.bulkWrite(bulkProgressOperationArray, { ordered: false });

        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
})














router.use(errorHandler);

export default router
