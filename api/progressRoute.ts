import express from "express"
import { errorHandler } from "../config/errorHandler"
import { bookCollection, progressCollection, studentCollection } from "../config/database"
import { ObjectId } from "mongodb"

const router = express.Router()

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
