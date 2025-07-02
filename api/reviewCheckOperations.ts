import { ObjectId, WithId } from "mongodb";
import { ReviewCheckData, ReviewCheckIdStatusDict } from "../interfaces/interfaces";

const prepareUpdatingReviewCheck = (studentObjectId: ObjectId, reviewCheckIdStatusDictArray: ReviewCheckIdStatusDict[]) => {
    const bulkOperation = []

    for (const reviewCheckIdStatusDict of reviewCheckIdStatusDictArray) {
        const stringId = reviewCheckIdStatusDict.reviewCheckId
        console.log("---- review check id:", stringId, reviewCheckIdStatusDict, reviewCheckIdStatusDictArray)
        const objectId = ObjectId.createFromHexString(stringId)

        const status = reviewCheckIdStatusDict.status

        const operation = {
            updateOne: {
                // filter: { _id: objectId },
                filter: { _id: objectId, studentId: studentObjectId },
                update: { $set: { status } },
                upsert: false // This will insert if document doesn't exist
            }
        }

        bulkOperation.push(operation)
    }

    return bulkOperation
}

const groupReviewCheck = (reviewCheckArray: WithId<ReviewCheckData>[]) => {
    const groupedBookObject = Object.groupBy(
        reviewCheckArray,
        ({ bookTitle }) => bookTitle
    );
    const bookTitleArray = Object.keys(groupedBookObject)

    return { bookTitleArray, groupedBookObject }
}

export { prepareUpdatingReviewCheck, groupReviewCheck }

function useRef<T>(arg0: null) {
    throw new Error("Function not implemented.");
}
