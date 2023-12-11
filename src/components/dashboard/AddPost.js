"use client"
import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import ApiClass from "@/api/api.js";
export default function AddPost({getPost}) {
    const inputRef = useRef(null);
    const [currentFile, setCurrentFile] = useState('');
    const [fileToSend, setFileToSend] = useState(null)
    const handleClick = () => {
        inputRef.current.click();
    }
    const fileChange = (e) => {
        const file = e.target.files[0] //array of files
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFileToSend(file)
            setCurrentFile(imageUrl);
        }
    }
    const formik = useFormik({
        initialValues: {
            description: ''
        },
        validationSchema: Yup.object({
            description: Yup.string().max(200, 'Max 200 characters allowed').required('Caption needed')
        }),
        onSubmit: async (values) => {
            const formdata = new FormData();
            formdata.append('description', values.description);
            if (fileToSend != null) {
                formdata.append('file', fileToSend)
            }
            const response = await ApiClass.postRequest('post/create', true, formdata, { 'Content-Type': 'multipart/form-data' });
            if (response.data.status_code == 0) {
                return toast.error(response?.data?.message)
            }
            if (response.data.status_code == 1) {
                resetForm()
                getPost()
                toast.success(response?.data?.message)
                return
            }
        }
    });
    const { handleSubmit, handleChange, values, errors, touched, resetForm } = formik;
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <textarea type="text" name="description" className="form-control" value={values.description} onChange={handleChange} />
                    <div className="input-group-text">
                        <input type="file" hidden ref={inputRef} onChange={fileChange} />
                        <button className="btn border-0" type="button" onClick={() => handleClick()}>
                            {
                                currentFile != '' ?
                                    <img alt="not-found" src={currentFile} height="35" width="35" />
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" style={{ fill: '#333' }}><path d="m9 13 3-4 3 4.5V12h4V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h8v-4H5l3-4 1 2z"></path><path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>
                            }
                        </button>
                        <button className="btn btn-success" type="submit">Add</button>
                    </div>
                </div>
                    {
                        errors.description  && touched.description && (<span className="text-danger">{errors.description}</span>)
                    }
            </form>
        </>
    )
}