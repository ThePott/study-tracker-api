import express from "express"
import { errorHandler } from "../config/errorHandler"

const router = express.Router()

router.get("/test1", async (req, res, next) => {
    try {
        console.log("test1 called")
        res.status(200).json({ message: "test 1 called" })
    } catch (error) {
        next(error)
    }
})

router.get("/test2", async (req, res, next) => {
    try {
        res.status(200).json({ message: "test 2 called" })
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler);

export default router
