import pool from "../database.js";

const allNotifications = async (req, res) => {
    try {

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        let query = 'SELECT notifications.id, notifications.type, notifications.to_user_id, notifications.post_id, notifications.created_at, uby.username AS by_username, uto.username AS to_username FROM notifications JOIN users uby ON uby.id = notifications.by_user_id JOIN users uto ON uto.id = notifications.to_user_id ORDER BY notifications.created_at DESC'
        const notifications = await pool.query(query)

        return res.status(201).json({
            data: notifications.rows,
            count: notifications.rowCount,
            message: 'Notifications fetched successfully!'
        })

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}

const notificationsForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        const notifications = await pool.query('SELECT notifications.id, notifications.type, notifications.to_user_id, notifications.post_id, notifications.created_at, users.username FROM notifications LEFT JOIN users ON notifications.by_user_id = users.id WHERE notifications.to_user_id = $1 ORDER BY notifications.created_at DESC', [userId])

        return res.status(201).json({
            data: notifications.rows,
            count: notifications.rowCount,
            message: 'Notifications fetched successfully!'
        })
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}

const notificationDataGraph = async (req, res) => {
    try {
        const { userId } = req.params;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Missing token' });
        }

        await pool.query('BEGIN')

        const notificationsBy = await pool.query('SELECT * FROM notifications WHERE by_user_id=$1', [userId])
        const notificationsTo = await pool.query('SELECT * FROM notifications WHERE to_user_id=$1', [userId])

        await pool.query('COMMIT')

        return res.status(201).json({
            data: {
                notifsBy: notificationsBy.rows,
                byCount: notificationsBy.rowCount,
                notifsTo: notificationsTo.rows,
                toCount: notificationsTo.rowCount
            },
            message: 'Graph data'
        })
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}

export default { allNotifications, notificationsForUser, notificationDataGraph }