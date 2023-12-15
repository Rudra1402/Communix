import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import pool from './database.js'
import routes from './routes/route.js'

dotenv.config()
const app = express()
const uri = process.env.MONGO_URI
const PORT = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(cookieParser())

pool.connect()
    .then(response => console.log("PostgreSQL Connected!"))
    .catch(err => console.log("Error: ", err.message))

// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(response => console.log("MongoDB Connected!"))
//     .catch(err => console.log("Error: ", err.message))

app.use('/api', routes)

app.listen(PORT, () => console.log("Server running on PORT:" + PORT));