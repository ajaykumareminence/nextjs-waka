"use client"
import { useFormik } from "formik"
import { OpenChatValues } from "@/formikHelper/InitialValues.js";
import { OpenChatSchema } from "@/formikHelper/Validation.js";
import { useEffect, useRef, useState, useId } from "react";
import Cookies from "js-cookie";
export default function OpenChat() {
    const boxId = useId()
    const userId = Cookies.get('user_id')
    const [messages, setMessages] = useState([])
    const ws = useRef(null)
    const typingTimeout = useRef(null)
    const [notificationPermission, setNotificationPermission] = useState('default');

    const handleNotificationRequest = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
        }
    };
    async function connection() {
        ws.current === null ? '' : ws.current = null;
        ws.current = new WebSocket('ws://localhost:7000', Cookies.get('token'));
        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: "opened" }))
        }
        ws.current.onmessage = (e) => {
            const received = JSON.parse(e.data);
            if (received.type == "openmessage") {
                setMessages(prev => [...prev, { msg: received.msg, user: received.user }])
            }
        }
    }
    function handleUnload() {
        ws.current.send(JSON.stringify({ type: 'offline' }))
    }
    function handleVisibilityChange(e) {
        console.log(e)
        if (document.hidden) {

        }
    }
    function handleFocusChange() {
        console.log({check:notificationPermission == "granted" && !document.hasFocus()})
        if(notificationPermission == "granted" && !document.hasFocus()){
            const notification = new Notification('Hello', {
                body: 'This is a notification!',
            });
        }
    }
    useEffect(() => {
        connection()
        window.addEventListener('unload', handleUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocusChange);
        window.addEventListener('blur', handleFocusChange);
        return () => {
            ws.current.close();
            window.removeEventListener('unload', handleUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocusChange);
            window.removeEventListener('blur', handleFocusChange);
        };
    }, [])
    const formik = useFormik({
        initialValues: OpenChatValues,
        validationSchema: OpenChatSchema,
        onSubmit: async (values) => {
            const data = {
                type: "openmessage",
                msg: values.message
            }
            ws.current.send(JSON.stringify(data))
            resetForm()
        }
    })
    const { handleSubmit, handleChange, values, errors, touched, resetForm, setFieldValue } = formik;
    useEffect(() => {
        (() => {
            const el = document.getElementById(boxId);
            if (el) {
                el.scrollTop = el.scrollHeight;
            }
        })();
    }, [messages])
    
    useEffect(()=>{
        handleNotificationRequest()
    },[])

    return (
        <>
            <h5 className="text-center">Chat open for everyone...</h5>
            <div className="p-2 rounded border" id={boxId} style={{ height: '400px', overflowY: 'scroll' }}>
                {
                    messages?.length > 0 &&
                    messages.map((v, i) => {
                        return (
                            <div key={i}
                                className={`d-flex mb-3 ${userId == v?.user?.id ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div>
                                    <p className={`mb-0 ${userId == v?.user?.id ? 'text-end' : 'text-start'}`} style={{ fontSize: '12px' }}>{v?.user?.name}</p>
                                    <div className="border rounded p-2">
                                        {v.msg}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                    <input type="text" name="message" className="form-control" value={values.message} onChange={(e) => {
                        setFieldValue("message", e.target.value)
                        if (ws.current != null) {
                            clearTimeout(typingTimeout.current);
                            typingTimeout.current = setTimeout(() => { ws.current.send(JSON.stringify({ type: 'typing_stopped' })) }, 2000);
                            ws.current.send(JSON.stringify({ type: "typing_start" }))
                        }
                    }} />
                    <span className="input-group-text">
                        <button className="btn btn-danger" type="submit">Send</button>
                    </span>
                </div>
                {errors.message && touched.message &&
                    (<span className="text-danger">{errors.message}</span>)
                }
            </form>
            <p className="text-center">This chat is not saved anywhere</p>
        </>
    )
}