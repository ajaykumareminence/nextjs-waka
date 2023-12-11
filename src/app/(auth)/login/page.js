"use client"
import ApiClass from "@/api/api";
import { LoginValues } from "@/formikHelper/InitialValues";
import { LoginSchema } from "@/formikHelper/Validation";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    async function doLogin(values) {
        setLoading(true)
        const response = await ApiClass.postRequest('user/login', false, values, await ApiClass.getIp());
        setLoading(false)
        if (response.data.status_code == 0) {
            return toast.error(response?.data?.message)
        }
        if (response.data.status_code == 1) {
            Cookies.set('token', response?.data?.token || '', { expires: 1 })
            Cookies.set('user_id', response?.data?.data?.id || '')
            resetForm()
            router.push('/dashboard')
            return toast.success(response?.data?.message)
        }
    }
    const formik = useFormik({
        initialValues: LoginValues,
        validationSchema: LoginSchema,
        onSubmit: doLogin
    });
    const { handleSubmit, handleChange, values, errors, touched, resetForm } = formik;

    return (
        <>
            <form onSubmit={handleSubmit} className="border p-3">
                <div className="mb-3">
                    <label>Email</label>
                    <input type="text" name="email" value={values.email} onChange={handleChange} className="form-control" />
                    {errors.email && touched.email && (<span className="text-danger" style={{ fontSize: '15px' }}>{errors.email}</span>)}
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input type="password" name="password" value={values.password} onChange={handleChange} className="form-control" />
                    {errors.password && touched.password && (<span className="text-danger" style={{ fontSize: '15px' }}>{errors.password}</span>)}
                </div>
                {
                    loading
                        ?
                        <button className="btn btn-success rounded-0" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        :
                        <input type="submit" className="btn btn-success rounded-0" value="Login" />
                }
                <div>
                    <p className="mb-0 mt-2">Don't have account? <Link href={'/signup'}>Signup</Link></p>
                </div>
            </form>

        </>
    )
}