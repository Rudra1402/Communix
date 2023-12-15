import pool from "../database.js";

const postReport = async (req, res) => {
    try {

        const { postId, reportedTo, reportedBy, desc } = req.body;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const reportQuery = `INSERT INTO public.reports (post_id, reportedto_id, reportedby_id, description) VALUES($1, $2, $3, $4)`

        const newReport = await pool.query(reportQuery, [postId, reportedTo, reportedBy, desc])

        return res.status(201).json({
            message: 'Report submitted successfully!'
        })

    } catch (error) {
        res.status(500).json({ error: 'Failed to submit the report!' });
    }
}

const allReports = async (req, res) => {
    try {

        const token = req.headers.authorization
        const isAdmin = req.headers.isadmin

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        if (!isAdmin) {
            return res.status(401).json({ message: 'Unauthorized - You are not the admin!' });
        }

        const reportsQuery = 'SELECT r.description, rby.name AS by_name, rto.name AS to_name, p.title FROM reports r JOIN users rby ON rby.id = r.reportedby_id JOIN users rto ON rto.id = r.reportedto_id JOIN posts p ON p.id = r.post_id ORDER BY r.id DESC'

        const reports = await pool.query(reportsQuery)

        return res.status(201).json({
            data: reports.rows,
            count: reports.rowCount,
            message: 'All messages fetched!'
        })

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the reports!' });
    }
}

export default { postReport, allReports }