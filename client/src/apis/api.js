import api from '../axios/axios'
import Toast from '../components/custom/CustomToast'

let userItem = JSON.parse(localStorage.getItem('user'))
let token, isAdmin;
if (userItem) {
    token = userItem?.token
    isAdmin = userItem?.isAdmin
}

// User Signup
export const userSignup = (payload) => {
    api.post('/users', {
        name: payload?.name,
        username: payload?.username,
        email: payload?.email,
        password: payload?.password
    }).then(response => {
        Toast.success(response.data?.message)
    }).catch(err => {
        if (err.request.response) {
            let errMsg = JSON.parse(err.request.response)
            Toast.error(errMsg.message)
        } else {
            Toast.error('Internal server error!')
        }
    })
}

// User Login
export const userLogin = (payload, setUser) => {
    api.post('/login', {
        email: payload?.email,
        password: payload?.password
    }).then(response => {
        if (response.data?.token) {
            localStorage.setItem("user", JSON.stringify({
                id: response.data?.data?.id,
                name: response.data?.data?.name,
                username: response.data?.data?.username,
                email: response.data?.data?.email,
                token: response.data?.token,
                isAdmin: response.data?.data?.is_admin
            }))
            setUser({
                id: response.data?.data?.id,
                name: response.data?.data?.name,
                username: response.data?.data?.username,
                email: response.data?.data?.email,
                token: response.data?.token,
                isAdmin: response.data?.data?.is_admin
            })
            token = response.data?.token
            isAdmin = response.data?.data?.is_admin
        } else {
            Toast.error(response.data?.message)
        }
    }).catch(err => {
        if (err.request.response) {
            let errMsg = JSON.parse(err.request.response)
            Toast.error(errMsg.message)
        } else {
            Toast.error('Some error occurred!')
        }
    })
}

// All users
export const getAllUsers = (setUsers, setLoading, chkAdmin) => {
    setLoading(true)
    api.get('/users', {
        headers: { 'Authorization': `Bearer ${token}`, 'Isadmin': chkAdmin }
    })
        .then(res => {
            setUsers(res.data)
            setLoading(false)
        })
        .catch(err => Toast.error('Failed to get users!'))
}

// User By Id
export const userById = (userId, setUserInfo) => {
    api.get(`/userbyid/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            setUserInfo(response.data?.data)
        })
        .catch(err => Toast.error("Error occurred while fetching the user!"))
}

export const updateUser = (userId, payload) => {
    api.put(`/updateuser/${userId}`, payload, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            Toast.success(response.data?.message)
        })
        .catch(err => Toast.error("Error occurred while updating the user!"))
}

export const handleUserSuspension = (userId, payload, setOpenViewUser, setReRender) => {
    api.put(`/suspenduser/${userId}`, payload, {
        headers: { 'Authorization': `Bearer ${token}`, 'Isadmin': isAdmin }
    })
        .then(response => {
            Toast.success(response.data?.message)
            setOpenViewUser(false)
            setReRender(new Date().getTime())
        })
        .catch(err => Toast.error("Error occurred while updating the user!"))
}

// All Likes done by a User
export const userLikes = (userId, setLikedPosts) => {
    api.get(`/userlikes/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            setLikedPosts(response.data?.data)
        })
        .catch(err => Toast.error("Error occurres while fetching users liked posts!"))
}

// Create Post
export const createNewPost = (payload, userId, setReRender, setOpenCreatePost) => {
    api.post(`/postbyuser/${userId}`, {
        title: payload?.title,
        content: payload?.content
    }, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(response => {
        Toast.success("Post created successfully!")
        setOpenCreatePost(false)
        setReRender(new Date().getTime())
    }).catch(err => Toast.error("Error occurred while creating post!"))
}

// Get All Posts
export const getAllPosts = (setPosts, setCount, search) => {
    api.get('/allposts', {
        params: { search: search },
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            setPosts(response.data?.data)
            setCount(response.data?.count)
        }).catch(err => Toast.error("Error occurred while fetching posts!"))
}

// Like/Unlike post
export const likePost = (userPostId, userId, postId, setReRender) => {
    api.put(`/updatepostlike/${userId}/${postId}`, { userPostId: userPostId }, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            setReRender(new Date().getTime())
        }).catch(err => Toast.error("Error occurred while liking the post!"))
}

