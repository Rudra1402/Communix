import pool from "../database.js";

const createPost = async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, content } = req.body;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

        if (!user.rows.length) {
            throw new Error('User not found');
        }

        const insertQuery = `
            INSERT INTO posts (title, content, user_id)
            VALUES ($1, $2, $3)
        `;

        const values = [title, content, userId]
        await pool.query(insertQuery, values)
            .then(response => {
                return res.status(201).json({
                    data: response.rows[0],
                    message: 'Post created successfully!'
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message })
            })

    } catch (error) {

        res.status(500).json({ error: 'Failed to create a post' });

    }
}

const postsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }

        await pool.query('SELECT p.id, p.title, p.content, p.user_id, p.liked_users, p.created_at, u.username, u.email AS email, json_agg(c.*) AS comments FROM public.posts p INNER JOIN public.users u ON p.user_id = u.id LEFT JOIN public.comments c ON p.id = c.post_id WHERE p.user_id = $1 GROUP BY p.id, p.title, p.content, p.user_id, p.liked_users, p.created_at, u.username, u.email ORDER BY p.created_at DESC', [userId])
            .then(response => {
                return res.status(201).json({
                    data: response.rows,
                    message: 'Users posts fetched successfully!'
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message })
            })

    } catch (error) {

        res.status(500).json({ error: 'Failed to fetch posts' });

    }
}

const postById = async (req, res) => {
    try {
        const { postId } = req.params;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        await pool.query('SELECT * FROM posts WHERE id = $1', [postId])
            .then(response => {
                return res.status(201).json({
                    data: response.rows[0],
                    message: 'Post fetched successfully!'
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message })
            })

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}

const allPosts = async (req, res) => {
    try {

        const { search } = req.query;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const response = await pool.query('SELECT p.id, p.title, p.content, p.user_id, p.liked_users, p.created_at, u.username, u.email AS email, json_agg(c.*) AS comments FROM public.posts p INNER JOIN public.users u ON p.user_id = u.id LEFT JOIN public.comments c ON p.id = c.post_id WHERE p.title ILIKE $1 OR p.content ILIKE $1 GROUP BY p.id, p.title, p.content, p.user_id, p.liked_users, p.created_at, u.username, u.email ORDER BY p.created_at DESC', [`%${search}%`])

        return res.status(201).json({
            data: response.rows,
            count: response.rowCount,
            message: 'Posts fetched successfully!'
        })

    } catch (error) {

        res.status(500).json({ error: 'Failed to fetch posts' });

    }
}

const likePost = async (req, res) => {
    try {

        const { userId, postId } = req.params;
        const { userPostId } = req.body;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [parseInt(userId)]);
        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }

        const postResult = await pool.query('SELECT * FROM posts WHERE id = $1', [parseInt(postId)]);
        if (postResult.rows.length === 0) {
            throw new Error('Post not found');
        }

        const likedUsers = postResult.rows[0].liked_users;
        const userIndex = likedUsers.indexOf(parseInt(userId));
        if (userIndex === -1) {
            likedUsers.push(parseInt(userId));
            if (userId != userPostId) {
                const notificationLike = await pool.query(
                    'INSERT INTO notifications (by_user_id, to_user_id, post_id, type) VALUES ($1, $2, $3, $4)',
                    [userId, userPostId, postId, 'like']
                )
            }
        } else {
            likedUsers.splice(userIndex, 1);
        }

        const userLikedPosts = userResult.rows[0].liked_posts;
        const postIndex = userLikedPosts.indexOf(parseInt(postId));
        if (postIndex === -1) {
            userLikedPosts.push(parseInt(postId));
        } else {
            userLikedPosts.splice(postIndex, 1);
        }

        await pool.query('BEGIN')

        const updatePostQuery = 'UPDATE posts SET liked_users = $1 WHERE id = $2';
        const updateUserQuery = 'UPDATE users SET liked_posts = $1 WHERE id = $2';

        await pool.query(updatePostQuery, [likedUsers, parseInt(postId)])
        await pool.query(updateUserQuery, [userLikedPosts, parseInt(userId)])

        await pool.query('COMMIT')

        res.status(201).json({
            message: 'Post liked successfully!'
        })

    } catch (error) {

        res.status(500).json({ error: 'Failed to like the post' });

    }
}

const allPostLikes = async (req, res) => {
    try {

        const { postId } = req.params

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const postResult = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
        if (postResult.rows.length === 0) {
            throw new Error('Post not found');
        }

        await pool.query(`SELECT p.id, p.content, (SELECT JSONB_AGG(JSONB_BUILD_OBJECT('id', u.id,'username', u.username, 'name', u.name, 'email', u.email)) FROM unnest(p.liked_users) liked_user_id JOIN users u ON liked_user_id = u.id) AS liked_users_details FROM posts p WHERE p.id = $1`, [postId])
            .then(response => {
                return res.status(201).json({
                    data: response.rows[0],
                    message: 'Post likes fetched successfully!'
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message })
            })

    } catch (error) {

        res.status(500).json({ error: 'Failed to get likes of the post' });

    }
}

const deletePost = async (req, res) => {
    try {

        const { postId } = req.params;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        await pool.query('BEGIN');

        await pool.query('DELETE FROM comments WHERE post_id = $1', [postId]);
        await pool.query('DELETE FROM notifications WHERE post_id = $1', [postId]);
        await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

        await pool.query('COMMIT');

        return res.status(201).json({
            message: 'Post deleted!'
        })

    } catch (error) {

        res.status(500).json({ error: 'Failed to delete the post' });

    }
}

export default {
    createPost,
    postsByUser,
    postById,
    allPosts,
    likePost,
    allPostLikes,
    deletePost
}