"use client"
import { SignupValues } from "@/formikHelper/InitialValues"
import { SignupSchema } from "@/formikHelper/Validation"
import { useFormik } from "formik"
import { useEffect, useState } from "react";
import ApiClass from "@/api/api.js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Signup() {
    const router = useRouter()
    const [region, setRegion] = useState([]);
    const [loading, setLoading] = useState(false)
    const getRegion = async () => {
        const response = await ApiClass.getRequest('get/region', false);
        if (response.data.status_code == 1) {
            setRegion(response.data.data || [])
        }
        if (response.data.status_code == 0) {
            toast.error(response.data.message)
        }
    }

    const doSignup = async (values) => {
        setLoading(true)
        const response = await ApiClass.postRequest('user/register', false, values);
        setLoading(false)
        if (response.data.status_code == 1) {
            resetForm()
            router.push('/login')
            return toast.success(response?.data?.message)
        }
        if (response.data.status_code == 0) {
            return toast.error(response?.data?.message)
        }
    }
    const formik = useFormik({
        initialValues: SignupValues,
        validationSchema: SignupSchema,
        onSubmit: doSignup
    })
    const { values, handleSubmit, handleChange, errors, touched, resetForm, setFieldValue } = formik;
    useEffect(() => {
        getRegion()
    }, [])
    useEffect(() => {
        setFieldValue('state_id', '')
    }, [values.country_id])
    return (
        <>
            <form onSubmit={handleSubmit} className="border p-3">
                <div className="mb-3">
                    <label>Name</label>
                    <input type="text" name="name" value={values.name} onChange={handleChange} className="form-control" />
                    {errors.name && touched.name && (<span className="text-danger" style={{ fontSize: '15px' }}>{errors.name}</span>)}
                </div>
                <div className="mb-3">
                    <label>Country</label>
                    <select className="form-select" name="country_id" value={values.country_id} onChange={handleChange}>
                        <option value="">Choose your country</option>
                        {
                            region.map((v, i) => {
                                return (
                                    <option key={i} value={v.id}>{v.name}</option>
                                )
                            })
                        }
                    </select>
                    {errors.country_id && touched.country_id && (<span className="text-danger" style={{ fontSize: '15px' }}>{errors.country_id}</span>)}
                </div>
                <div className="mb-3">
                    <label>State</label>
                    <select className="form-select" name="state_id" value={values.state_id} onChange={handleChange}>
                        <option value="">Choose your state</option>
                        {
                            region.filter((item) => item.id == values.country_id)[0]?.states?.map((v, i) => {
                                return (
                                    <option key={i} value={v.id}>{v.name}</option>
                                )
                            })
                        }
                    </select>
                    {errors.state_id && touched.state_id && (<span className="text-danger" style={{ fontSize: '15px' }}>{errors.state_id}</span>)}
                </div>
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
                <div className="mb-3">
                    <label>Confirm password</label>
                    <input type="password" name="confirm_password" value={values.confirm_password} onChange={handleChange} className="form-control" />
                    {errors.confirm_password && touched.confirm_password && (<span className="text-danger" style={{ fontSize: '15px' }}>{errors.confirm_password}</span>)}
                </div>

                {
                    loading
                        ?
                        <button className="btn btn-success rounded-0" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        :
                        <input type="submit" className="btn btn-success rounded-0" value="Create Account" />
                }
                <div>
                    <p className="mb-0 mt-2">Already have an account? <Link href={'/login'}>Login</Link></p>
                </div>
            </form>
        </>
    )
}