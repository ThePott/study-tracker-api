const convertToBook = require("./convert.js")

// console.log(convertToBook())
const book = convertToBook()

function addIdsToBook(book) {
  // Create a copy to avoid mutating the original
  const bookWithIds = JSON.parse(JSON.stringify(book));
  
  // Add book ID if it doesn't exist
  if (!bookWithIds._id) {
    bookWithIds._id = generateBookId(bookWithIds.title);
  }
  
  let topicCounter = 1;
  let stepCounter = 1;
  let groupCounter = 1;
  
  // Process each topic
  bookWithIds.topicArray.forEach((topic) => {
    // Add topic ID
    topic.topicId = `${bookWithIds._id}_topic_${topicCounter.toString().padStart(3, '0')}`;
    
    // Process each step in the topic
    topic.stepArray.forEach((step) => {
      // Add step ID
      step.stepId = `${topic.topicId}_step_${stepCounter.toString().padStart(3, '0')}`;
      
      // Process each question group in the step
      step.questionGroupArray.forEach((group) => {
        // Add group ID
        group.groupId = `${step.stepId}_group_${groupCounter.toString().padStart(3, '0')}`;
        
        groupCounter++;
      });
      
      stepCounter++;
    });
    
    topicCounter++;
  });
  
  delete bookWithIds._id

  return bookWithIds;
}

function generateBookId(title) {
  // Generate a simple book ID from title
  // You can make this more sophisticated as needed
  const cleanTitle = title.replace(/[^a-zA-Z0-9가-힣]/g, '_').toLowerCase();
  return `book_${cleanTitle}`;
}

// // Alternative version with shorter IDs
// function addShortIdsToBook(book) {
//   const bookWithIds = JSON.parse(JSON.stringify(book));
  
//   if (!bookWithIds._id) {
//     bookWithIds._id = "book_001"; // Or generate based on your needs
//   }
  
//   let topicCounter = 1;
//   let stepCounter = 1;
//   let groupCounter = 1;
  
//   bookWithIds.topicArray.forEach((topic) => {
//     topic.topicId = `t${topicCounter.toString().padStart(2, '0')}`;
    
//     topic.stepArray.forEach((step) => {
//       step.stepId = `t${topicCounter.toString().padStart(2, '0')}_s${stepCounter.toString().padStart(2, '0')}`;
      
//       step.questionGroupArray.forEach((group) => {
//         group.groupId = `g${groupCounter.toString().padStart(3, '0')}`;
//         groupCounter++;
//       });
      
//       stepCounter++;
//     });
    
//     topicCounter++;
//   });
  
//   return bookWithIds;
// }

const bookWithIds = addIdsToBook(book);
console.log(JSON.stringify(bookWithIds, null, 2));


module.exports = { addIdsToBook };
// module.exports = { addIdsToBook, addShortIdsToBook };