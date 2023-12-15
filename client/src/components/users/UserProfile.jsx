import React, { useEffect, useState } from 'react'
import { getPostOfUser, notificationsByUserId, notificationsGraph, updateUser, userById } from '../../apis/api'
import CustomCard from '../custom/CustomCard'
import PostCard from '../posts/units/PostCard'
import { BiSolidEditAlt, BiInfoCircle } from 'react-icons/bi'
import { FaLink, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa'
import CustomInput from '../custom/CustomInput'
import CustomForm from '../custom/CustomForm'
import CustomButton from '../custom/CustomButton'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import { Line } from 'react-chartjs-2'
import { Chart, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip } from 'chart.js'
import PostLikes from '../posts/units/PostLikes'
import CustomLoader from '../custom/CustomLoader'
import { getUserId, getUsername } from '../../utils/getLocalStorage'
import PostComments from '../posts/units/PostComments'
import { useContext } from 'react'
import AppContext from '../../context/AppContext'
import Toast from '../custom/CustomToast'

Chart.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip)

const validationSchema = Yup.object({
    name: Yup.string().required("Please enter your name!"),
    username: Yup.string().required("Please enter your username"),
    email: Yup.string().email().required("Please enter your email!"),
    twitterurl: Yup.string(),
    instagramurl: Yup.string(),
    githuburl: Yup.string(),
    otherurl: Yup.string(),
})

