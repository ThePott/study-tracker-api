import * as fs from 'fs';
import { ObjectId } from 'mongodb';
import path from 'path';
import { ReviewCheckData, CheckboxStatus } from '../../interfaces/interfaces';



class ReviewType implements ReviewCheckData {
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

    constructor(row: string, studentId: ObjectId) {
        const columnArrayInRow = row.split('\t');
        const [
            ,               // unique_id
            bookTitle,      // 고쟁이 수학(상)
            topicTitle,     // [I] 01 다항식의 뜻과 연산
            stepTitle,      // STEP 1
            questionPage,   // 8
            questionNumber, // 1
        ] = columnArrayInRow;

        this.studentId = studentId;
        this.bookTitle = bookTitle;
        this.topicTitle = topicTitle;
        this.stepTitle = stepTitle;
        this.questionPage = questionPage;
        this.questionNumber = questionNumber;

        // ---- default
        this.reviewHandoutName = "raw";
        this.status = "NOT_SOLVED";
        this.isReviewed = false;
        this.createdAt = new Date();
    }
}

// const filePath = path.join(process.cwd(), 'demo', 'gojangi-review-check.txt');
const filePath = path.join(process.cwd(), 'demo/raw', 'synergy-review-check.txt');
const rawData = fs.readFileSync(filePath, 'utf8');

function convertToJson(studentId: ObjectId, reviewHandoutName: string = "raw"): ReviewCheckData[] {
    const lines = rawData.trim().split('\n').filter(line => line.trim());

    const resultObjectArray = lines.reduce((acc: ReviewCheckData[], row) => {
        const review = new ReviewType(row, studentId);
        acc.push(review);
        return acc;
    }, []);

    return resultObjectArray;
}

export default convertToJson;
// export { ReviewCheckData };
