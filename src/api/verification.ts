import { ISessionKeyCreate } from "@/types";
import axios from "axios";

const VERIFICATION_USER_URL = process.env.VUE_APP_URL + "/customer/update-kyc";
const CREATE_KYC_URL = process.env.VUE_APP_URL + "/customer/create-kyc-request-by-customer/";
const GET_LINK_UPLOAD_URL = process.env.VUE_APP_URL + "/file/create-presigned-url-files/";
const CREATE_SESSION_URL = process.env.VUE_APP_RICHCLE_URL + "partner/get-session";

export const requestVerification = (params: any) => {
  const requestBody = new FormData();

  if (params.customerId) {
    requestBody.append("customerId", params.customerId);
  }
  params.passportNo && requestBody.append("passportNo", params.passportNo);
  params.documentNo && requestBody.append("documentNo", params.documentNo);
  requestBody.append("dateOfIssue", JSON.stringify(params.date_of_issue));
  requestBody.append("dateOfExpiry", JSON.stringify(params.date_of_expiry));
  requestBody.append("firstName", params.first_name);
  requestBody.append("lastName", params.last_name);
  requestBody.append("birthday", JSON.stringify(params.birthday));
  requestBody.append("placeOfBirth", JSON.stringify(params.place_of_birth));
  requestBody.append("nationality", params.nationality);
  requestBody.append("sex", params.gender);

  if (params.frontside) {
    requestBody.append("frontside", params.frontside);
  }

  if (params.backside) {
    requestBody.append("backside", params.backside);
  }

  if (params.passport) {
    requestBody.append("passport", params.passport);
  }

  if (params.record) {
    requestBody.append("record", params.record);
  }

  return axios({
    url: VERIFICATION_USER_URL,
    data: requestBody,
    method: "put",
  });
};
export const createKycRequestByCustomer = (params: any) => {
  return axios({
    url: CREATE_KYC_URL + params.customerId,
    data: params,
    method: "put",
  });
};
export const getLinkUpload = (params: any) => {
  return axios({
    url: GET_LINK_UPLOAD_URL,
    data: params,
    method: "post",
  });
};

export const createSessionKeyToVerifyKYC = (params: ISessionKeyCreate) => {
  const requestBody = {
    ...params,
  };
  return axios({
    url: CREATE_SESSION_URL,
    method: "post",
    data: requestBody,
  });
};
