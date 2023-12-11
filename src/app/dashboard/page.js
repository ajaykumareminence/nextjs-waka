"use client"
import ApiClass from "@/api/api";
import AddPost from "@/components/dashboard/AddPost";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
import OpenChat from "@/components/dashboard/OpenChat.js";
export default function Page() {
    const userId = Cookies.get("user_id") || 0;
    const [post, setPost] = useState([])
    async function getPost() {
        const response = await ApiClass.getRequest('post/get', true);
        if (response.data.status_code == 0) {
            return toast.error(response.data.message)
        }
        if (response.data.status_code == 1) {
            setPost(response?.data?.data || [])
            return
        }
    }
    async function doLike(id) {
        const response = await ApiClass.putRequest('post/doLike/' + id, true);
        if (response.data.status_code == 0) {
            return toast.error(response?.data?.message)
        }
        if (response.data.status_code == 1) {
            getPost()
        }
    }
    useEffect(() => {
        getPost()
    }, [])

    function isLiked(arrLike) {
        if (arrLike.length > 0) {
            return arrLike.some(item => item.user_id == userId)
        }
        return false;
    }
    return (
        <>
            <div className="container p-4">
                <div className="row">
                    <div className="col-md-7">
                        <div className="user-actions mb-3">
                            <h6 className="fw-bold">Create a post</h6>
                            <AddPost getPost={getPost} />
                        </div>
                        <hr />
                        {
                            post?.length == 0
                                ?
                                <p>Seems like nothing here yet</p>
                                :
                                post?.map((v, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <div className="posts mb-3" >
                                                <div className="user-info d-flex gap-3 mb-3">
                                                    <div className="pic rounded-pill" style={{ cursor: 'pointer' }}>
                                                        <img alt="not-found" src={v?.user?.image} className="img-fluid" style={{ height: '50px', width: '50px', }} />
                                                    </div>
                                                    <div className="extra">
                                                        <p className="mb-0">{v?.user?.name}</p>
                                                        <p className="mb-0">({v?.user?.email})</p>
                                                    </div>
                                                </div>
                                                <div className="description">
                                                    <p>{v?.description}</p>
                                                </div>
                                                <div className="uploaded-image mb-3" >
                                                    {
                                                        v?.image?.map((data, index) => {
                                                            return (

                                                                <img src={data} alt="not-found" className="img-fluid" key={index} />
                                                            )
                                                        })
                                                    }
                                                </div>
                                                {
                                                    v?.likes?.length > 0 ? (<p>Liked by {v?.likes?.length} people.</p>) : ''
                                                }
                                                <div className="post-actions d-flex gap-2">

                                                    <button className="btn border rounded-0" onClick={() => doLike(v.id)}>

                                                        {!isLiked(v?.likes) ?
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: '#333' }}><path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path></svg>
                                                            :
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: '#FF0000' }}><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path></svg>

                                                        }
                                                    </button>
                                                    <Link href={'/dashboard/post/'+v?.id}>
                                                    <button className="btn border rounded-0" >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: '#333' }}><path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"></path></svg>
                                                    </button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                        </React.Fragment>
                                    )
                                })
                        }


                    </div>
                    <div className="col-md-5">
                        <OpenChat />
                    </div>
                </div>
            </div>
        </>
    )
}