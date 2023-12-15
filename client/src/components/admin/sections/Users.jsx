import React, { useEffect, useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { getAllUsers, handleUserSuspension } from '../../../apis/api'
import CustomButton from '../../custom/CustomButton'
import CustomCard from '../../custom/CustomCard'
import CustomInput from '../../custom/CustomInput'
import CustomLoader from '../../custom/CustomLoader'

function Users({ chkAdmin }) {

    const [usersData, setUsersData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [openUser, setOpenUser] = useState(false)
    const [reRender, setReRender] = useState(new Date().getTime())

    useEffect(() => {
        if (chkAdmin)
            getAllUsers(setUsersData, setLoading, chkAdmin)
    }, [reRender, chkAdmin])

    const viewUser = (
        <div className='h-fit max-h-[calc(100%-100px)] overflow-auto w-1/4 max-w-[33%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md flex flex-col gap-3 px-4 py-3 z-40'>
            <RxCross1
                className='absolute top-2 right-2 cursor-pointer text-3xl p-2 bg-yellow-500 text-gray-700 rounded-full'
                onClick={() => setOpenUser(false)}
            />
            <div className='text-center pb-2 border-b border-b-gray-500 text-gray-700'>View User</div>
            <CustomInput
                label="Name"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={user?.name}
                readOnly
            />
            <CustomInput
                label="Username"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={user?.username}
                readOnly
            />
            <CustomInput
                label="Email"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={user?.email}
                readOnly
            />
            <CustomInput
                label="Liked posts"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={user?.liked_posts?.length}
                readOnly
            />
            <CustomInput
                label="Suspended"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={String(user?.is_suspended)}
                readOnly
            />
            <div className='flex gap-3 items-center'>
                <CustomButton
                    text="Close"
                    size='none'
                    onClick={() => setOpenUser(false)}
                    className="!border-none !text-base h-8 w-fit px-4 mt-1 !bg-red-600 !text-white"
                />
                {user?.is_suspended
                    ? <CustomButton
                        text="Unsuspend"
                        size='none'
                        onClick={() => handleUserSuspension(user?.id, { is_suspended: false }, setOpenUser, setReRender)}
                        className="!border-none !text-base h-8 w-fit px-4 mt-1 !bg-blue-500 !text-white"
                    />
                    : <CustomButton
                        text="Suspend"
                        size='none'
                        onClick={() => handleUserSuspension(user?.id, { is_suspended: true }, setOpenUser, setReRender)}
                        className="!border-none !text-base h-8 w-fit px-4 mt-1 !bg-blue-500 !text-white"
                    />
                }
            </div>
        </div>
    )

    return (
        <CustomCard className='px-6 pt-6 pb-4 flex flex-col gap-6 h-full'>
            {openUser ? viewUser : null}
            {loading
                ? <CustomLoader rows={1} height={'100%'} width={'100%'} />
                : <>
                    <div className='text-2xl leading-none underline underline-offset-8'>Users ({usersData?.count})</div>
                    <div className='flex flex-col gap-3 w-full h-full overflow-y-auto'>
                        <div
                            className='px-2 py-4 flex bg-gray-100 rounded text-gray-700 text-lg'
                        >
                            <div className='w-[25%] font-semibold'>Name</div>
                            <div className='w-[18%] font-semibold'>Username</div>
                            <div className='w-[26%] font-semibold'>Email</div>
                            <div className='w-[16%] font-semibold'>Liked posts</div>
                            <div className='w-[15%] font-semibold'>Suspended</div>
                        </div>
                        {usersData?.data?.map((user, index) => (
                            <div
                                className='px-2 py-2 flex bg-slate-200 rounded text-gray-700 text-lg cursor-pointer hover:bg-slate-100'
                                key={index}
                                onClick={() => {
                                    setUser(user)
                                    setOpenUser(true)
                                }}
                            >
                                <div className='w-[25%]'>{user?.name}</div>
                                <div className='w-[18%]'>{user?.username}</div>
                                <div className='w-[26%]'>{user?.email}</div>
                                <div className='w-[16%]'>{user?.liked_posts?.length}</div>
                                <div className='w-[15%]'>{String(user?.is_suspended)}</div>
                            </div>
                        ))}
                    </div>
                </>}
        </CustomCard>
    )
}

export default Users