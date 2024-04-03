import { presentToast } from "@/helpers/toastHelper";
import router from "@/router";

function getLanguage(lang: any) {
  switch (lang) {
    case "kr": {
      return "ko";
    }
    case "vn": {
      return "vi";
    }
    default: {
      return "en-US,en;q=0.9en";
    }
  }
}

const setUpAxios = (axios: any, store: any) => {
  // Add a request interceptor
  axios.interceptors.request.use(
    function (request: any) {
      const token = store.getters.auth.token;
      const langCurrent = store.getters.language.language;
      request.headers["accept-language"] = getLanguage(langCurrent);

      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      // Do something before request is sent
      return request;
    },

    function (error: any) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    function (response: any) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error: any) {
      if (
        error.response.status === 401 ||
        error.response.data.code === "ERROR_ACCOUNT_LOGGED_IN_ON_ANOTHER_DEVICE"
      ) {
        store.dispatch("auth/logout");
        router.push("/");
      }
      if (error.response.data.code === "ERROR_ACCOUNT_LOGGED_IN_ON_ANOTHER_DEVICE") {
        presentToast(error.response.data.message, "top");
      }
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );
};

export default setUpAxios;
