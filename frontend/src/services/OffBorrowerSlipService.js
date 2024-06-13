import axios from "axios";

const axiosJWT = axios.create({
    baseURL: "http://localhost:8017",
    withCredentials: true,
});

export const createBorrowerSlip = async (token, data) => {
    try {
        const res = await axiosJWT.post(`offBorrowerSlip/create`, data, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err", err);
        throw err
    }
}

export const offBorrowerSlipStatistic = async (token, id) => {
    try {
        const res = await axiosJWT.get(`offBorrowerSlip/statistic/${id}`, {
            headers: {
                token: `Bearer ${token}`,
            }
        })
        return res.data
    } catch (err) {
        console.log("err:", err);
        throw err
    }
}