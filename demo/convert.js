const fs = require('fs');

const rawData = fs.readFileSync('./gojangi.txt', 'utf8');
const rowArray = rawData.split("\n");

const convertToBook = () => {

    const book = {
        title: "고쟁이 수(상)",
        topicArray: []
    };

    let currentTopic = null;
    let currentStep = null;
    let pendingRanges = []; // Store ranges without topic/step info

    for (const row of rowArray) {
        if (row.includes(" __ ")) {
            // This row has topic and step information
            const splitedArray = row.split(" __ ");
            const range = splitedArray[0];
            const topicTitle = splitedArray[1];
            const stepTitle = splitedArray[2];

            // Check if we need a new topic
            if (!currentTopic || currentTopic.title !== topicTitle) {
                currentTopic = {
                    title: topicTitle,
                    stepArray: []
                };
                book.topicArray.push(currentTopic);
            }

            // Check if we need a new step
            if (!currentStep || currentStep.title !== stepTitle) {
                currentStep = {
                    title: stepTitle,
                    questionGroupArray: []
                };
                currentTopic.stepArray.push(currentStep);
            }

            // Add any pending ranges to the current step
            for (const pendingRange of pendingRanges) {
                currentStep.questionGroupArray.push({
                    group: pendingRange
                });
            }
            pendingRanges = []; // Clear pending ranges

            // Add the current range
            currentStep.questionGroupArray.push({
                group: range
            });

        } else if (row.trim()) {
            // This row only has a range, store it for later
            pendingRanges.push(row.trim());
        }
    }

    // Add any remaining pending ranges to the last step
    if (currentStep && pendingRanges.length > 0) {
        for (const pendingRange of pendingRanges) {
            currentStep.questionGroupArray.push({
                group: pendingRange
            });
        }
    }

    // console.log(JSON.stringify(book, null, 2));
    // console.log("---- book", book)
    return book
}

module.exports = convertToBook