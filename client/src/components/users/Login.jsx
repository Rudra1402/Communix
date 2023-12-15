import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import CustomCard from '../custom/CustomCard'
import CustomForm from '../custom/CustomForm'
import CustomInput from '../custom/CustomInput'
import CustomButton from '../custom/CustomButton'
import { userLogin } from '../../apis/api'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AppContext from '../../context/AppContext'
import Toast from '../custom/CustomToast'

const validationSchema = Yup.object({
    email: Yup.string().email().required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!")
})

const initialValues = {
    email: "",
    password: ""
}

function Login() {

    const { user, setUser } = useContext(AppContext)
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit(values) {
            userLogin(values, setUser)
            formik.resetForm()
        }
    })

    useEffect(() => {
        let userItem = JSON.parse(localStorage.getItem('user'))
        if (userItem?.token) {
            Toast.success(`Welcome ${userItem?.name}!`)
            navigate('/timeline')
        }
    }, [user])

    return (
        <CustomCard
            className='h-[calc(100%-60px)] w-full flex items-center overflow-y-auto'
        >
            <div className='h-fit w-fit bg-[#0008] m-auto px-10 py-4 rounded-md flex flex-col gap-4 items-center'>
                <div className='text-3xl underline underline-offset-[12px] pb-2 font-medium'>Login</div>
                <CustomForm
                    onSubmit={formik.handleSubmit}
                    className="gap-4 items-center"
                >
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
                        text="Login"
                        size='small'
                        className="mt-2 !border-none text-base"
                    />
                </CustomForm>
                <p className='m-0 flex items-center gap-1 text-base'>
                    Don't have an account? <Link to={"/signup"} className='text-blue-300 underline hover:text-blue-400'>Signup</Link>
                </p>
            </div>
        </CustomCard>
    )
}

export default Login