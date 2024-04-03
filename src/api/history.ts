import axios from "axios";

const REQUEST_USER_URL = process.env.VUE_APP_URL + "/customer/history/search-transaction";
export const loadHistoryList = (userId: string, data: any) => {
  return axios({
    url: REQUEST_USER_URL,
    method: "post",
    data: {
      customerId: userId,
      status: data.status,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      type: data.type,
      page: data.page,
      size: data.size,
    },
  });
};
