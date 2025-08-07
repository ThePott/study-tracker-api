import { ObjectId } from "mongodb";

export const checkboxStatusArray = ["DONE", "PASS", "WRONG", "CORRECT", "NOT_SOLVED"] as const;
export type CheckboxStatus = typeof checkboxStatusArray[number]


export interface ReviewCheckIdStatusDict {
    reviewCheckId: string;
    status: CheckboxStatus
}

export interface ReviewCheckData {
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

export const completedStatusArray = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as const;
export type CompletedStatus = typeof completedStatusArray[number]; // "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"

export const inProgressStatusArray = ["PREV_HOMEWROK", "TODAY_WORK", "NEXT_HOMEWORK"]
export type InProgressStatus = typeof inProgressStatusArray[number]

export interface ProgressData {
  studentId: ObjectId;
  bookId: ObjectId;
  topicId: string;
  stepId: string;
  groupId: string;

  completed: CompletedStatus; // adjust based on possible values
  inProgressStatus: InProgressStatus
  doNeedToAsk: boolean;
  // whenToDo: WhenToDo // adjust based on possible values
}

export type InProgressStatusDict = Record<string, InProgressStatus>

export type CompletedDict = Record<string, CompletedStatus>

export interface QuestionGroup {
  group: string;
  groupId: string;
}

export interface Step {
  title: string;
  questionGroupArray: QuestionGroup[];
  stepId: string;
}

export interface Topic {
  title: string;
  stepArray: Step[];
  topicId: string;
}

export interface BookData {
  _id: string;
  title: string;
  topicArray: Topic[];
}
