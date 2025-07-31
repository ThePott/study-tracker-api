import { Document, ObjectId, WithId } from "mongodb";


const prepareForAssigningBook = (studentId: ObjectId, book: WithId<Document>) => {
    const bulkProgressOperation = [];

    // Extract book ID (use the _id from the book document)
    const bookId = book._id;

    // Iterate through all topics
    for (const topic of book.topicArray) {
        const topicId = topic.topicId;

        // Iterate through all steps in the topic
        for (const step of topic.stepArray) {
            const stepId = step.stepId;

            // Iterate through all question groups in the step
            for (const questionGroup of step.questionGroupArray) {
                const groupId = questionGroup.groupId;

                // Create progress record for each group
                const progressWithoutGroupId = {
                    studentId: studentId,
                    bookId: bookId,
                    topicId: topicId,
                    stepId: stepId,
                    // groupId: groupId,

                    // Current MVP fields with default values
                    completed: "NOT_STARTED",
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
    console.log(bulkProgressOperation)
    return bulkProgressOperation;
};

export { prepareForAssigningBook };
