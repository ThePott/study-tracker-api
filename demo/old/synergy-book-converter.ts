import fs from 'fs';
import path from "path";

interface QuestionGroup {
    groupId: string;
    group: string;
    memo: string | null;
}

interface Step {
    stepId: string;
    title: string;
    questionGroupArray: QuestionGroup[];
}

interface Topic {
    topicId: string;
    title: string;
    stepArray: Step[];
}

interface Book {
    title: string;
    topicArray: Topic[];
}


const filePath = path.join(process.cwd(), 'demo/raw', 'synergy-progress.txt');
const rawData = fs.readFileSync(filePath, 'utf8');
const rowArray: string[] = rawData.split("\n");

const bookTitle = "마플 시너지 수학(상)"

const idOperation = {
    topicIdIndex: 0,
    stepIdIndex: 0,
    groupIdIndex: 0,

    getTopicId(doUpdate: boolean = false) {
        this.topicIdIndex += doUpdate ? 1 : 0
        const result = `${bookTitle} __topic${this.topicIdIndex}`
        return result
    },

    getStepId(doUpdate: boolean = false) {
        this.stepIdIndex += doUpdate ? 1 : 0
        const result = `${this.getTopicId()} __step${this.stepIdIndex}`
        return result
    },

    updateAndGetGroupId() {
        this.groupIdIndex++
        const result = `${this.getStepId()} __group${this.groupIdIndex}`
        return result
    }
}

const convertToBook = (): Book => {
    const book: Book = {
        title: bookTitle,
        topicArray: []
    };

    const [ , firstTopicTitle, firstStepTitle, ] = rowArray[0].split("\t")

    let currentTopic: Topic = { 
        topicId: idOperation.getTopicId(true), 
        title: firstTopicTitle, 
        stepArray: []
    }

    let currentStep: Step = { 
        stepId: idOperation.getStepId(true),
        title: firstStepTitle, 
        questionGroupArray: [] 
    }

    for (const row of rowArray) {
        if (!row.trim()) continue; // Skip empty rows

        const columnArrayInRow = row.split("\t");
        const [group, topicTitle, stepTitle, memo] = columnArrayInRow;

        const isNewTopic = topicTitle && currentTopic.title !== topicTitle
        const isNewStep = stepTitle && currentStep.title !== stepTitle

        if (!group) { continue }
        const questionGroup: QuestionGroup = { 
            groupId: idOperation.updateAndGetGroupId(),
            group,
            memo: memo ?? null
        }

        if (isNewStep) {
            currentTopic.stepArray.push({...currentStep})
            currentStep = { 
                stepId: idOperation.getStepId(true),
                title: stepTitle, 
                questionGroupArray: []
            }
        }
        currentStep.questionGroupArray.push({...questionGroup})

        if (isNewTopic) {
            book.topicArray.push({...currentTopic})
            currentTopic = { 
                topicId: idOperation.getTopicId(true),
                title: topicTitle,
                stepArray: []
            }
        } 
        currentTopic.stepArray.push({...currentStep})

        console.log("---- book object:", book)
    }

    return book;
};

export default convertToBook;

// convertToBook()
