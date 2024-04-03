import axios from "axios";

const REQUEST_CODE_LOGIN_URL = process.env.VUE_APP_URL + "/customer/login/create-otp";
const REQUEST_LOGIN_URL = process.env.VUE_APP_URL + "/customer/login/verify-otp";
const REQUEST_LOGIN_RICHCLE_URL = process.env.VUE_APP_URL + "/customer/login-sso";

type requestCode = {
  phone: string;
  countryCode: string;
};

type requestLogin = {
  otpCode: string;
  phone: string;
  otpToken: string;
};

type requestRichcleLogin = {
  appid: string;
  email: string;
  uid: string;
  sessionKey: {
    ip: string;
    key: string;
  };
};

export const requestCodeLogin = (params: requestCode) => {
  const requestBody = { ...params };

  return axios({
    url: REQUEST_CODE_LOGIN_URL,
    method: "post",
    data: requestBody,
  });
};

export const requestLogin = (params: requestLogin) => {
  const requestBody = { ...params };

  return axios({
    url: REQUEST_LOGIN_URL,
    method: "post",
    data: requestBody,
  });
};

export const requestRichcleLogin = (params: requestRichcleLogin) => {
  const requestBody = { ...params };

  return axios({
    url: REQUEST_LOGIN_RICHCLE_URL,
    method: "post",
    data: requestBody,
  });
};
