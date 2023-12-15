import pkg from 'pg'
const { Client } = pkg
import dotenv from 'dotenv'

dotenv.config()

// const pool = new Client({
//     user: 'postgres', // PostgreSQL username
//     host: 'localhost', // PostgreSQL host
//     database: 'postgres', // Database name you created in pgAdmin4
//     password: 'Rudra0214@PG', // PostgreSQL password
//     port: 5432, // PostgreSQL port
// })

const pool = new Client({
    user: process.env.PG_USERNAME, // PostgreSQL username
    host: process.env.PG_HOST, // PostgreSQL host
    database: process.env.PG_DATABASE, // Database name you created in pgAdmin4
    password: process.env.PG_PASSWORD, // PostgreSQL password
    port: process.env.PG_PORT, // PostgreSQL port
})

export default pool;