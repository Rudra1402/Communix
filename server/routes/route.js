import express from 'express'
import * as post from '../controllers/post.controller.js'
import * as comment from '../controllers/comment.controller.js'
import * as user from '../controllers/user.controller.js'
import * as report from '../controllers/report.controller.js'
import * as notification from '../controllers/notification.controller.js'
import * as contact from '../controllers/contact.controller.js'
const router = express.Router()

// User Routes
router.get('/users', user.default.allUsers)
router.post('/users', user.default.createUser)
router.post('/login', user.default.userLogin)
router.get('/userbyid/:userId', user.default.userById)
router.get('/userlikes/:userId', user.default.allUserLikes)
router.put('/updateuser/:userId', user.default.updateUser)
router.put('/suspenduser/:userId', user.default.suspendUser)

// Post Routes
router.post('/postbyuser/:userId', post.default.createPost)
router.get('/postsofuser/:userId', post.default.postsByUser)
router.get('/postbyid/:postId', post.default.postById)
router.get('/allposts', post.default.allPosts)
router.put('/updatepostlike/:userId/:postId', post.default.likePost)
router.get('/postlikes/:postId', post.default.allPostLikes)
router.delete('/deletepost/:postId', post.default.deletePost)

// Comment Routes
router.post('/commentbyuser/:userId/:postId', comment.default.createComment)
router.get('/commentsonpost/:postId', comment.default.commentsOnPost)

// Notification Routes
router.get('/notifications', notification.default.allNotifications)
router.get('/notifications/:userId', notification.default.notificationsForUser)
router.get('/notifications/graph/:userId', notification.default.notificationDataGraph)

// Contact Routes
router.get('/contacts', contact.default.allContacts)
router.post('/contact', contact.default.postContact)

// Report Routes
router.post('/report', report.default.postReport)
router.get('/reports', report.default.allReports)

export default router