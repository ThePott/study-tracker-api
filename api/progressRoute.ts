import express from "express"
import { errorHandler } from "../config/errorHandler"
import { bookCollection, progressCollection, studentCollection } from "../config/database"
import { ObjectId, Document, AnyBulkWriteOperation } from "mongodb"
import { prepareForAssigningBook } from "./progressOperation"

const router = express.Router()

/** bookId인지, studentId 인지 헷갈릴 수 있다. 앞에 prefix를 넣든지 해야지 */
router.get("/:bookId/development", async (req, res, next) => {
    try {
        const bookStringId = req.params.bookId
        const bookObjectId = ObjectId.createFromHexString(bookStringId)
        const book = await bookCollection.findOne({ _id: bookObjectId })

        if (!book) { throw new Error("---- Book Not Found") }
        // Extract groupId and group pairs
        const result = book.topicArray.flatMap((topic: any) =>
            topic.stepArray.flatMap((step: any) =>
                step.questionGroupArray.map((questionGroup: any) => ({
                    groupId: questionGroup.groupId,
                    group: questionGroup.group
                }))
            )
        )

        res.json({ message: "so far so good", result })
    } catch (error) {
        next(error)
    }
})

router.get("/student/:studentId", async (req, res, next) => {
    try {

        const stringId = req.params.studentId
        const objectId = ObjectId.createFromHexString(stringId)
        const result = await progressCollection.find({ studentId: objectId }).toArray()
        
        const book = await bookCollection.findOne({title: "마플 시너지 수학(상)"})
        // console.table(book)
        console.table(result)
        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
})

/** 사용할 일이 있나? */
router.get("/:studentId/:bookId", async (req, res, next) => {
    try {

        const studentStringId = req.params.studentId
        const studentObjectId = ObjectId.createFromHexString(studentStringId)

        const bookStringId = req.params.bookId
        const bookObjectId = ObjectId.createFromHexString(bookStringId)
        const result = await progressCollection.find({
            studentId: studentObjectId,
            bookId: bookObjectId,
        }).toArray()
        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
})

router.post("/:studentId", async (req, res, next) => {
    try {
        const studentId = req.params.studentId
        const objectId = ObjectId.createFromHexString(studentId)
        const student = await studentCollection.findOne({ _id: objectId })
        if (!student) {
            const error = new Error("Student Not Found")
            error.message = "NotFoundError"
            throw error
        }

        const { bookTitle } = req.body
        const book = await bookCollection.findOne({ title: bookTitle })
        if (!book) {
            const error = new Error("Book Not Found")
            error.name = "NOT_FOUND_ERROR"
            throw error
        }

        const bulkProgressOperationArray: readonly AnyBulkWriteOperation<Document>[] = prepareForAssigningBook(objectId, book)
        const result = await progressCollection.bulkWrite(bulkProgressOperationArray, { ordered: true });

        res.status(200).json(result)
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

router.delete("/book/:bookId/development", async (req, res, next) => {
    try {
        const bookStringId = req.params.bookId
        const bookObjectId = ObjectId.createFromHexString(bookStringId)

        const result = await progressCollection.deleteMany({bookId: bookObjectId})
        res.status(200).json(result)
    } catch(error) {
        next(error)
    } 
})

router.use(errorHandler);

export default router
