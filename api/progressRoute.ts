import express from "express"
import { errorHandler } from "../config/errorHandler"
import { bookCollection, progressCollection, studentCollection } from "../config/database"
import { ObjectId, Document, AnyBulkWriteOperation } from "mongodb"
import { prepareForAssigningBook } from "./progressOperation"

const router = express.Router()

router.get("/:studentId", async (req, res, next) => {
    try {

        const stringId = req.params.studentId
        const objectId = ObjectId.createFromHexString(stringId)
        const result = await progressCollection.find({studentId: objectId}).toArray()
        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
})

router.post("/:studentId", async (req, res, next) => {
    try {
        const studentId = req.params.studentId
        const objectId = ObjectId.createFromHexString(studentId)
        const student = await studentCollection.findOne({_id: objectId})
        if (!student) {
            const error = new Error("Student Not Found")
            error.message = "NotFoundError"
            throw error
        }

        const { bookTitle } = req.body
        const book = await bookCollection.findOne({title: bookTitle})
        if (!book) {
            const error = new Error("Book Not Found")
            error.name = "NOT_FOUND_ERROR"
            throw error
        }

        const bulkProgressOperationArray: readonly AnyBulkWriteOperation<Document>[] = prepareForAssigningBook(objectId, book)
        // console.log("---- bulk operations:", JSON.stringify(bulkProgressOperationArray))
        const result = await progressCollection.bulkWrite(bulkProgressOperationArray, { ordered: false });

        res.status(200).json(result)

        // res.status(200).json()
    } catch (error) {
        next(error)
    }
})

router.patch("/:progressId", async (req, res, next) => {
    try {
        const stringId = req.params.progressId
        const objectId = ObjectId.createFromHexString(stringId)

        const { completed } = req.body
        console.log("---- completed:", completed)
        const result = await progressCollection.findOneAndUpdate(
            { _id: objectId },
            { $set: { completed } },
            { upsert: false, returnDocument: "after" }
        )

        if (!result) {
            const error = new Error("No Result")
            error.name = "BadRequestError"
            throw error
        }

        console.log(result.completed)

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler);

export default router
