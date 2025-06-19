import express from "express"
import { errorHandler } from "../config/errorHandler"
import { bookCollection, progressCollection, studentCollection, reviewCheckCollection } from "../config/database"
import { ObjectId } from "mongodb"
import convertToJson, { ReviewCheckData } from "../demo/reviewCheckConverter"
const router = express.Router()

router.post("/", async (req, res, next) => {
    try {
        console.log("----here")
        const { studentId } = req.body
        const objectId = ObjectId.createFromHexString(studentId)
        const student = await studentCollection.findOne({ _id: objectId })
        if (!student) {
            const error = new Error("404")
            error.name = "NotFoundError"
            throw error
        }

        const convertedJson: ReviewCheckData[] = convertToJson(studentId)
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
        const studentId = req.params.studentId

        const result = await reviewCheckCollection.find({studentId: studentId}).toArray()
        // console.log("---- second", result.length)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler);

export default router
