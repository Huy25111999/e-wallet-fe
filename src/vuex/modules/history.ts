import store from "../store";

const state = {
  history: [],
  total: 0,
};

const mutations = {
  LOADED: (state: any, payload: any) => {
    state.history = payload.data;
    state.total = payload.total;
  },
};

const actions = {
  loadHistory({ commit }: any, data: any) {
    commit("LOADED", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
