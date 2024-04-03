import axios from "axios";

const REQUEST_USER_URL = process.env.VUE_APP_URL + "/customer/deposit/create-checkout-session/";
const REQUEST_WITHDRAW_OTP_URL = process.env.VUE_APP_URL + "/customer/withdraw/";
const REQUEST_URL = process.env.VUE_APP_URL + "/";
const REQUEST_DELETE_CARD = process.env.VUE_APP_URL + "/remove-banking-card";
const REQUEST_REMOVE_CARD = process.env.VUE_APP_URL + "/customer/creditcard/delete/";

type topUpData = {
  amount: number;
};

export const requestTopUp = (userId: string, data: topUpData) => {
  return axios({
    url: REQUEST_USER_URL + userId,
    method: "post",
    data: data,
  });
};
export const requestWithdrawOTP = (data: any) => {
  return axios({
    url: REQUEST_WITHDRAW_OTP_URL + "create-otp",
    method: "post",
    data: data,
  });
};
export const requestVerifyOtp = (data: any) => {
  return axios({
    url: REQUEST_WITHDRAW_OTP_URL + "verify-otp",
    method: "post",
    data: data,
  });
};

export const deleteCard = (data: any) => {
  return axios({
    url: REQUEST_DELETE_CARD,
    method: "delete",
    data: data,
  });
};

export const removeCard = (userId: string, data: any) => {
  return axios({
    url: REQUEST_REMOVE_CARD + userId,
    method: "delete",
    data: data,
  });
};

export const requestAddBank = (data: any) => {
  return axios({
    url: REQUEST_URL + "add-banking-card",
    method: "post",
    data: data,
  });
};

export const requestAddCard = (data: any) => {
  return axios({
    url: REQUEST_URL + "customer/creditcard/create",
    method: "post",
    data: data,
  });
};
