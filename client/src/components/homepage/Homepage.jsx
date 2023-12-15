import React from 'react'
import { useContext } from 'react'
import AppContext from '../../context/AppContext'
import CustomButton from '../custom/CustomButton'
import CustomCard from '../custom/CustomCard'
import CustomForm from '../custom/CustomForm'
import CustomInput from '../custom/CustomInput'
import CustomTextarea from '../custom/CustomTextarea'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { postContact } from '../../apis/api'
import { Link } from 'react-router-dom'

const validationSchema = Yup.object({
    name: Yup.string().required('Please enter your name'),
    email: Yup.string().required('Please enter your email'),
    subject: Yup.string().required('Please enter your subject'),
    message: Yup.string().required('Please enter your message')
})

function Homepage() {
    const { user } = useContext(AppContext)

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: ''
        },
        validationSchema: validationSchema,
        onSubmit(values) {
            postContact(values)
            formik.resetForm()
        }
    })

    return (
        <CustomCard className={
            'h-[calc(100%-60px)] w-full flex items-center'
        }>
            <div className='flex flex-col items-center justify-center h-5/6 w-2/3 gap-4'>
                <div
                    className='font-bold text-6xl tracking-wider border-b-2 pb-2 border-b-red-400'
                >Communix</div>
                {user
                    ? <p className='p-4 text-lg rounded bg-[#0008] leading-none'>
                        Hello <span className='text-2xl text-red-400'>{user?.name}</span>, welcome to Communix!</p>
                    : null
                }
                <p className='text-lg text-gray-200'>Explore, engage, and embrace your social world.</p>
                {!user
                    ? <div className='flex items-center gap-3'>
                        <Link
                            to={'/login'}
                            className="rounded !text-base py-1.5 w-fit px-6 mt-1 !bg-green-400 !text-gray-700"
                        >Login</Link>
                        <Link
                            to={'/signup'}
                            className="rounded !text-base py-1.5 w-fit px-6 mt-1 !bg-green-400 !text-gray-700"
                        >Signup</Link>
                    </div>
                    : <div className='flex items-center gap-3'>
                        <Link
                            to={`/profile/${user?.id}`}
                            className="rounded !text-base py-1.5 w-fit px-6 mt-1 !bg-green-600 !text-gray-200"
                        >Profile</Link>
                        <Link
                            to={'/timeline'}
                            className="rounded !text-base py-1.5 w-fit px-6 mt-1 !bg-green-600 !text-gray-200"
                        >Timeline</Link>
                    </div>
                }
            </div>
            <div className='w-1/3 h-full flex flex-col gap-2 items-center py-4 px-8 overflow-y-auto bg-[#0008]'>
                <fieldset className='w-full border border-gray-200 my-auto rounded px-2 py-1'>
                    <legend className='text-2xl px-2'>Contact The Admin</legend>
                    <CustomForm
                        className='w-full flex flex-col gap-2 rounded p-4'
                        onSubmit={formik.handleSubmit}
                    >
                        <CustomInput
                            type="text"
                            id="name"
                            name="name"
                            label="Name"
                            labelClass="text-base !text-gray-300"
                            className='!w-full h-10'
                            extraClass="!border-gray-300 !bg-gray-300"
                            size='none'
                            placeholder="Ethan Hunt"
                            value={formik.values.name}
                            onChange={(event) => formik.setFieldValue('name', event.target.value)}
                        />
                        <CustomInput
                            type="email"
                            id="email"
                            name="email"
                            label="Email"
                            labelClass="text-base !text-gray-300"
                            className='!w-full h-10'
                            extraClass="!border-gray-300 !bg-gray-300"
                            size='none'
                            placeholder="ethanhunt@email.com"
                            value={formik.values.email}
                            onChange={(event) => formik.setFieldValue('email', event.target.value)}
                        />
                        <CustomInput
                            type="text"
                            id="subject"
                            name="subject"
                            label="Subject"
                            labelClass="text-base !text-gray-300"
                            className='!w-full h-10'
                            extraClass="!border-gray-300 !bg-gray-300"
                            size='none'
                            placeholder="Provide a brief about the platform"
                            value={formik.values.subject}
                            onChange={(event) => formik.setFieldValue('subject', event.target.value)}
                        />
                        <CustomTextarea
                            type="text"
                            id="desc"
                            name="desc"
                            label="Message"
                            labelClass="text-base !text-gray-300"
                            className='!w-full'
                            extraClass="!border-gray-300 !bg-gray-300"
                            size='none'
                            rows={3}
                            placeholder="Write your message here..."
                            value={formik.values.message}
                            onChange={(event) => formik.setFieldValue('message', event.target.value)}
                        />
                        <CustomButton
                            type="submit"
                            text="Send"
                            size='none'
                            className="!border-none !text-base h-8 w-fit px-4 mt-1 !bg-purple-700 !text-white"
                        />
                    </CustomForm>
                </fieldset>
            </div>
        </CustomCard>
    )
}

export default Homepage