import { IUserInfo } from "@/types";

const state = {
  isLoading: false,
  dischargeInfo: null,
};

const mutations = {
  DISCHARGE_INFO_FETCHED: (state: any, data: any) => {
    state.dischargeInfo = data;
  },
  DISCHARGE_INFO_REMOVED: (state: any) => {
    state.dischargeInfo = null;
  },
};

const actions = {
  fetchDischargeInfo({ commit }: any, data: any) {
    commit("DISCHARGE_INFO_FETCHED", data);
  },
  removeDischargeInfo({ commit }: any) {
    commit("DISCHARGE_INFO_REMOVED", null);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
