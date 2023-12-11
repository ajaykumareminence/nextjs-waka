"use client"

import ApiClass from "@/api/api"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function FriendList({ data }) {
    return (
        <>
            {
                data?.length > 0
                    ?
                    data?.map((v, i) => {
                        return (
                            <React.Fragment key={i}>
                                <div className="col-md-6">
                                    <div className="border d-flex gap-3 p-3 mb-2">
                                        <img alt="not-found" src={v?.image ? v?.image : '/image/nft.jpg'} height={100} width={100} onError={(err) => err.target.src = "/images/nft.jpg"}/>
                                        <div>
                                            <h6 className="fw-bold mb-1">{v?.name}</h6>
                                            <p className="mb-1">({v?.email}) {v?.state?.name}, {v?.country?.name} </p>
                                           
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    })
                    :
                    <div className="col-md-6">
                        <div className="border p-3 mb-2">
                            <p className="text-center">Oops! you are alone here.</p>
                        </div>
                    </div>
            }
        </>
    )
}
export default function Friends() {
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [per_page, setPerPage] = useState(10)
    const [name, setName] = useState('')
    const [total_pages, setTotalPages] = useState(0)
    async function findFriends() {
        setLoading(true)
        const response = await ApiClass.getRequest(`friends/my_friends?page=${page}&per_page=${per_page}&name=${name}`, true);
        setLoading(false)
        if (response.data.status_code == 0) {
            return toast.error(response?.data?.message)
        }
        if (response.data.status_code == 1) {
            setSuggestions(response?.data?.data?.data || [])
            setPage(response?.data?.data?.current_page || 1)
            setPerPage(response?.data?.data?.per_page || 10)
            setTotalPages(response?.data?.data?.total_pages || 0)
            return 
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        findFriends();
    }
    useEffect(() => {
        findFriends()
    }, [])
    return (
        <>

            <div className="container py-4">
                <div className="d-flex mb-3 justify-content-between align-items-center">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group gap-2">
                            <input type="text" className="form-control" value={name} onChange={(e)=>setName(e.target.value)}/>
                            <span className="input-group-text p-0 border-0">
                                <button className="btn btn-outline-success">Search</button>
                            </span>
                        </div>
                    </form>
                    <div className="d-flex align-items-center gap-3">
                        <Link href="/dashboard/sent_requests">View sent requests</Link>
                        <Link href="/dashboard/received_requests">View received requests</Link>
                        <Link href="/dashboard/my_friends">My friends</Link>
                    </div>
                </div>
                <div className="row justify-content-center">
                    {
                        loading
                            ?
                            <div className="col-md-12">
                                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                            :
                            <FriendList data={suggestions} />
                    }
                </div>
                <div className="pagination d-flex justify-content-end gap-2">
                    {
                        new Array(total_pages).fill(null)?.map((v,i)=>{
                            return(
                                <button className={`btn border ${i+1 == page ? 'btn-success' : ''}`} onClick={()=>setPage(i+1)} key={i}>{i+1}</button>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}