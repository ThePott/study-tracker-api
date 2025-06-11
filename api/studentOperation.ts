import { ObjectId, WithId, Document } from "mongodb"


const prepareForAssigningBook = (studentId: ObjectId, book: WithId<Document>) => {
    const progressRecords = [];
    
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
                const progressRecord = {
                    studentId: studentId,
                    bookId: bookId,
                    topicId: topicId,
                    stepId: stepId,
                    groupId: groupId,
                    
                    // Current MVP fields with default values
                    completed: "NOT_STARTED",
                    whenToDo: "IN_CLASS", // or "HOMEWORK"
                    doNeedToAsk: false
                };
                
                progressRecords.push(progressRecord);
            }
        }
    }
    console.log(progressRecords)
    return progressRecords;
};

export { prepareForAssigningBook }