import React from 'react'
import CustomCard from '../custom/CustomCard'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { createNewPost } from '../../apis/api'
import CustomForm from '../custom/CustomForm'
import CustomButton from '../custom/CustomButton'
import CustomInput from '../custom/CustomInput'
import CustomTextarea from '../custom/CustomTextarea'
import { RxCross1 } from 'react-icons/rx'
import { getUserId } from '../../utils/getLocalStorage'

const initialValues = {
    title: "",
    content: ""
}

const validationSchema = Yup.object({
    title: Yup.string().required("Post title cannot be empty!"),
    content: Yup.string().required("A post cannot be empty!")
})

function CreatePost({ setOpenCreatePost, setReRender }) {

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit(values) {
            createNewPost(values, getUserId(), setReRender, setOpenCreatePost)
            formik.resetForm()
        }
    })

    return (
        <CustomCard
            className='h-fit w-fit p-8 bg-white flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md z-40'
        >
            <RxCross1
                className='absolute -top-4 -right-4 cursor-pointer text-4xl p-2 bg-yellow-500 text-gray-700 rounded-full'
                onClick={() => setOpenCreatePost(false)}
            />
            <CustomForm
                onSubmit={formik.handleSubmit}
                className="gap-4 items-center"
            >
                <CustomInput
                    type="text"
                    id="title"
                    size='large'
                    name="title"
                    label="Title"
                    labelClass="text-base !text-gray-500"
                    extraClass="!border-gray-300"
                    placeholder="Master React.js!"
                    value={formik.values.title}
                    onChange={(event) => formik.setFieldValue("title", event.target.value)}
                />
                <CustomTextarea
                    id="content"
                    name="content"
                    label="Content"
                    size='large'
                    rows={4}
                    labelClass="text-base !text-gray-500"
                    extraClass="!border-gray-300"
                    placeholder="Hey folks, I am excited to share my collaboration..."
                    value={formik.values.content}
                    onChange={(event) => formik.setFieldValue("content", event.target.value)}
                />
                <CustomButton
                    type='submit'
                    text="Create Post"
                    size='medium'
                    className="mt-2 !border-none text-base !text-white !bg-purple-600"
                />
            </CustomForm>
        </CustomCard>
    )
}

export default CreatePost