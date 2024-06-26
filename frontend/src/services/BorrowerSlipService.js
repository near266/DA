import { axiosJWT } from "../utils/httpRequest";

export const createBorrowerSlip = async (token, data) => {
    try {
        const res = await axiosJWT.post(`borrowerSlip/create`, data, {
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

export const borrowerSlipStatistic = async (token, id) => {
    try {
        const res = await axiosJWT.get(`borrowerSlip/statistic/${id}`, {
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

export const getUserBrSlip = async (token, id) => {
    try {
        console.log("token", token)
        console.log("id", id)
        const res = await axiosJWT.get(`borrowerSlip/get-user-slip/${id}`, {
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

export const cancelBorrow = async (token, id) => {
    try {
        const res = await axiosJWT.delete(`borrowerSlip/cancel-borrow/${id}`, {
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
