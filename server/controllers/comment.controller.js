import pool from '../database.js'

const createComment = async (req, res) => {
    try {
        const { userId, postId } = req.params;
        const { text, userPostId } = req.body;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const commentResult = await pool.query(
            'INSERT INTO comments (user_id, post_id, text) VALUES ($1, $2, $3) RETURNING *',
            [userId, postId, text]
        )

        if (userId != userPostId) {
            const notificationLike = await pool.query(
                'INSERT INTO notifications (by_user_id, to_user_id, post_id, type) VALUES ($1, $2, $3, $4)',
                [userId, userPostId, postId, 'comment']
            )
        }

        return res.status(201).json({
            data: commentResult.rows[0],
            message: 'Commented successfully!'
        })

    } catch (error) {

        res.status(500).json({ error: 'Failed to create a comment' });

    }
}

const commentsOnPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const comments = await pool.query('SELECT comments.text, comments.user_id, users.name, users.username FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE comments.post_id = $1', [postId])

        res.status(201).json({
            data: comments.rows,
            message: 'Comments on post'
        })

    } catch (error) {

        res.status(500).json({ error: 'Failed to fetch comments' });

    }
}

export default { createComment, commentsOnPost }