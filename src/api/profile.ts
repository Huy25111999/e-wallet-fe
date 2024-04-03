import { IParamsUpdatePhone, IParamsUploadAvatar } from "@/types/profile";
import axios from "axios";

const REQUEST_USER_URL = process.env.VUE_APP_URL + "/customer/get-customer/";
const REQUEST_USER_CARD_URL = process.env.VUE_APP_URL + "/customer/creditcard/filter?customerId=";
const REQUEST_UPDATE_AVATAR = process.env.VUE_APP_URL + "/customer/update-avatar/";
const REQUEST_UPDATE_PHONE = process.env.VUE_APP_URL + "/customer/update-phone-by-customer/";
const REQUEST_GET_IMAGE = process.env.VUE_APP_URL + "/file/get-file";
//const GET_COUNTRY_URL = "https://gv5ypaomcg.execute-api.ap-east-1.amazonaws.com/dev/" +  "/country/search";
const GET_COUNTRY_URL = process.env.VUE_APP_URL +  "/country/search";

export const requestUserInfo = (userId: string) => {
  return axios({
    url: REQUEST_USER_URL + userId,
    method: "get",
  });
};

export const requestUserCard = (userId: string) => {
  return axios({
    url: REQUEST_USER_CARD_URL + userId,
    method: "get",
  });
};

export const updateAvatar = (params: IParamsUploadAvatar) => {
  const formData = new FormData();
  formData.append("avatar", params.avatar);

  return axios({
    url: REQUEST_UPDATE_AVATAR + params.userId,
    method: "put",
    data: formData,
  });
};

export const updatePhone = (params: IParamsUpdatePhone) => {
  const requestBody = { ...params };
  return axios({
    url: REQUEST_UPDATE_PHONE + params.userId,
    method: "put",
    data: requestBody,
  });
};

export const getImage = (params: string[]) => {
  const requestBody = {
    fileKeys: params,
  };
  return axios({
    url: REQUEST_GET_IMAGE,
    method: "post",
    data: requestBody,
  });
};


export const getAllNation = (params: any) => {
  const requestBody = {...params};
  return axios({
      url: GET_COUNTRY_URL,
      method:"POST",
      data: requestBody
  })
};