// All Likes on a Post
export const getAllPostLikes = (postId, setLikedUsers, setLoading) => {
    setLoading(true)
    api.get(`/postlikes/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            setLikedUsers(response.data?.data?.liked_users_details)
            setLoading(false)
        }).catch(err => Toast.error("Error occurred while fetching the post likes!"))
}

// All posts of a user
export const getPostOfUser = (userId, setUsersPosts) => {
    api.get(`/postsofuser/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            setUsersPosts(response.data?.data)
        }).catch(err => Toast.error("Error occurred while fetching posts!"))
}

export const deletePost = (postId, setReRender, setOpenDelete) => {
    api.delete(`/deletepost/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            Toast.success(response.data?.message)
            setOpenDelete(false)
            setReRender(new Date().getTime())
        }).catch(err => Toast.error("Failed to delete the post!"))
}

// Comment on a post
export const commentOnPost = (
    userId,
    userPostId,
    postId,
    text,
    setComment,
    setReRender,
    setCommentsPreview
) => {
    api.post(`/commentbyuser/${userId}/${postId}`, { text: text, userPostId: userPostId }, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(response => {
            Toast.success(response.data?.message)
            setComment("")
            setCommentsPreview(false)
            setReRender(new Date().getTime())
        }).catch(err => Toast.error("Error occurred while commenting!"))
}

// Comments on a single post
export const getAllCommentsOnPost = (postId, setComments, setLoading) => {
    setLoading(true)
    api.get(`/commentsonpost/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => {
            setComments(res.data?.data)
            setLoading(false)
        })
        .catch(err => Toast.error('Failed to get comments!'))
}

// All Notifications
export const allNotifs = (setRecentAct) => {
    api.get('/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => {
            setRecentAct(res.data?.data)
        })
        .catch(err => Toast.error('Error occurred while fetching notifications!'))
}

// Notification for a user
export const notificationsByUserId = (userId, setNotifs) => {
    api.get(`/notifications/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => {
            setNotifs(res.data?.data)
        })
        .catch(err => Toast.error('Error occurred while fetching notifications!'))
}

// Notification for graph
export const notificationsGraph = (userId, setGraphData) => {
    api.get(`/notifications/graph/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => setGraphData(res.data?.data))
        .catch(err => Toast.error('Error occurred while fetching notifications!'))
}

// All contacts
export const allContacts = (setContacts, setLoading, chkAdmin) => {
    setLoading(true)
    api.get('/contacts', {
        headers: { 'Authorization': `Bearer ${token}`, 'Isadmin': chkAdmin }
    })
        .then(res => {
            setContacts(res.data)
            setLoading(false)
        })
        .catch(err => Toast.error('Error occurred while fetching contacts!'))
}

// Post Contact
export const postContact = (payload) => {
    api.post('/contact', payload)
        .then(res => Toast.success(res.data?.message))
        .catch(err => Toast.error('Failed to post your message'))
}

// Post a report
export const submitReport = (postId, reportedTo, reportedBy, desc, setOpenReport) => {
    let postApi = {
        postId: postId,
        reportedTo: reportedTo,
        reportedBy: reportedBy,
        desc: desc
    }
    api.post('/report', postApi, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => {
            Toast.success(res.data?.message)
            setOpenReport(false)
        })
        .catch(err => {
            if (err.request.response) {
                let errMsg = JSON.parse(err.request.response)
                Toast.error(errMsg.message)
            } else {
                Toast.error('Some error occurred!')
            }
        })
}

export const allReports = (setReports, setLoading, chkAdmin) => {
    setLoading(true)
    api.get('/reports', {
        headers: { 'Authorization': `Bearer ${token}`, 'Isadmin': chkAdmin }
    })
        .then(res => {
            setReports(res.data)
            setLoading(false)
        })
        .catch(err => Toast.error('Error occurred while fetching reports!'))
}