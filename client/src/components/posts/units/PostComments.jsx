import React, { useEffect, useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { Link } from 'react-router-dom'
import { commentOnPost, getAllCommentsOnPost } from '../../../apis/api'
import CustomButton from '../../custom/CustomButton'
import CustomCard from '../../custom/CustomCard'
import CustomInput from '../../custom/CustomInput'
import CustomLoader from '../../custom/CustomLoader'
import { BsFillSendFill } from 'react-icons/bs'

function PostComments({ userId, postId, postUserId, setReRender, setCommentsPreview }) {

    const [comment, setComment] = useState('')
    const [comments, setComments] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (postId)
            getAllCommentsOnPost(postId, setComments, setLoading)
    }, [postId])

    return (
        <CustomCard
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-fit max-h-full w-96 rounded-md bg-gray-100 flex flex-col gap-0 z-40'
        >
            <RxCross1
                className='absolute -top-4 -right-4 cursor-pointer text-4xl p-2 bg-yellow-500 text-gray-700 rounded-full'
                onClick={() => setCommentsPreview(false)}
            />
            {
                loading
                    ? <CustomLoader rows={1} height={"96px"} width={"484px"} className='bg-gray-300 rounded-md' />
                    : <>
                        <p className='text-gray-600 text-base border-b border-b-gray-600 p-2 text-center'>
                            Comments {comments?.length > 0 ? `(${comments?.length})` : ''}
                        </p>
                        <div className='flex flex-col gap-y-1 p-2'>
                            {comments && comments?.length > 0
                                ? comments?.map((comment, index) => (
                                    <Link
                                        to={`/profile/${comment?.user_id}`}
                                        className='flex items-start cursor-pointer hover:bg-gray-200 rounded p-2'
                                        key={index}
                                    >
                                        <div className='h-10 w-10 text-gray-300 rounded-full bg-gray-700 flex items-center justify-center text-base'>
                                            {comment?.name?.split(" ")[0][0]}
                                        </div>
                                        <div className='px-2 flex flex-col gap-y-1 text-gray-600 flex-1'>
                                            <p className='text-sm text-gray-500 leading-none'>@{comment?.username}</p>
                                            <p className='text-sm leading-none'>{comment?.text}</p>
                                        </div>
                                    </Link>
                                ))
                                : <div className='text-base text-gray-700 p-2 text-center'>There are no comments on the post!</div>
                            }
                            <div className='flex gap-0 items-center w-full'>
                                <CustomInput
                                    type="text"
                                    id="comment"
                                    name="comment"
                                    size='none'
                                    className='h-10'
                                    labelClass="text-base !text-gray-500"
                                    extraClass="!border-gray-400 !text-sm"
                                    containerClass='flex-1'
                                    placeholder="Write your comment here"
                                    value={comment}
                                    onChange={(event) => setComment(event.target.value)}
                                />
                                <CustomButton
                                    text={<BsFillSendFill className='scale-125' />}
                                    size='none'
                                    className="h-10 w-12 mt-1 !border-none text-base !text-white !bg-purple-600"
                                    onClick={() => commentOnPost(
                                        userId,
                                        postUserId,
                                        postId,
                                        comment,
                                        setComment,
                                        setReRender,
                                        setCommentsPreview
                                    )}
                                />
                            </div>
                        </div>
                    </>
            }
        </CustomCard>
    )
}

export default PostComments