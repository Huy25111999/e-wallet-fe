import axios from "axios";

const REQUEST_USER_URL = process.env.VUE_APP_URL + "/customer/deposit";
export const deposit = (data) => {
    return axios({
        url: REQUEST_USER_URL,
        method: "post",
        data: data
    });
};
