"use client";
import ApiClass from "@/api/api.js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";
export default function LogoutDialog() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    function showModal() {
        const el = document.getElementById('logout-dialog');
        el.showModal()
    }
    function hideModal() {
        const el = document.getElementById('logout-dialog');
        el.close()
    }
    async function doLogout(type) {
        setLoading(true)
        const response = await ApiClass.deleteRequest(`user/${type}`, true, await ApiClass.getIp());
        setLoading(false)
        if (response.data.status_code == 1) {
            Cookies.remove('token')
            router.push('/login')
            return toast.success(response.data.message)
        }
        if (response.data.status_code == 0) {
            return toast.error(response.data.message)
        }
    }
    return (

        <>
            <button className="btn btn-danger" onClick={() => showModal()}>Logout</button>
            <dialog id="logout-dialog">
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-success" onClick={() => hideModal()}>esc</button>
                </div>
                <h5 className="text-center">Are you sure you want to logout?</h5>
                <div className="d-flex justify-content-center gap-3">
                    {
                        loading ?
                            <>
                                <button className="btn btn-danger" disabled>Logout from this device</button>
                                <button className="btn btn-danger" disabled>Logout from all devices</button>
                            </>
                            :
                            <>
                                <button className="btn btn-danger" onClick={() => doLogout('logout')}>Logout from this device</button>
                                <button className="btn btn-danger" onClick={() => doLogout('hardlogout')}>Logout from all devices</button>
                            </>
                    }

                </div>
            </dialog>
        </>
    )
}