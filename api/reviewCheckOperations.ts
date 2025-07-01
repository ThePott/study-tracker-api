import { ObjectId } from "mongodb";
import { ReviewCheckIdStatusDict } from "../interfaces/interfaces";

const prepareUpdatingReviewCheck = (studentObjectId: ObjectId, reviewCheckIdStatusDictArray: ReviewCheckIdStatusDict[]) => {
    const bulkOperation = []

    for (const reviewCheckIdStatusDict of reviewCheckIdStatusDictArray) {
        const stringId = reviewCheckIdStatusDict.id
        const objectId = ObjectId.createFromHexString(stringId)

        const status = reviewCheckIdStatusDict.status

        const operation = {
            updateOne: {
                filter: { _id: objectId },
                // filter: { _id: objectId, studentId: studentObjectId },
                update: { $set: { status } },
                upsert: false // This will insert if document doesn't exist
            }
        }

        bulkOperation.push(operation)
    }

    return bulkOperation
}

export { prepareUpdatingReviewCheck }