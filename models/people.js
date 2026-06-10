import mongoose from "mongoose";

const url = process.env.MONGODB_URI

mongoose.connect(url, {family: 4})
.then(() => console.log("Connected to MongoDB"))
.catch(error => console.log('Error connecting to MongoDB: ', error.message))

const peopleSchema = mongoose.Schema({
  name: String,
  number: String
})

const People = mongoose.model('People', peopleSchema)

export default People