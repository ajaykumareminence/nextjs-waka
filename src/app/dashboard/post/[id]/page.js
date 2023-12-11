"use client"

import { useEffect, useState } from "react"
import ApiClass from "@/api/api.js"
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import { CommentValues } from "@/formikHelper/InitialValues.js";
import { CommentSchema } from "@/formikHelper/Validation.js";
import { toast } from "react-hot-toast";
export default function Page({ params }) {
    const userId = Cookies.get('user_id')
    const router = useRouter();
    const [data, setData] = useState({})
    async function getPost() {
        const response = await ApiClass.getRequest('/post/getOne/' + params.id, true);
        if (response.data.status_code == 0) {
            return router.push('/dashboard')
        }
        if (response.data.status_code == 1) {
            setData(response?.data?.data || {})
        }
    }
    const formik = useFormik({
        initialValues: CommentValues,
        validationSchema: CommentSchema,
        onSubmit: async (values) => {
            const response = await ApiClass.postRequest('post/comment/' + params.id, true, values);
            if (response.data.status_code == 0) {
                return toast.error(response?.data?.message)
            }
            if (response.data.status_code == 1) {
                resetForm()
                getPost()
                return toast.success(response?.data?.message)
            }
        }
    })
    const { handleSubmit, handleChange, values, errors, touched, resetForm } = formik;
    useEffect(() => {
        getPost()
    }, [])
    async function doLike(id) {
        const response = await ApiClass.putRequest('post/doLike/' + id, true);
        if (response.data.status_code == 0) {
            return toast.error(response?.data?.message)
        }
        if (response.data.status_code == 1) {
            getPost()
        }
    }
    async function removeComment(post_id, comment_id) {
        const response = await ApiClass.deleteRequest(`post/removeComment?post_id=${post_id}&comment_id=${comment_id}`, true);
        if (response.data.status_code == 0) {
            return toast.error(response?.data?.message)
        }
        if (response.data.status_code == 1) {
            getPost()
        }
    }
    function isLiked(arrLike) {
        if (arrLike?.length > 0) {
            return arrLike.some(item => item.user_id == userId)
        }
        return false;
    }
    return (
        <>
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="posts mb-3" >
                            <div className="user-info d-flex gap-3 mb-3">
                                <div className="pic rounded-pill" style={{ cursor: 'pointer' }}>
                                    <img alt="not-found" src={data?.user?.image} className="img-fluid" style={{ height: '50px', width: '50px', }} />
                                </div>
                                <div className="extra">
                                    <p className="mb-0">{data?.user?.name}</p>
                                    <p className="mb-0">({data?.user?.email})</p>
                                </div>
                            </div>
                            <div className="description">
                                <p>{data?.description}</p>
                            </div>
                            <div className="uploaded-image mb-3" >
                                {
                                    data?.image?.map((v, index) => {
                                        return (

                                            <img src={v} alt="not-found" className="img-fluid" key={index} />
                                        )
                                    })
                                }
                            </div>
                            {
                                data?.likes?.length > 0 ? (<p>Liked by {data?.likes?.length} people.</p>) : ''
                            }
                            <div className="post-actions d-flex gap-2 mb-3">

                                <button className="btn border rounded-0" onClick={() => doLike(data.id)}>
                                    {console.log(isLiked(data?.likes))}
                                    {!isLiked(data?.likes) ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: '#333' }}><path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path></svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: '#FF0000' }}><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path></svg>

                                    }
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb-3">
                                    <input type="text" name="comment" className="form-control" placeholder="Post a comment" value={values.comment} onChange={handleChange} />
                                    <span className="input-group-text">
                                        <button className="btn btn-success">Add</button>
                                    </span>
                                </div>
                                {errors.comment && touched.comment && (<span className="text-danger">{errors.comment}</span>)}
                            </form>
                            {
                                data?.comments?.length > 0 &&

                                data?.comments?.map((v, i) => {
                                    return (
                                        <div key={i}>
                                            <div className="user-info d-flex gap-3 mb-3">
                                                <div className="pic rounded-pill" style={{ cursor: 'pointer' }}>
                                                    <img alt="not-found" src={v?.user?.image} className="img-fluid" style={{ height: '50px', width: '50px', }} />
                                                </div>
                                                <div className="extra">
                                                    <p className="mb-0">{v?.user?.name}</p>
                                                    <p className="mb-0">({v?.user?.email})</p>
                                                </div>
                                                {v?.user?.id == userId &&
                                                    <button className="btn p-0 border-0" onClick={() => removeComment(data?.id, v?.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#333"><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path></svg>
                                                    </button>
                                                }
                                            </div>

                                            <p>{v?.comment}</p>
                                            <hr />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}