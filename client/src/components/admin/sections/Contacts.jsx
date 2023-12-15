import React, { useEffect, useState } from 'react'
import { allContacts } from '../../../apis/api'
import CustomButton from '../../custom/CustomButton'
import CustomCard from '../../custom/CustomCard'
import CustomInput from '../../custom/CustomInput'
import CustomLoader from '../../custom/CustomLoader'
import CustomTextarea from '../../custom/CustomTextarea'
import { RxCross1 } from 'react-icons/rx'

function Contacts({ chkAdmin }) {

    const [contacts, setContacts] = useState(null)
    const [loading, setLoading] = useState(false)
    const [contact, setContact] = useState(null)
    const [openContact, setOpenContact] = useState(false)

    useEffect(() => {
        if (chkAdmin)
            allContacts(setContacts, setLoading, chkAdmin)
    }, [chkAdmin])

    const viewContact = (
        <div className='h-fit max-h-[calc(100%-100px)] overflow-auto w-1/4 max-w-[33%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md flex flex-col gap-3 px-4 py-3 z-40'>
            <RxCross1
                className='absolute top-2 right-2 cursor-pointer text-3xl p-2 bg-yellow-500 text-gray-700 rounded-full'
                onClick={() => setOpenContact(false)}
            />
            <div className='text-center pb-2 border-b border-b-gray-500 text-gray-700'>View Contact</div>
            <CustomInput
                label="Name"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={contact?.name}
                readOnly
            />
            <CustomInput
                label="Email"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={contact?.email}
                readOnly
            />
            <CustomInput
                label="Subject"
                labelClass="text-base !text-gray-400"
                className='!w-full h-10'
                extraClass="!border-gray-300"
                size='none'
                value={contact?.subject}
                readOnly
            />
            <CustomTextarea
                label="Message"
                labelClass="text-base !text-gray-400"
                className='!w-full'
                extraClass="!border-gray-300"
                size='none'
                value={contact?.message}
                rows={3}
                readOnly
            />
            <CustomButton
                text="Close"
                size='none'
                onClick={() => setOpenContact(false)}
                className="!border-none !text-base h-8 w-fit px-4 mt-1 !bg-red-600 !text-white"
            />
        </div>
    )

    return (
        <CustomCard className='px-6 pt-6 pb-4 flex flex-col gap-6 h-full'>
            {openContact ? viewContact : null}
            {loading
                ? <CustomLoader rows={1} height={'100%'} width={'100%'} />
                : <>
                    <div className='text-2xl leading-none underline underline-offset-8'>Contacts ({contacts?.count})</div>
                    <div className='flex flex-col gap-3 w-full h-full overflow-y-auto'>
                        <div
                            className='px-2 py-4 flex bg-gray-100 rounded text-gray-700 text-lg'
                        >
                            <div className='w-[18%] font-semibold'>Name</div>
                            <div className='w-[22%] font-semibold'>Email</div>
                            <div className='w-[25%] font-semibold'>Subject</div>
                            <div className='w-[35%] font-semibold'>Description</div>
                        </div>
                        {contacts?.data?.map((c, index) => (
                            <div
                                className='px-2 py-2 flex bg-slate-200 rounded text-gray-700 text-lg cursor-pointer hover:bg-slate-100'
                                onClick={() => {
                                    setContact(c)
                                    setOpenContact(true)
                                }}
                                key={index}
                            >
                                <div className='w-[18%] overflow-x-auto line-clamp-1'>{c?.name}</div>
                                <div className='w-[22%] overflow-x-auto line-clamp-1'>{c?.email}</div>
                                <div className='w-[25%] overflow-x-auto line-clamp-1'>{c?.subject}</div>
                                <div className='w-[35%] overflow-hidden text-ellipsis line-clamp-1'>{c?.message}</div>
                            </div>
                        ))}
                    </div>
                </>}
        </CustomCard>
    )
}

export default Contacts