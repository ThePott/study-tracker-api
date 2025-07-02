import { ObjectId } from "mongodb";

const checkboxStatusArray = ["DONE", "PASS", "WRONG", "CORRECT", "NOT_SOLVED"] as const;
type CheckboxStatus = typeof checkboxStatusArray[number]


interface ReviewCheckIdStatusDict {
    reviewCheckId: string;
    status: CheckboxStatus
}

interface ReviewCheckData {
    studentId: ObjectId;
    bookTitle: string;
    topicTitle: string;
    stepTitle: string;
    questionPage: string;
    questionNumber: string;
    reviewHandoutName: string;
    status: CheckboxStatus;
    isReviewed: boolean;
    createdAt: Date;
}

export { checkboxStatusArray, CheckboxStatus, ReviewCheckIdStatusDict, ReviewCheckData }