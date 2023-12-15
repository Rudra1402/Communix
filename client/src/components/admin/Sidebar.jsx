import React, { useEffect, useState } from 'react'
import CustomCard from '../custom/CustomCard'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

function Sidebar() {
    const [activeTab, setActiveTab] = useState(null)
    useEffect(() => {
        const url = window.location.pathname
        if (url.includes('users'))
            setActiveTab(1)
        else if (url.includes('reports'))
            setActiveTab(2)
        else if (url.includes('contacts'))
            setActiveTab(3)
    }, [activeTab])
    return (
        <CustomCard
            className='bg-[#0008] w-1/5 flex flex-col gap-4 px-4 py-8 border-r border-red-200'
        >
            <Link
                className={classNames('text-xl  hover:bg-yellow-500 hover:no-underline font-medium h-fit px-2 py-1 cursor-pointer w-full text-center rounded', activeTab == 1 ? 'bg-yellow-500 text-blue-700' : 'bg-[#fff4] text-gray-200')}
                onClick={() => setActiveTab(1)}
                to={'/admin/users'}
            >Users</Link>
            <Link
                className={classNames('text-xl hover:bg-yellow-500 hover:no-underline font-medium h-fit px-2 py-1 cursor-pointer w-full text-center rounded', activeTab == 2 ? 'bg-yellow-500 text-blue-700' : 'bg-[#fff4] text-gray-200')}
                onClick={() => setActiveTab(2)}
                to={'/admin/reports'}
            >Reports</Link>
            <Link
                className={classNames('text-xl hover:bg-yellow-500 hover:no-underline font-medium h-fit px-2 py-1 cursor-pointer w-full text-center rounded', activeTab == 3 ? 'bg-yellow-500 text-blue-700' : 'bg-[#fff4] text-gray-200')}
                onClick={() => setActiveTab(3)}
                to={'/admin/contacts'}
            >Contacts</Link>
        </CustomCard>
    )
}

export default Sidebar