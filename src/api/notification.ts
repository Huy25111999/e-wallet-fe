import { IUpdateStatusNotification } from "@/types";
import axios from "axios";

const GET_NOTIFICATION_LIST_URL = process.env.VUE_APP_URL + "/customer/filter-notification";
const CHANGE_STATUS_NOTIFICATION_LIST_URL = process.env.VUE_APP_URL + "/customer/change-status";
const GET_GUIDE_LIST_URL = process.env.VUE_APP_URL + "/guide/search";

export const filterNotification = (userId: string, data: any) => {
  return axios({
    url: GET_NOTIFICATION_LIST_URL,
    method: "get",
    params: {
      customerId: userId,
      page: data.page,
      size: data.size,
    },
  });
};

export const updateStatusNotifications = (params: IUpdateStatusNotification) => {
  return axios({
    url: CHANGE_STATUS_NOTIFICATION_LIST_URL,
    method: "post",
    data: { ...params },
  });
};

export const getGuideList = (params: any) => {
  return axios({
    url: GET_GUIDE_LIST_URL,
    method: "post",
    data: { ...params },
  });
};
