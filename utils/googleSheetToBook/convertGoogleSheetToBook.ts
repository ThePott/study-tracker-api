import fs from 'fs';
import path from "path";

const filePath = path.join(process.cwd(), 'demo/raw', 'synergy-progress.txt');
const rawData = fs.readFileSync(filePath, 'utf8');
const rowArray: string[] = rawData.split("\n");

interface Atom { topic: string; topicId: string; step: string; stepId: string; group: string; groupId: string; }

const operation = {
  topicIdIndex: 0,
  stepIdIndex: 0,
  groupIdIndex: 0,
  atomArray: [] as Atom[],

  makeIds(bookTitle: string, splitArray: string[]) {
    const [group, topic, step, memo] = splitArray
    if (topic) { this.topicIdIndex += 1 }
    if (step) { this.stepIdIndex += 1 }
    this.groupIdIndex += 1

    const topicId = `${bookTitle} __topic${this.topicIdIndex}`
    const stepId = `${topicId} __step${this.stepIdIndex}`
    const groupId = `${stepId} __group${this.groupIdIndex}`

    const atom = { topic, topicId, step, stepId, group, groupId }

    this.atomArray.push(atom)
  }
}

export const convertGoogleSheetToBook = (bookTitle: string) => {
  rowArray.forEach((row) => {
    const splitArray = row.split("\t")
    if (splitArray.length !== 4) { return }
    operation.makeIds(bookTitle, splitArray)
  })

  const atomArray = operation.atomArray
  const groupedByStepId = Object.groupBy(atomArray, ({ stepId }) => stepId)
  const groupedByStepIdValueArray = Object.values(groupedByStepId)
  const groupedByTopicId = Object.groupBy(groupedByStepIdValueArray, (groupedByStepIdValue) => groupedByStepIdValue ? groupedByStepIdValue[0].topicId : "")
  const groupedByTopicIdValueArray = Object.values(groupedByTopicId)
  const result = groupedByTopicIdValueArray.reduce((acc, cur) => {
    if (!cur || !cur[0] || !cur[0][0]) return acc

    const stepArray = cur.reduce((secondaryAcc, secondaryCur) => {
      if (!secondaryCur || !secondaryCur[0]) return secondaryAcc

      const questionGroupArray = secondaryCur.reduce((tertiaryAcc, tertiaryCur) => {
        const { group, groupId } = tertiaryCur
        return [...tertiaryAcc, { group, groupId }]
      }, [] as any[])

      const step = {
        title: secondaryCur[0].step,
        stepId: secondaryCur[0].stepId,
        questionGroupArray: questionGroupArray
      }
      return [...secondaryAcc, step]
    }, [] as any[])

    const topic = {
      title: cur[0][0].topic,
      topicId: cur[0][0].topicId,
      stepArray: stepArray
    }
    return [...acc, topic]
  }, [] as any[])

  console.log(JSON.stringify(result))

  const book = {
    title: bookTitle,
    topicArray: result
  }

  return book
};



// convertGoogleSheetToBook("마플 시너지 수학(상)")
/**
npx ts-node utils/convertGoogleSheetToBook/convertconvertGoogleSheetToBook.ts
 */