function UserProfile() {

    const { userId } = useParams()
    const { user } = useContext(AppContext)
    const navigate = useNavigate()

    const [userInfo, setUserInfo] = useState(null)
    const [usersPosts, setUsersPosts] = useState(null)
    const [reRender, setReRender] = useState(new Date().getTime())
    const [mostLikedPost, setMostLikedPost] = useState(null)
    const [showPostLikes, setShowPostLikes] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [postUserId, setPostUserId] = useState(null)
    const [showComments, setShowComments] = useState(false)
    const [loading, setLoading] = useState(true)
    const [enableEditing, setEnableEditing] = useState(true)
    const [notifs, setNotifs] = useState(null)

    const [isUserFlag, setIsUserFlag] = useState(false)
    const [graphData, setGraphData] = useState(null)
    const [showGraphInfo, setShowGraphInfo] = useState(false)

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
            userById(userId, setUserInfo)
            getPostOfUser(userId, setUsersPosts)
            notificationsGraph(userId, setGraphData)
            notificationsByUserId(getUserId(), setNotifs)
        }
    }, [reRender, userId, isUserFlag])

    useEffect(() => {
        setLoading(true)
        if (usersPosts && userInfo && graphData, notifs) {
            setMostLikedPost(usersPosts?.reduce((acc, current) => {
                if (current.liked_users?.length > acc.liked_users?.length) {
                    return current;
                } else {
                    return acc;
                }
            }, usersPosts[0]))
            setLoading(false)
        }
    }, [usersPosts, userInfo, graphData, notifs])

    const formik = useFormik({
        initialValues: {
            name: userInfo?.name,
            username: userInfo?.username,
            email: userInfo?.email,
            twitterurl: userInfo?.twitterurl ? userInfo?.twitterurl : "",
            instagramurl: userInfo?.instagramurl ? userInfo?.instagramurl : "",
            githuburl: userInfo?.githuburl ? userInfo?.githuburl : "",
            otherurl: userInfo?.otherurl ? userInfo?.otherurl : ""
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit(values) {
            updateUser(userId, values)
        }
    })

    const chartData = {
        labels: [0, graphData?.toCount],
        datasets: [
            {
                label: '',
                data: [0, graphData?.byCount],
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
            }
        ]
    }

    const chartOptions = {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                ticks: {
                    stepSize: 5, // Set the interval to 5 for the x-axis
                },
            },
            y: {
                type: 'linear',
                position: 'left',
                min: 0,
                max: graphData?.byCount % 5 == 0
                    ? ((graphData?.byCount / 5) - 1) * 5 + 5
                    : Math.floor(graphData?.byCount / 5) * 5 + 5,
                ticks: {
                    stepSize: 5, // Set the interval to 5 for the y-axis
                },
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Interaction Graph",
                padding: {
                    bottom: 20
                },
                font: {
                    size: 18
                }
            }
        }
    }

    const graphInfo = (
        <div className='absolute top-9 right-4 bg-green-200 p-4 text-base rounded text-gray-700 font-sans z-30'>
            Interaction Graph shows the cumulative of likes and comments on posts.
            <br />
            <br />
            x-axis shows your interaction on others posts and y-axis shows others interaction on your posts.
            <br />
            <br />
            {usersPosts?.length > 0
                ? <p className='font-semibold'>
                    Interaction Index = {(graphData?.byCount / graphData?.toCount).toFixed(2)}
                </p>
                : null
            }
            {usersPosts?.length > 0 ? <br /> : null}
            <div className='flex flex-col gap-1'>
                1 = Equal interaction from both ways<br />
                &gt;1 = You interact more on others posts<br />
                &lt;1 = Others interact more on your posts
            </div>
        </div>
    )

    return (
        <CustomCard className='p-4 h-[calc(100%-60px)] w-full overflow-y-auto flex gap-x-4 relative font-sans'>
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
                        {/* Left Component */}
                        <div className='flex flex-col w-[352px] gap-4'>
                            <div className='flex justify-between items-center w-[352px] p-4 bg-[#000a] rounded-md'>
                                <div className='flex items-center gap-4'>
                                    <div className='h-16 w-16 bg-gray-300 text-gray-800 text-2xl flex items-center justify-center rounded-full'>
                                        {userInfo?.name?.split(" ")[0][0]}
                                    </div>
                                    <div className='flex flex-col gap-0'>
                                        <p className='text-xl'>{userInfo?.name}</p>
                                        <p className='tracking-wide'>@{userInfo?.username}</p>
                                    </div>
                                </div>
                                {userInfo?.id == getUserId()
                                    ? <BiSolidEditAlt
                                        className={classNames(
                                            'text-2xl cursor-pointer',
                                            enableEditing ? 'text-gray-300' : 'text-green-600'
                                        )}
                                        onClick={() => setEnableEditing(!enableEditing)}
                                    />
                                    : null
                                }
                            </div>
                            <div className='h-full flex-1 w-full py-6 px-8 flex flex-col gap-y-4 bg-[#000a] rounded-md overflow-y-auto'>
                                {usersPosts?.length > 0
                                    ? usersPosts?.map((post, index) => {
                                        let currentUser = getUserId()
                                        let likeIndex = post?.liked_users?.indexOf(currentUser)
                                        return (
                                            <PostCard
                                                key={index}
                                                userId={post?.user_id}
                                                postId={post?.id}
                                                likeUserId={currentUser}
                                                title={post?.title}
                                                content={post?.content}
                                                createdAt={post?.created_at}
                                                isLiked={likeIndex != -1 ? true : false}
                                                likes={post?.liked_users?.length}
                                                username={userInfo?.username}
                                                comments={post?.comments[0] == null ? 0 : post?.comments?.length}
                                                setPostUserId={setPostUserId}
                                                setShowComments={setShowComments}
                                                setPostId={setSelectedPostId}
                                                setShowPostLikes={setShowPostLikes}
                                                setReRender={setReRender}
                                            />
                                        )
                                    })
                                    : <div className='text-lg m-auto text-center'>
                                        {userInfo?.name?.split(" ")[0]} has not posted anything yet!
                                    </div>
                                }
                            </div>
                        </div>
                        {/* Middle Component */}
                        <div className='flex flex-col gap-y-4 flex-1 h-full overflow-y-auto'>
                            <div className='bg-[#000a] p-4 rounded-md relative'>
                                <BiInfoCircle
                                    className='absolute text-2xl right-2 top-3 cursor-pointer'
                                    onClick={() => setShowGraphInfo(!showGraphInfo)}
                                />
                                {showGraphInfo ? graphInfo : null}
                                {usersPosts?.length > 0
                                    ? <Line data={chartData} options={chartOptions} />
                                    : <div className='py-4'>
                                        No data available for <i className='underline underline-offset-2'>Interaction Graph</i>!
                                    </div>
                                }
                            </div>
                            <div className='bg-[#000a] px-4 py-2 rounded-md flex flex-col gap-4 flex-1'>
                                <p className='text-base'>{userInfo?.name?.split(" ")[0]}'s most liked post</p>
                                {
                                    usersPosts?.length > 0
                                        ? <PostCard
                                            userId={mostLikedPost?.user_id}
                                            postId={mostLikedPost?.id}
                                            title={mostLikedPost?.title}
                                            likeUserId={getUserId()}
                                            content={mostLikedPost?.content}
                                            createdAt={mostLikedPost?.created_at}
                                            isLiked={mostLikedPost?.liked_users?.indexOf(mostLikedPost?.user_id) != -1 ? true : false}
                                            likes={mostLikedPost?.liked_users?.length}
                                            username={userInfo?.username}
                                            comments={mostLikedPost?.comments[0] == null ? 0 : mostLikedPost?.comments?.length}
                                            setPostId={setSelectedPostId}
                                            setPostUserId={setPostUserId}
                                            setShowComments={setShowComments}
                                            setShowPostLikes={setShowPostLikes}
                                            setReRender={setReRender}
                                        />
                                        : <div className='text-lg m-auto'>{userInfo?.name?.split(" ")[0]} has 0 posts!</div>
                                }
                            </div>
                        </div>
                        {/* Right Component */}
                        <div
                            className={classNames(
                                'flex flex-col gap-4 h-full overflow-y-auto',
                                userInfo?.id == getUserId() ? 'w-1/3' : 'w-2/5'
                            )}
                        >
                            <div className='bg-[#000a] p-4 rounded-md flex flex-col gap-3'>
                                <div className='flex items-center justify-between'>
                                    <p className='text-base'>Social Media Links</p>
                                </div>
                                <div className='flex items-center gap-4'>
                                    {userInfo?.twitterurl && <a href={userInfo?.twitterurl} target={'_blank'} className=''>
                                        <FaTwitter
                                            className='text-xl text-blue-400'
                                            title={userInfo?.twitterurl}
                                        />
                                    </a>
                                    }
                                    {userInfo?.instagramurl && <a href={userInfo?.instagramurl} target={'_blank'} className=''>
                                        <FaInstagram
                                            className='text-xl text-purple-500'
                                            title={userInfo?.instagramurl}
                                        />
                                    </a>
                                    }
                                    {userInfo?.githuburl && <a href={userInfo?.githuburl} target={'_blank'} className=''>
                                        <FaGithub
                                            className='text-xl text-gray-500'
                                            title={userInfo?.githuburl}
                                        />
                                    </a>
                                    }
                                    {userInfo?.otherurl && <a href={userInfo?.otherurl} target={'_blank'} className=''>
                                        <FaLink
                                            className='text-xl text-red-400'
                                            title={userInfo?.otherurl}
                                        />
                                    </a>
                                    }
                                    {!userInfo?.twitterurl && !userInfo?.instagramurl && !userInfo?.githuburl && !userInfo?.otherurl
                                        ? <div className='text-base'>
                                            {userInfo?.username == getUsername()
                                                ? 'You have'
                                                : `${userInfo?.name} has`} not uploaded any social media links!
                                        </div>
                                        : null
                                    }
                                </div>
                            </div>
                            {userInfo?.id == getUserId()
                                ? <CustomForm className='bg-[#000a] px-6 py-4 rounded-md flex-col gap-3 flex-1' onSubmit={formik.handleSubmit}>
                                    {/* <div className='flex gap-3'> */}
                                    <CustomInput
                                        type="text"
                                        id="name"
                                        name="name"
                                        label="Name"
                                        labelClass="text-base !text-gray-400"
                                        className='!w-full'
                                        extraClass="!border-gray-300"
                                        size='none'
                                        placeholder="Ethan Hunt"
                                        value={formik.values.name}
                                        onChange={(event) => formik.setFieldValue("name", event.target.value)}
                                        readOnly={enableEditing}
                                    />
                                    <CustomInput
                                        type="text"
                                        id="username"
                                        name="username"
                                        label="Username"
                                        labelClass="text-base !text-gray-400"
                                        size='none'
                                        className="h-10 w-full"
                                        extraClass="!border-gray-300"
                                        placeholder="ethanhunt5"
                                        value={formik.values.username}
                                        onChange={(event) => formik.setFieldValue("username", event.target.value)}
                                        readOnly={enableEditing}
                                    />
                                    {/* </div> */}
                                    <CustomInput
                                        type="text"
                                        id="email"
                                        name="email"
                                        label="Email ID"
                                        labelClass="text-base !text-gray-400"
                                        extraClass="!border-gray-300"
                                        size='none'
                                        className="h-10 w-full"
                                        placeholder="ethan5@email.com"
                                        value={formik.values.email}
                                        onChange={(event) => formik.setFieldValue("email", event.target.value)}
                                        readOnly={enableEditing}
                                    />
                                    {/* <div className='flex gap-3'> */}
                                    <CustomInput
                                        id="twitter"
                                        type='url'
                                        name="twitter"
                                        label="Twitter"
                                        size='none'
                                        className="h-10 w-full"
                                        labelClass="text-base !text-gray-400"
                                        placeholder="Enter url"
                                        value={formik.values.twitterurl}
                                        onChange={(event) => formik.setFieldValue("twitterurl", event.target.value)}
                                        readOnly={enableEditing}
                                    />
                                    <CustomInput
                                        id="instagram"
                                        type='url'
                                        name="instagram"
                                        label="Instagram"
                                        labelClass="text-base !text-gray-400"
                                        size='none'
                                        className="h-10 w-full"
                                        placeholder="Enter url"
                                        value={formik.values.instagramurl}
                                        onChange={(event) => formik.setFieldValue("instagramurl", event.target.value)}
                                        readOnly={enableEditing}
                                    />
                                    {/* </div> */}
                                    {/* <div className='flex gap-3'> */}
                                    <CustomInput
                                        id="github"
                                        type='url'
                                        name="github"
                                        label="Github"
                                        labelClass="text-base !text-gray-400"
                                        size='none'
                                        className="h-10 w-full"
                                        placeholder="Enter url"
                                        value={formik.values.githuburl}
                                        onChange={(event) => formik.setFieldValue("githuburl", event.target.value)}
                                        readOnly={enableEditing}
                                    />
                                    <CustomInput
                                        id="other"
                                        type='url'
                                        name="other"
                                        label="Other"
                                        size='none'
                                        className="h-10 w-full"
                                        labelClass="text-base !text-gray-400"
                                        placeholder="Enter url"
                                        value={formik.values.otherurl}
                                        onChange={(event) => formik.setFieldValue("otherurl", event.target.value)}
                                        readOnly={enableEditing}
                                    />
                                    {/* </div> */}
                                    {userInfo?.id == getUserId()
                                        ? <CustomButton
                                            type="submit"
                                            text="Update"
                                            size='small'
                                            className="!border-none !text-base mt-2"
                                            disabled={enableEditing}
                                        />
                                        : null
                                    }
                                </CustomForm>
                                : null
                            }
                            {userInfo?.id != getUserId()
                                ? <div
                                    className='flex-1 flex flex-col gap-2 w-full overflow-y-auto pb-2 bg-[#000a] p-4 rounded'
                                >
                                    <p className='text-lg pb-0.5 mx-auto w-fit'>Notifications</p>
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
                                : null
                            }
                        </div>
                    </>
            }
        </CustomCard>
    )
}

export default UserProfile