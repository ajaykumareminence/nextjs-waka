"use client"
import ApiClass from "@/api/api.js"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import toast from "react-hot-toast"
export default function Profile() {
    const inputRef = useRef(null)
    function handleEditClick() {
        inputRef.current.click()
    }
    const [profile, setProfile] = useState(null);
    const [image, setImage] = useState('')
    const getProfile = async () => {
        const response = await ApiClass.getRequest(`user/profile`, true);
        if (response.data.status_code == 0) {
            return toast.error(response?.data?.message)
        }
        if (response.data.status_code == 1) {
            setProfile(response.data.data || null)
            setImage(response?.data?.data?.image || '')
            return
        }
    }
    const handleImage = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        if (!isImageFile(file)) {
            return toast.error(`Only jpeg, png, gif, svg, webp allowed`)
        }
        const formData = new FormData();
        formData.append('file', file);
        const response = await ApiClass.postRequest('user/image-upload', true, formData, { 'Content-Type': 'multipart/form-data' });
        if (response.data.status_code == 0) {
            return toast.error(response?.data?.message)
        }
        if (response.data.status_code == 1) {
            getProfile()
            return toast.success(response?.data?.message)
        }
    }
    function isImageFile(file) {
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']; // Add more image MIME types if needed.
        return imageTypes.includes(file.type); ``
    }
    useEffect(() => {
        getProfile()
    }, [])
    return (
        <>
            <div className="container py-4">
                <div className="row">
                    <div className="col-md-12">
                        <div className="d-flex gap-4">
                            <div className="profile-image text-center">
                                <img className="mb-3" loading="lazy" alt="not-found" src={image != '' ? image : '/images/nft.jpg'} height={200} width={200} onError={(err) => err.target.src = "/images/nft.jpg"} /><br />
                                <button className="btn btn-warning" onClick={() => handleEditClick()}>Edit Profile Photo</button>
                                <input type="file" name="file" accept="image/*" hidden ref={inputRef} onChange={handleImage} />
                            </div>
                            <div className="profile-info">
                                <p>Name: {profile?.name}</p>
                                <p>Email Address: {profile?.email}</p>
                                <p>Country: {profile?.country?.name}</p>
                                <p>State: {profile?.state?.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}