import { IGenerateQrCode } from "@/types/transaction";
import {
  ICreateOTPDischarge,
  ICreateOTPTransaction,
} from "@/views/transaction/scan-qr-page/scan-qr-info/scanQrInfo.component";
import {
  paramsDischargeVerify,
  paramsVerify,
} from "@/views/transaction/scan-qr-page/verify-otp/verifyOtp.component";
import axios from "axios";

const TRANSACTION_CREATE_OTP = process.env.VUE_APP_URL + "/customer/payment/create-otp";
const DISCHARGE_CREATE_OTP = process.env.VUE_APP_URL + "/customer/partner-payment/create-otp";
const DISCHARGE_VERIFY_OTP = process.env.VUE_APP_URL + "/customer/partner-payment/verify-otp";
const TRANSACTION_VERIFY_OTP = process.env.VUE_APP_URL + "/customer/payment/verify-otp";
const GENERATE_QR_CODE_URL = process.env.VUE_APP_URL + "/customer/generate-qrcode";

export const requestTransactionCreateOtp = (params: ICreateOTPTransaction) => {
  return axios({
    url: TRANSACTION_CREATE_OTP,
    method: "post",
    data: params,
  });
};

export const requestDischargeCreateOtp = (params: ICreateOTPDischarge) => {
  return axios({
    url: DISCHARGE_CREATE_OTP,
    method: "post",
    data: params,
  });
};

export const requestTransactionVerifyOtp = (params: paramsVerify) => {
  return axios({
    url: TRANSACTION_VERIFY_OTP,
    method: "post",
    data: params,
  });
};

export const requestDischargeVerifyOtp = (params: paramsDischargeVerify) => {
  return axios({
    url: DISCHARGE_VERIFY_OTP,
    method: "post",
    data: params,
  });
};

export const generateQrcode = (params?: IGenerateQrCode) => {
  return axios({
    url: GENERATE_QR_CODE_URL,
    method: "post",
    data: params,
  });
};
