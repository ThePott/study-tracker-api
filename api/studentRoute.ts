import express from "express"
import { AnyBulkWriteOperation, Document, ObjectId } from "mongodb"
import { bookCollection, progressCollection, studentCollection } from "../config/database"
import { errorHandler } from "../config/errorHandler"

import { prepareUpdatingCompleted, prepareUpdatingInProgressStatus } from "./progressOperation"
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

// router.post("/development", async (req, res, next) => {
//     try {
//         const sampleNameArray = [
//             "김민준", "이서준", "박도현", "최주원", "정하준",
//             "강시우", "윤예준", "장지호", "임건우", "한도윤",
//             "김채원", "이지민", "박서연", "최예은", "정소율",
//             "강하은", "윤서진", "장윤서", "임채은", "한지우"
//         ]

//         interface StudentDocument {
//             name: string
//         }

//         const documentArray: StudentDocument[] = sampleNameArray.reduce(
//             (acc, name) => {
//                 return [...acc, { name }]
//             },
//             [] as StudentDocument[]
//         )

//         const result = await studentCollection.insertMany(documentArray)

//         res.status(200).json(result)
//     } catch (error) {
//         next(error)
//     }
// })

router.get("/", async (req, res, next) => {
    try {
        const result = await studentCollection.find({}).toArray()
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

/** /progress/student/:studentId로 대체 */
// router.get("/:id/progress", async (req, res, next) => {
//     try {
//         const studentIdString = req.params.id
//         // console.log(`---- length: ${studentIdString.length} "${studentIdString}"`)
//         const studentId = ObjectId.createFromHexString(studentIdString)
//         // const student = await studentCollection.findOne({ _id })

//         const progressArray = await progressCollection.find({ studentId }).toArray()

//         res.status(200).json(progressArray)

//     } catch (error) {
//         next(error)
//     }
// })

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
        const result = await progressCollection.bulkWrite(bulkProgressOperationArray, { ordered: true });

        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
})

router.patch("/:id/progress/in-progress-status", async (req, res, next) => {
    try {
        const studentIdString = req.params.id
        const studentId = ObjectId.createFromHexString(studentIdString)

        const { inProgressStatusDict } = req.body

        const bulkOperation = prepareUpdatingInProgressStatus(studentId, inProgressStatusDict)

        const result = await progressCollection.bulkWrite(bulkOperation, { ordered: true })


        res.status(200).json({result})
    } catch (error) {
        next(error)
    }
})

router.patch("/:id/progress/completed", async (req, res, next) => {
    try {
        const studentIdString = req.params.id
        const studentId = ObjectId.createFromHexString(studentIdString)

        const { completedDict } = req.body

        const bulkOperation = prepareUpdatingCompleted(studentId, completedDict)

        const result = await progressCollection.bulkWrite(bulkOperation, { ordered: true })


        res.status(200).json({result})
    } catch (error) {
        next(error)
    }
})

// router.delete("/:id/progressClear/development", async (req, res, next) => {
//     try {
//         console.log("---- here")
//         const studentIdString = req.params.id
//         const studentId = ObjectId.createFromHexString(studentIdString)

//         const result = await progressCollection.deleteMany({ studentId })

//         console.log("---- clear progress result:", result)
        
//         res.status(200).json(result)
//     } catch (error) {
//         next(error)
//     }
// })














router.use(errorHandler);

export default router
