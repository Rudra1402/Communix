import React, { useState } from 'react'
import CustomCard from '../custom/CustomCard'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AppContext from '../../context/AppContext'

function Navbar() {

    const { user, setUser } = useContext(AppContext)
    const navigate = useNavigate()
    const [openDropdown, setOpenDropdown] = useState(false)

    const renderDropdown = (
        <div className='absolute top-11 right-1 flex flex-col gap-0 bg-gray-100 px-2 py-1 z-50 rounded select-none'>
            <Link
                to={`/profile/${user?.id}`}
                className='text-gray-800 text-lg hover:text-blue-500 font-medium h-full pl-4 pr-8 py-2 cursor-pointer hover:bg-slate-200 rounded'
                onClick={() => setOpenDropdown(false)}
            >
                Profile
            </Link>
            <div
                className='text-gray-800 text-lg hover:text-red-500 font-medium h-full pl-4 pr-8 py-2 cursor-pointer hover:bg-slate-200 rounded'
                onClick={() => {
                    setOpenDropdown(false)
                    localStorage.removeItem('user')
                    setUser(null)
                    navigate('/')
                }}
            >
                Logout
            </div>
        </div>
    )

    return (
        <CustomCard className='w-full flex items-center justify-end py-4 px-12 gap-4 bg-gradient-to-b from-indigo-400 to-blue-400 select-none'>
            <Link
                to={"/"}
                className='text-gray-800 text-xl hover:underline hover:text-yellow-300 font-medium h-full px-2 cursor-pointer'
            >Home</Link>
            <Link
                to={"/about"}
                className='text-gray-800 text-xl hover:underline hover:text-yellow-300 font-medium h-full px-2 cursor-pointer'
            >About</Link>
            {user
                ? <Link
                    to={"/timeline"}
                    className='text-gray-800 text-xl hover:underline hover:text-yellow-300 font-medium h-full px-2 cursor-pointer'
                >Timeline</Link>
                : null
            }
            {user?.isAdmin
                ? <Link
                    className='text-gray-800 text-xl hover:underline hover:text-yellow-300 font-medium h-full px-2 cursor-pointer'
                    to={'/admin/users'}
                >Dashboard</Link>
                : null
            }
            {!user && <Link
                to={"/login"}
                className='text-gray-800 text-xl hover:underline hover:text-yellow-300 font-medium h-full px-2 cursor-pointer'
            >Login</Link>}
            {!user && <Link
                to={"/signup"}
                className='text-gray-800 text-xl hover:underline hover:text-yellow-300 font-medium h-full px-2 cursor-pointer'
            >Signup</Link>}
            {user
                ? <div
                    className='h-7 w-7 rounded-full text-lg flex items-center justify-center bg-gray-700 cursor-pointer relative'
                    onClick={() => setOpenDropdown(!openDropdown)}
                >
                    {user?.name[0]}
                    {openDropdown ? renderDropdown : null}
                </div>
                : null
            }
        </CustomCard>
    )
}

export default Navbar