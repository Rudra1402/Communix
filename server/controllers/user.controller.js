import pool from '../database.js'
import jwt from 'jsonwebtoken'

const secretKey = 'jaldiwahasehato'

const allUsers = async (req, res) => {
    try {

        const token = req.headers.authorization
        const isAdmin = req.headers.isadmin

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        if (!isAdmin) {
            return res.status(401).json({ message: 'Unauthorized - You are not the admin!' });
        }

        const usersQuery = 'SELECT id, name, username, email, liked_posts, is_admin, is_suspended FROM users WHERE is_admin=FALSE ORDER BY id'

        const users = await pool.query(usersQuery)

        res.status(201).json({
            data: users.rows,
            count: users.rowCount,
            message: 'All users list!'
        })

    } catch (error) {

        res.status(500).json({ error: 'Failed to fetch users' })

    }
}

const createUser = async (req, res) => {
    try {

        const { name, username, email, password } = req.body

        const checkUsername = await pool.query('SELECT * FROM users WHERE username = $1', [username])

        if (checkUsername.rows.length > 0) {
            return res.status(400).json({
                message: 'Username already exists!'
            })
        }

        const query = `
            INSERT INTO users (name, username, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [name, username, email, password];

        await pool.query(query, values)
            .then(response => {
                return res.status(201).json({
                    data: response.rows[0],
                    message: 'User created successfully!'
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message })
            })

    } catch (error) {

        res.status(500).json({ error: 'Failed to create a user' })

    }
}

const userLogin = async (req, res) => {
    try {

        const { email, password } = req.body

        const query = `
            SELECT id, name, username, email, is_admin, is_suspended
            FROM users
            WHERE email = $1 AND password = $2;
        `;
        // const query = `
        //     SELECT id, name, username, email, is_admin
        //     FROM users
        //     WHERE email = $1 AND password = $2;
        // `;
        const values = [email, password]

        const loginObj = await pool.query(query, values)

        if (loginObj.rows.length < 1) {
            return res.status(404).json({
                message: 'Invalid credentials!'
            })
        }

        if (loginObj.rows[0]?.is_suspended) {
            return res.status(403).json({
                message: 'You are suspended! Please try again later or contact the admin.'
            })
        }

        const token = jwt.sign({ id: loginObj.rows[0].id }, secretKey, { expiresIn: '1h' });

        return res.status(201).json({
            data: loginObj.rows[0],
            token: token,
            message: 'Login success!'
        })

    } catch (error) {

        res.status(500).json({ error: 'Failed to login the user' })

    }
}

const userById = async (req, res) => {
    try {

        const { userId } = req.params;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const query = `
            SELECT *
            FROM users
            WHERE id = $1;
        `;

        await pool.query(query, [userId])
            .then(response => {
                return res.status(201).json({
                    data: response.rows[0],
                    message: 'User fetched successfully!'
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message })
            })

    } catch (error) {

        res.status(500).json({ error: "Failed to get the user!" })

    }
}

const updateUser = async (req, res) => {
    try {

        const { userId } = req.params;
        const { name, username, email, twitterurl, instagramurl, githuburl, otherurl, privateurls } = req.body

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        await pool.query('UPDATE users SET name=$1, username=$2, email=$3, twitterurl=$4, instagramurl=$5, githuburl=$6, otherurl=$7, private=$8 WHERE id=$9', [name, username, email, twitterurl, instagramurl, githuburl, otherurl, privateurls, userId])
            .then(response => {
                return res.status(201).json({
                    data: response.rows[0],
                    message: 'User updated successfully!'
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message })
            })

    } catch (error) {

        res.status(500).json({ error: "Failed to update the user!" })

    }
}

const suspendUser = async (req, res) => {
    try {

        const { userId } = req.params;
        const { is_suspended } = req.body;

        const token = req.headers.authorization
        const isAdmin = req.headers.isadmin

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        if (!isAdmin) {
            return res.status(401).json({ message: 'Unauthorized - You are not the admin!' });
        }

        const suspendQuery = 'UPDATE users SET is_suspended=$1 WHERE id=$2'

        const result = await pool.query(suspendQuery, [is_suspended, userId])

        return res.status(201).json({
            message: is_suspended ? 'Suspended' : 'Unsuspended'
        })

    } catch (error) {

        res.status(500).json({ error: "Failed to handle user suspension!" })

    }
}

const allUserLikes = async (req, res) => {
    try {

        const { userId } = req.params

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const query = `SELECT p.id, p.title
            FROM users AS u
            INNER JOIN user_liked_posts AS ulp ON u.id = ulp.user_id
            INNER JOIN posts AS p ON ulp.post_id = p.id
            WHERE u.id = $1`;

        await pool.query(query, [userId])
            .then(response => {
                return res.status(201).json({
                    data: response.rows,
                    count: response.rowCount,
                    message: 'Users post likes fetched successfully!'
                })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message })
            })

    } catch (error) {

        res.status(500).json({ error: "Failed to get the users likes posts!" })

    }
}

export default { allUsers, createUser, userById, updateUser, allUserLikes, userLogin, suspendUser }