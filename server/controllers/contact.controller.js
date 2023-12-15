import pool from "../database.js";

const allContacts = async (req, res) => {
    try {

        const token = req.headers.authorization
        const isAdmin = req.headers.isadmin

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        if (!isAdmin) {
            return res.status(401).json({ message: 'Unauthorized - You are not the admin!' });
        }

        const contacts = await pool.query('SELECT * FROM contact_messages ORDER BY id')

        return res.status(201).json({
            data: contacts.rows,
            count: contacts.rowCount,
            message: 'All messages fetched!'
        })

    } catch (error) {

        res.status(500).json({ error: 'Failed to post your message' });

    }
}

const postContact = async (req, res) => {
    try {

        const { name, email, subject, message } = req.body;

        const postQuery = `INSERT INTO public.contact_messages(
        name, email, subject, message)
        VALUES($1, $2, $3, $4)`

        await pool.query(postQuery, [name, email, subject, message])
        return res.status(201).json({
            message: 'Your message has been sent!'
        })

    } catch (error) {
        res.status(500).json({ error: 'Failed to post your message' });
    }
}

export default { allContacts, postContact }