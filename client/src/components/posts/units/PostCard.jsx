import React, { useState } from 'react'
import { formatTimeSince } from '../../../utils/timesince'
import CustomCard from '../../custom/CustomCard'
import { FaHeart, FaComment } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { deletePost, likePost, submitReport } from '../../../apis/api'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import CustomButton from '../../custom/CustomButton'
import { formatNumber } from '../../../utils/numberformat'
import CustomTextarea from '../../custom/CustomTextarea'

function PostCard({
    postId,
    userId,
    likeUserId,
    title,
    content,
    username,
    likes,
    comments = 0,
    isLiked,
    createdAt,
    setPostUserId,
    setShowPostLikes,
    setShowComments,
    setPostId,
    setReRender,
    className = ''
}) {

    const [openDelete, setOpenDelete] = useState(false)
    const [openReport, setOpenReport] = useState(false)
    const [description, setDescription] = useState('')

    const confirmDelete = (
        <div className='h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md flex flex-col gap-4 px-4 py-3 z-40'>
            <div className='text-base leading-none text-gray-800 px-3 py-2'>
                Are you sure you want to delete this post?
            </div>
            <div className='flex justify-between'>
                <CustomButton
                    text='No'
                    className='!border-none h-8 w-24 !bg-red-500 !text-gray-300'
                    size='none'
                    onClick={() => setOpenDelete(false)}
                />
                <CustomButton
                    text='Yes'
                    size='none'
                    className='!border-none h-8 w-24 !bg-blue-500 !text-gray-300'
                    onClick={() => deletePost(postId, setReRender, setOpenDelete)}
                />
            </div>
        </div>
    )

    const postReport = (
        <div className='h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md flex flex-col gap-3 px-4 py-3 z-40'>
            <div className='text-lg leading-none text-gray-800 px-3 py-2'>
                Are you sure you want to report this post?
            </div>
            <CustomTextarea
                type="text"
                id="desc"
                name="desc"
                label="Describe"
                labelClass="text-base !text-gray-500"
                className='!w-full'
                extraClass="!border-gray-300"
                size='none'
                rows={3}
                placeholder="Describe...(optional)"
                containerClass='mb-2'
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />
            <div className='flex justify-between'>
                <CustomButton
                    text='No'
                    className='!border-none h-8 w-24 !bg-red-500 !text-gray-300'
                    size='none'
                    onClick={() => setOpenReport(false)}
                />
                <CustomButton
                    text='Yes'
                    size='none'
                    className='!border-none h-8 w-24 !bg-blue-500 !text-gray-200'
                    onClick={() => submitReport(postId, userId, likeUserId, description, setOpenReport)}
                />
            </div>
        </div>
    )

    return (
        <CustomCard className={classNames('min-w-full w-72 border border-gray-400 rounded p-2', className)}>
            {openDelete ? confirmDelete : null}
            {openReport ? postReport : null}
            <div className='w-full flex items-center justify-between border-b border-b-gray-700 pb-2 mb-1'>
                <Link to={`/profile/${userId}`} className='text-blue-200 text-sm'>@{username}</Link>
                <div className='flex items-center gap-2 relative'>
                    <span className='text-blue-300 text-xs leading-none'>
                        {formatTimeSince(createdAt)}
                    </span>
                    {userId == likeUserId
                        ? <MdDelete
                            className='text-lg text-red-600 cursor-pointer'
                            onClick={() => {
                                setOpenDelete(true)
                                setOpenReport(false)
                                setShowPostLikes(false)
                                setShowComments(false)
                            }}
                        />
                        : null
                    }
                </div>
            </div>
            <div>
                <p className='m-0 text-gray-100 text-lg font-semibold'>{title}</p>
                <p className='m-0 text-gray-200 text-base'>{content}</p>
            </div>
            <div className='flex items-center gap-3 pt-2 pb-1'>
                <div className='flex gap-1 items-center'>
                    <FaHeart
                        className={classNames(
                            'text-lg cursor-pointer',
                            isLiked ? 'text-red-600' : 'text-gray-500'
                        )}
                        onClick={() => likePost(userId, likeUserId, postId, setReRender)}
                    />
                    <span
                        className='text-sm text-gray-400 cursor-pointer px-1'
                        onClick={() => {
                            setPostId(postId)
                            setShowPostLikes(true)
                            setShowComments(false)
                            setOpenDelete(false)
                            setOpenReport(false)
                        }}
                    >{formatNumber(likes)}
                    </span>
                </div>
                <div
                    className='flex gap-2 items-center'
                    onClick={() => {
                        setPostId(postId)
                        setPostUserId(userId)
                        setShowComments(true)
                        setOpenDelete(false)
                        setOpenReport(false)
                        setShowPostLikes(false)
                    }}
                >
                    <FaComment className='text-lg text-gray-500 cursor-pointer' />
                    <span className='text-sm text-gray-400 cursor-pointer'>
                        {formatNumber(comments)}
                    </span>
                </div>
            </div>
            <div
                className='text-sm py-1 text-blue-400 border-t border-t-gray-700'
            >
                <div
                    className='w-fit cursor-pointer'
                    onClick={() => {
                        setOpenReport(true)
                        setOpenDelete(false)
                        setShowPostLikes(false)
                        setShowComments(false)
                    }}
                >Report this post</div>
            </div>
        </CustomCard>
    )
}

export default PostCard