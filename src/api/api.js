import axios from "axios";
import Cookies from "js-cookie";
export default class ApiClass {
    
    static baseUrl = "http://192.168.29.235:7000/v1/";

    static getRequest(apiUrl, token = true, params = null) {
        return axios.get(this.baseUrl + apiUrl, this.config(token, params)).then((response) => {
            return response;
        }).catch((err) => {
            if (err.response?.status == 401) {
                this.unauthRedirect()
            }
            return this.customError(err)
        })
    }
    
    static postRequest(apiUrl, token = true, formData = null, params = null) {
        return axios.post(this.baseUrl + apiUrl, formData == null ? {} : formData, this.config(token, params)).then((response) => {
            return response;
        }).catch((err) => {
            if (err.response?.status == 401) {
                this.unauthRedirect()
            }
            return this.customError(err)
        })
    }

    static deleteRequest(apiUrl, token = true, params = null) {
        return axios.delete(this.baseUrl + apiUrl, this.config(token, params)).then((response) => {
            return response;
        }).catch((err) => {
            if (err.response?.status == 401) {
                this.unauthRedirect()
            }
            return this.customError(err)
        })
    }

    static putRequest(apiUrl, token = true, formData = null, params = null) {
        return axios.put(this.baseUrl + apiUrl, formData == null ? {} : formData, this.config(token, params)).then((response) => {
            return response;
        }).catch((err) => {
            if (err.response?.status == 401) {
                this.unauthRedirect()
            }
            return this.customError(err)
        })
    }

    static config(token = true, params = null) {
        var conn = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        if (token) {
            conn.headers['Authorization'] = `Bearer ${Cookies.get('token')}`
        }
        if (params) {
            Object.assign(conn.headers, params)
        }
        return conn;
    }

    static unauthRedirect() {
        Cookies.remove("token");
        Cookies.remove("user_id");
        window.location.replace('/login');
    }

    static customError(err){
        return {
            data:{
                status_code: 0,
                message: err.message,
                status_text: 'Axios Error'
            }
        }
    }

    static getIp() {
        return axios.get('https://api.ipify.org?format=json').then((response) => {
            return { "client-address": response.data?.ip }
        }).catch((err) => {
            return null
        })
    }
}