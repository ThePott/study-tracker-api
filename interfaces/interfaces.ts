const checkboxStatusArray = ["DONE", "PASS", "WRONG", "CORRECT", "NOT_YET"] as const;

interface ReviewCheckIdStatusDict {
    reviewCheckId: string;
    status: typeof checkboxStatusArray[number];
}

export { checkboxStatusArray, ReviewCheckIdStatusDict }