import axios from "axios";
const axiosClient = axios.create({
    baseURL: 'http://192.168.29.235:7000/v1/'
});
export default axiosClient;