import React, { useEffect, useState } from 'react'
import { allNotifs, getAllPosts, notificationsByUserId } from '../../apis/api'
import CustomCard from '../custom/CustomCard'
import PostCard from './units/PostCard'
import CreatePost from './CreatePost'
import PostLikes from './units/PostLikes'
import CustomInput from '../custom/CustomInput'
import CustomButton from '../custom/CustomButton'
import { useContext } from 'react'
import AppContext from '../../context/AppContext'
import { getUserId, getUserToken } from '../../utils/getLocalStorage'
import PostComments from './units/PostComments'
import CustomLoader from '../custom/CustomLoader'
import { useNavigate } from 'react-router-dom'
import Toast from '../custom/CustomToast'

function Timeline() {

    const { user } = useContext(AppContext)
    const navigate = useNavigate()

    const [posts, setPosts] = useState(null)
    const [reRender, setReRender] = useState(new Date().getTime())
    const [openCreatePost, setOpenCreatePost] = useState(false)
    const [showPostLikes, setShowPostLikes] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [postUserId, setPostUserId] = useState(null)
    const [showComments, setShowComments] = useState(false)
    const [recentActivities, setrecentActivities] = useState(null)
    const [notifs, setNotifs] = useState(null)
    const [search, setSearch] = useState('')
    const [count, setCount] = useState(0)

    const [isUserFlag, setIsUserFlag] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let userItem = JSON.parse(localStorage.getItem('user'))
        if (userItem?.token) {
            setIsUserFlag(true)
        } else {
            Toast.error('Please login!')
            navigate('/login')
            setIsUserFlag(false)
        }
    }, [user])

    useEffect(() => {
        if (isUserFlag) {
            getAllPosts(setPosts, setCount, search)
            allNotifs(setrecentActivities)
            notificationsByUserId(getUserId(), setNotifs)
        }
    }, [reRender, search, isUserFlag])

    useEffect(() => {
        setLoading(true)
        if (notifs && recentActivities && posts) {
            setLoading(false)
        }
    }, [notifs, recentActivities, posts])

    return (
        <CustomCard className='h-[calc(100%-60px)] w-full flex gap-x-4 justify-center p-4 relative font-sans overflow-y-auto'>
            {openCreatePost
                ? <CreatePost
                    setReRender={setReRender}
                    setOpenCreatePost={setOpenCreatePost}
                />
                : null
            }
            {showPostLikes
                ? <PostLikes
                    postId={selectedPostId}
                    setLikesPreview={setShowPostLikes}
                /> : null
            }
            {showComments
                ? <PostComments
                    userId={getUserId()}
                    postUserId={postUserId}
                    setCommentsPreview={setShowComments}
                    postId={selectedPostId}
                    setReRender={setReRender}
                />
                : null
            }
            {
                loading
                    ? <CustomLoader height={"100%"} width={"100%"} />
                    : <>
                        <div
                            className='h-full w-2/6 p-5 flex flex-col gap-y-4 bg-[#0008] rounded-md overflow-y-auto'
                        >
                            <div className='flex flex-col gap-2'>
                                <CustomInput
                                    id='search'
                                    name='search'
                                    size='none'
                                    className='w-full h-12'
                                    type='text'
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search posts"
                                />
                                {search !== "" ? <p>Showing {count} results for "{search}"</p> : null}
                            </div>
                            <div className='flex-1 flex flex-col gap-2 w-full border-b border-b-gray-400 overflow-y-auto pb-2'>
                                <p className='text-lg pb-0.5 border-b border-b-gray-400 mx-auto w-fit'>Recent Activity</p>
                                {recentActivities
                                    ? recentActivities?.map(n => (
                                        <div
                                            key={n?.id}
                                            className='text-base leading-none p-2 rounded bg-gray-700 flex flex-col gap-1'
                                        >
                                            {`@${n?.by_username} ${n?.type == 'like' ? 'liked' : 'commented on'} @${n?.to_username}'s post`}
                                            <p className='text-xs leading-none text-gray-400'>
                                                {new Date(n?.created_at).toUTCString()}
                                            </p>
                                        </div>
                                    ))
                                    : <div className='text-center'>No Recent Activity!</div>
                                }
                            </div>
                        </div>
                        <div className='h-full w-2/6 py-6 px-8 bg-[#0008] rounded-md overflow-y-auto'>
                            {
                                user && posts?.length > 0
                                    ? <div className='h-fit w-full items-center flex flex-col gap-4'>
                                        {posts?.map((post, index) => {
                                            let currentUser = getUserId()
                                            let likeIndex = post?.liked_users?.indexOf(currentUser)
                                            return (
                                                <PostCard
                                                    key={index}
                                                    userId={post?.user_id}
                                                    likeUserId={currentUser}
                                                    postId={post?.id}
                                                    title={post?.title}
                                                    content={post?.content}
                                                    createdAt={post?.created_at}
                                                    isLiked={likeIndex != -1 ? true : false}
                                                    likes={post?.liked_users?.length}
                                                    username={post?.username}
                                                    comments={post?.comments[0] == null ? 0 : post?.comments?.length}
                                                    setPostId={setSelectedPostId}
                                                    setPostUserId={setPostUserId}
                                                    setShowPostLikes={setShowPostLikes}
                                                    setShowComments={setShowComments}
                                                    setReRender={setReRender}
                                                    className='h-full'
                                                />
                                            )
                                        })}
                                    </div>
                                    : <div className='w-full h-full text-center text-lg'>
                                        Oops! No posts found for the term "{search}".
                                    </div>
                            }
                        </div>
                        <div
                            className='h-full w-2/6 p-4 flex flex-col items-center gap-y-2 bg-[#0008] rounded-md overflow-y-auto'
                        >
                            <div className='flex-1 flex flex-col gap-2 w-full border-b border-b-gray-400 overflow-y-auto pb-2'>
                                <p className='text-lg pb-0.5 border-b border-b-gray-400 mx-auto w-fit'>Notifications</p>
                                {notifs && notifs?.length > 0
                                    ? notifs?.map(n => (
                                        <div
                                            key={n?.id}
                                            className='text-base leading-none p-2 rounded bg-gray-700 flex flex-col gap-1'
                                        >
                                            {`@${n?.username} ${n?.type == 'like' ? 'liked your' : 'commented on your'} post.`}
                                            <p className='text-xs leading-none text-gray-400'>
                                                {new Date(n?.created_at).toUTCString()}
                                            </p>
                                        </div>
                                    ))
                                    : <div className='text-center'>No new notifications!</div>
                                }
                            </div>
                            <CustomButton
                                text='Create post'
                                size='small'
                                className='!border-none'
                                onClick={() => setOpenCreatePost(true)}
                            />
                        </div>
                    </>
            }
        </CustomCard>
    )
}

export default Timeline