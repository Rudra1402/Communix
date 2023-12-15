import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CustomCard from '../custom/CustomCard'
import CustomForm from '../custom/CustomForm'
import CustomInput from '../custom/CustomInput'
import CustomButton from '../custom/CustomButton'
import { userSignup } from '../../apis/api'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AppContext from '../../context/AppContext'

const validationSchema = Yup.object({
    name: Yup.string().required("Please enter your name!"),
    username: Yup.string().required("Please enter your username"),
    email: Yup.string().email().required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!")
})

const initialValues = {
    name: "",
    username: "",
    email: "",
    password: ""
}

function Signup() {

    const { user } = useContext(AppContext)
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit(values) {
            userSignup(values)
            formik.resetForm()
        }
    })

    useEffect(() => {
        let userItem = JSON.parse(localStorage.getItem('user'))
        if (userItem?.token)
            navigate('/timeline')
    }, [user])

    return (
        <CustomCard className='h-[calc(100%-60px)] w-full flex items-center overflow-y-auto'>
            <div className='flex flex-col gap-2 items-center bg-[#0008] px-10 py-4 rounded-md m-auto'>
                <div className='text-3xl underline underline-offset-[12px] pb-2 font-medium'>Signup</div>
                <CustomForm
                    onSubmit={formik.handleSubmit}
                    className="gap-4 items-center"
                >
                    <CustomInput
                        type="text"
                        id="name"
                        name="name"
                        label="Name"
                        placeholder="Rudra Patel"
                        labelClass="text-base"
                        value={formik.values.name}
                        onChange={(event) => formik.setFieldValue("name", event.target.value)}
                    />
                    <CustomInput
                        type="text"
                        id="username"
                        name="username"
                        label="Username"
                        placeholder="rudra14"
                        labelClass="text-base"
                        value={formik.values.username}
                        onChange={(event) => formik.setFieldValue("username", event.target.value)}
                    />
                    <CustomInput
                        type="email"
                        id="email"
                        name="email"
                        label="Email"
                        placeholder="rudra14@email.com"
                        labelClass="text-base"
                        value={formik.values.email}
                        onChange={(event) => formik.setFieldValue("email", event.target.value)}
                    />
                    <CustomInput
                        type="password"
                        id="password"
                        name="password"
                        label="Password"
                        placeholder="Password"
                        labelClass="text-base"
                        value={formik.values.password}
                        onChange={(event) => formik.setFieldValue("password", event.target.value)}
                    />
                    <CustomButton
                        type='submit'
                        text="Signup"
                        size='small'
                        className="mt-2 !border-none text-base"
                    />
                </CustomForm>
                <p className='m-0 flex items-center gap-1 text-base'>
                    Already have an account? <Link to={"/login"} className='text-blue-300 underline hover:text-blue-400'>Login</Link>
                </p>
            </div>
        </CustomCard>
    )
}

export default Signup