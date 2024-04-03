import { IUserInfo } from "@/types";

const state = {
  token: null,
  customerId: null,
  userInfo: null,
  cardInfo: null,
};

const mutations = {
  INFO_FETCHED: (state: any, data: IUserInfo) => {
    state.userInfo = data;
  },
  CARD_FETCHED: (state: any, data: IUserInfo) => {
    state.cardInfo = data;
  },
  LOGGED: (state: any, payload: any) => {
    state.token = payload.data.token;
    state.customerId = payload.data.customerId;
  },
  LOGOUT: (state: any) => {
    state.token = null;
    state.customerId = null;
    state.userInfo = null;
  },
};

const actions = {
  login({ commit }: any, data: any) {
    commit("LOGGED", data);
  },
  logout({ commit }: any) {
    commit("LOGOUT");
  },
  getInfo({ commit }: any, data: any) {
    commit("INFO_FETCHED", data);
  },
  getCard({ commit }: any, data: any) {
    commit("CARD_FETCHED", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
