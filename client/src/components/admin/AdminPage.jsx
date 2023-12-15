import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomCard from '../custom/CustomCard'
import Toast from '../custom/CustomToast'
import Sidebar from './Sidebar'

function AdminPage({ Component }) {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        setLoading(true)
        let userItem = JSON.parse(localStorage.getItem('user'))
        if (userItem?.isAdmin == false) {
            Toast.error('Unauthorized!')
            navigate('/timeline')
            setIsAdmin(false)
        }
        else {
            setLoading(false)
            setIsAdmin(true)
        }
    }, [loading])

    return (
        <CustomCard className='flex h-[calc(100%-60px)] w-full'>
            {loading
                ? <div>Loading...</div>
                : <>
                    <Sidebar />
                    <div className='w-4/5 bg-[#0008] font-sans'>
                        {/* Pass props in this <Component />. Also, add the props in sections of admin page */}
                        <Component chkAdmin={isAdmin} />
                    </div>
                </>
            }
        </CustomCard>
    )
}

export default AdminPage