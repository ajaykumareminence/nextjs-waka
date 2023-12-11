"use client";
import React, { useEffect, useState } from "react";
import ApiClass from "@/api/api.js";
import toast from "react-hot-toast";

function Activity({ data }) {
    return (
        <>
            {data?.length > 0
                ?
                data.map((v, i) => {
                    return (
                        <React.Fragment key={i}>
                            <div className="border p-3 mb-2">
                                <p>Activity: {v.type}</p>
                                <p>Ip Address: {v.ip_address}</p>
                                <p>Time: {new Date(v.created_at)?.toLocaleString()}</p>
                            </div>
                        </React.Fragment>
                    )
                })
                :
                <div className="border p-3 mb-2">
                    <p className="text-center">No data found.</p>
                </div>
            }
        </>
    )
}
export default function ActivityLogs() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [per_page, setPerPage] = useState(10);
    const [total_pages, setTotalPages] = useState(0)
    async function getActivities() {
        setLoading(true)
        const response = await ApiClass.getRequest(`user/activities?page=${page}&per_page=${per_page}`, true);
        setLoading(false);
        if (response.data.status_code == 1) {
            setActivities(response.data.data.data || [])
            setTotalPages(response?.data?.data?.total_pages || 0)
            return
        }
        if (response.data.status_code == 0) {
            return toast.error(response.data.message)
        }
    }
    useEffect(() => {
        getActivities()
    }, [page])
    
    return (
        <>
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        {
                            loading
                                ?
                                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                                :
                                <Activity data={activities} />
                        }
                    </div>
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