import React, { useEffect, useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { Link } from 'react-router-dom'
import { getAllPostLikes } from '../../../apis/api'
import CustomCard from '../../custom/CustomCard'
import CustomLoader from '../../custom/CustomLoader'

function PostLikes({ postId, setLikesPreview }) {

    const [likedUsers, setLikedUsers] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (postId)
            getAllPostLikes(postId, setLikedUsers, setLoading)
    }, [postId])

    return (
        <CustomCard
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-fit max-h-full w-96 rounded-md bg-gray-100 flex flex-col gap-0 z-40'
        >
            <RxCross1
                className='absolute -top-4 -right-4 cursor-pointer text-4xl p-2 bg-yellow-500 text-gray-700 rounded-full'
                onClick={() => setLikesPreview(false)}
            />
            {
                loading
                    ? <CustomLoader rows={1} height={"96px"} width={"484px"} className='bg-gray-300 rounded-md' />
                    : <>
                        <p className='text-gray-600 text-base border-b border-b-gray-600 p-2 text-center'>
                            Likes {likedUsers?.length > 0 ? `(${likedUsers?.length})` : ''}
                        </p>
                        <div className='flex flex-col gap-0 p-2'>
                            {likedUsers
                                ? likedUsers?.map(like => (
                                    <div onClick={() => setLikesPreview(false)} key={like?.id}>
                                        <Link
                                            to={`/profile/${like?.id}`}
                                            className='flex items-center cursor-pointer hover:bg-gray-200 rounded px-2'
                                        >
                                            <div className='h-10 w-10 text-gray-300 rounded-full bg-gray-700 flex items-center justify-center text-base'>
                                                {like?.name?.split(" ")[0][0]}
                                            </div>
                                            <div className='p-2 flex flex-col text-gray-600'>
                                                <p className='text-base leading-none'>{like?.name}</p>
                                                <p className='text-sm'>@{like?.username}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                                : <div className='text-base text-gray-700 p-2 text-center'>There are no likes on the post!</div>
                            }
                        </div>
                    </>
            }
        </CustomCard>
    )
}

export default PostLikes