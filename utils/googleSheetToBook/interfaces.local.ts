
export interface QuestionGroup {
    groupId: string;
    group: string;
    memo: string | null;
}

export interface Step {
    stepId: string;
    title: string;
    questionGroupArray: QuestionGroup[];
}

export interface Topic {
    topicId: string;
    title: string;
    stepArray: Step[];
}

export interface Book {
    title: string;
    topicArray: Topic[];
}