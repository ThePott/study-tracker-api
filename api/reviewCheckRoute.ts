import express from "express"
import { ObjectId, WithId } from "mongodb"
import { reviewCheckCollection, studentCollection } from "../config/database"
import { errorHandler } from "../config/errorHandler"
import convertToJson from "../demo/reviewCheckConverter"
import { ReviewCheckData } from "../interfaces/interfaces"
import { groupReviewCheck, prepareUpdatingReviewCheck } from "./reviewCheckOperations"
const router = express.Router()

router.post("/:studentId/development", async (req, res, next) => {
    try {
        const stringId = req.params.studentId
        const objectId = ObjectId.createFromHexString(stringId)
        const student = await studentCollection.findOne({ _id: objectId })
        if (!student) {
            const error = new Error("404")
            error.name = "NotFoundError"
            throw error
        }

        const convertedJson: ReviewCheckData[] = convertToJson(objectId)
        const bulkOperation = convertedJson.map((data) => ({
            insertOne: {
                document: data
            }
        }));

        const result = await reviewCheckCollection.bulkWrite(bulkOperation, { ordered: true })


        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.get("/", async (req, res, next) => {
    try {
        const result = await reviewCheckCollection.find({}).toArray()

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.get("/:studentId", async (req, res, next) => {
    try {
        const stringId = req.params.studentId
        const objectId = ObjectId.createFromHexString(stringId)

        const result = await reviewCheckCollection.find({ studentId: objectId }).toArray() as WithId<ReviewCheckData>[]
        const { bookTitleArray, groupedBookObject } = groupReviewCheck(result)
        res.status(200).json({ bookTitleArray, groupedBookObject })
    } catch (error) {
        next(error)
    }
})

router.delete("/:studentId", async (req, res, next) => {
    try {
        const studentId = req.params.studentId
        const result = await reviewCheckCollection.deleteMany({ studentId })
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.patch("/:studentId", async (req, res, next) => {
    try {
        console.log("---- patch requested")
        const stringId = req.params.studentId
        const objectId = ObjectId.createFromHexString(stringId)
        const student = await studentCollection.findOne({ _id: objectId })
        if (!student) {
            const error = new Error("Student not found")
            error.name = "NotFoundError"  // Optional but helpful for error handling
            throw error
        }

        const reviewCheckIdStatusDictArray = req.body
        if (!reviewCheckIdStatusDictArray || reviewCheckIdStatusDictArray.length === 0) {
            const error = new Error("Missing review check id array")
            error.name = "BadRequestError"
            throw error
        }

        const bulkOperation = prepareUpdatingReviewCheck(objectId, reviewCheckIdStatusDictArray)

        const result = await reviewCheckCollection.bulkWrite(bulkOperation, { ordered: true })
        // console.log("---- bulk:", bulkOperation)
        // res.status(200).json({bulkOperation})
        res.status(200).json({ result })
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler);

export default router
