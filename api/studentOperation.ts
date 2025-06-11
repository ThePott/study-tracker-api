import { ObjectId, WithId } from "mongodb"

interface Document {
    [key: string]: any;
}

const prepareForAssigningBook = (studentId: ObjectId, book: WithId<Document>) => {
    console.log(studentId, book)
}

export { prepareForAssigningBook }