import React, { useEffect, useState } from 'react'
import { RxCross1 } from 'react-icons/rx'
import { allReports } from '../../../apis/api'
import CustomButton from '../../custom/CustomButton'
import CustomCard from '../../custom/CustomCard'
import CustomInput from '../../custom/CustomInput'
import CustomLoader from '../../custom/CustomLoader'
import CustomTextarea from '../../custom/CustomTextarea'

function Reports({ chkAdmin }) {

    const [reportsData, setReportsData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [openReport, setOpenReport] = useState(false)

    useEffect(() => {
        if (chkAdmin)
            allReports(setReportsData, setLoading, chkAdmin)
    }, [chkAdmin])

    const viewReport = (
        <div className='h-fit max-h-[calc(100%-100px)] overflow-auto w-1/4 max-w-[33%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md flex flex-col gap-3 px-4 py-3 z-40'>
            <RxCross1
                className='absolute top-2 right-2 cursor-pointer text-3xl p-2 bg-yellow-500 text-gray-700 rounded-full'
                onClick={() => setOpenReport(false)}
            />
            <div className='text-center pb-2 border-b border-b-gray-500 text-gray-700'>View Report</div>
            <CustomInput
                label="Post Title"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={report?.title}
                readOnly
            />
            <CustomInput
                label="Post User"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={report?.to_name}
                readOnly
            />
            <CustomInput
                label="Reporting User"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={report?.by_name}
                readOnly
            />
            {report?.description != ""
                ? <CustomTextarea
                    label="Description"
                    labelClass="text-base !text-gray-400"
                    className='!w-full'
                    extraClass="!border-gray-300"
                    size='none'
                    value={report?.description}
                    rows={3}
                    readOnly
                />
                : null
            }
            <CustomButton
                text="Close"
                size='none'
                onClick={() => setOpenReport(false)}
                className="!border-none !text-base h-8 w-fit px-4 mt-1 !bg-red-600 !text-white"
            />
        </div>
    )

    return (
        <CustomCard className='px-6 pt-6 pb-4 flex flex-col gap-6 h-full'>
            {openReport ? viewReport : null}
            {loading
                ? <CustomLoader rows={1} height={'100%'} width={'100%'} />
                : <>
                    <div className='text-2xl leading-none underline underline-offset-8'>Reports ({reportsData?.count})</div>
                    <div className='flex flex-col gap-3 w-full h-full overflow-y-auto'>
                        <div
                            className='px-2 py-4 flex bg-gray-100 rounded text-gray-700 text-lg'
                        >
                            <div className='w-[25%] font-semibold'>Post Title</div>
                            <div className='w-[20%] font-semibold'>Post User</div>
                            <div className='w-[20%] font-semibold'>Reporting User</div>
                            <div className='w-[35%] font-semibold'>Description</div>
                        </div>
                        {reportsData?.data?.map((user, index) => (
                            <div
                                className='px-2 py-2 flex bg-slate-200 hover:bg-slate-100 cursor-pointer rounded text-gray-700 text-lg'
                                key={index}
                                onClick={() => {
                                    setReport(user)
                                    setOpenReport(true)
                                }}
                            >
                                <div className='w-[25%]'>{user?.title}</div>
                                <div className='w-[20%]'>{user?.to_name}</div>
                                <div className='w-[20%]'>{user?.by_name}</div>
                                <div className='w-[35%] overflow-hidden text-ellipsis line-clamp-1'>{user?.description == "" ? "None" : user?.description}</div>
                            </div>
                        ))}
                    </div>
                </>}
        </CustomCard>
    )
}

export default Reports