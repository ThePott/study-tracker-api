import { ObjectId, WithId, Document, AnyBulkWriteOperation } from "mongodb"
import { CompletedDict, InProgressStatus, InProgressStatusDict } from "../interfaces/interfaces"

const throwErrorIfFalsy = (id: any) => {
    if (id) { return }
    const error = new Error()
    error.name = "BadRequestError"
    error.message = "Empty Id"

    throw error
}

export const prepareForAssigningBook = (studentObjectId: ObjectId, book: WithId<Document>) => {
    const bulkProgressOperation = [];

    // Extract book ID (use the _id from the book document)
    const bookId = book._id;
    throwErrorIfFalsy(bookId)

    // Iterate through all topics
    for (const topic of book.topicArray) {
        const topicId = topic.topicId;
        throwErrorIfFalsy(topicId)

        // Iterate through all steps in the topic
        for (const step of topic.stepArray) {
            const stepId = step.stepId;
            throwErrorIfFalsy(stepId)

            // Iterate through all question groups in the step
            for (const questionGroup of step.questionGroupArray) {
                const groupId = questionGroup.groupId;
                throwErrorIfFalsy(groupId)

                // Create progress record for each group
                const progressWithoutGroupId = {
                    studentId: studentObjectId,
                    bookId: bookId,
                    topicId: topicId,
                    stepId: stepId,
                    // groupId: groupId,

                    // Current MVP fields with default values
                    completed: "NOT_STARTED",
                    // whenToDo: "IN_CLASS", // or "HOMEWORK"
                    inProgressStatus: "TODAY_WORK",
                    doNeedToAsk: false,
                };

                const operation = {
                    updateOne: {
                        filter: { groupId },
                        update: { $set: { groupId, ...progressWithoutGroupId } },
                        upsert: true // This will insert if document doesn't exist
                    }
                }

                bulkProgressOperation.push(operation);
            }
        }
    }
    return bulkProgressOperation;
};

export const prepareUpdatingInProgressStatus = (studentObjectId: ObjectId, inProgressStatusDict: InProgressStatusDict): readonly AnyBulkWriteOperation<Document>[] => {
    const bulkOperation = [] as AnyBulkWriteOperation<Document>[]

    const entries = Object.entries(inProgressStatusDict)
    entries.forEach((entry) => {
        const stringId = entry[0]
        const objectId = ObjectId.createFromHexString(stringId)

        const inProgressStatus = entry[1]

        const operation = {
            updateOne: {
                filter: { _id: objectId, studentId: studentObjectId },
                update: { $set: { inProgressStatus } },
                upsert: false // This will insert if document doesn't exist
            }
        }

        bulkOperation.push(operation)
    })
    return bulkOperation
}

export const prepareUpdatingCompleted = (studentObjectId: ObjectId, completedDict: CompletedDict): readonly AnyBulkWriteOperation<Document>[] => {
    const bulkOperation = [] as AnyBulkWriteOperation<Document>[]

    const entries = Object.entries(completedDict)
    entries.forEach((entry) => {
        const stringId = entry[0]
        const objectId = ObjectId.createFromHexString(stringId)

        const completed = entry[1]

        const operation = {
            updateOne: {
                filter: { _id: objectId, studentId: studentObjectId },
                update: { $set: { completed } },
                upsert: false // This will insert if document doesn't exist
            }
        }

        bulkOperation.push(operation)
    })
    return bulkOperation
}
