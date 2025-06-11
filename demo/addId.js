const convertToBook = require("./convert.js")

// console.log(convertToBook())
const book = convertToBook()

function addIdsToBook(book) {
  // Create a copy to avoid mutating the original
  const bookWithIds = JSON.parse(JSON.stringify(book));
  
  let topicCounter = 1;
  let stepCounter = 1;
  let groupCounter = 1;
  
  // Process each topic
  bookWithIds.topicArray.forEach((topic) => {
    // Add topic ID
    topic.topicId = `${bookWithIds.title} __topic${topicCounter.toString().padStart(3, '0')}`;
    
    // Process each step in the topic
    topic.stepArray.forEach((step) => {
      // Add step ID
      step.stepId = `${topic.topicId} __step${stepCounter.toString().padStart(3, '0')}`;
      
      // Process each question group in the step
      step.questionGroupArray.forEach((group) => {
        // Add group ID
        group.groupId = `${step.stepId} __group${groupCounter.toString().padStart(3, '0')}`;
        
        groupCounter++;
      });
      
      stepCounter++;
    });
    
    topicCounter++;
  });
  
//   delete bookWithIds.title

  return bookWithIds;
}

module.exports = { addIdsToBook };
// module.exports = { addIdsToBook, addShortIdsToBook };

const bookWithIds = addIdsToBook(book);
console.log(JSON.stringify(bookWithIds, null, 2));