import { ObjectId, WithId, Document } from "mongodb"

const throwErrorIfFalsy = (id: any) => {
    if (id) { return }
    const error = new Error()
    error.name = "BadRequestError"
    error.message = "Empty Id"

    throw error
}

const prepareForAssigningBook = (studentObjectId: ObjectId, book: WithId<Document>) => {
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
                    whenToDo: "IN_CLASS", // or "HOMEWORK"
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
    console.log(bulkProgressOperation)
    return bulkProgressOperation;
};

export { prepareForAssigningBook }
