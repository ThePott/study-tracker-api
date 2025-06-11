
import { MongoClient, ServerApiVersion } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) { console.log("FUUUUUUUUCKKKKK")}


const client = new MongoClient(uri!, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
})
const db = client.db("StudyTrackerDb")
const bookCollection = db.collection("bookCollection")
const studentCollection = db.collection("studentCollection")
const progressCollection = db.collection("progressCollection")

export { client, db, bookCollection, progressCollection, studentCollection }
