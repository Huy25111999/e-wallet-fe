import store from "../store";

const state = {
  guides: [],
  total: 0,
};

const mutations = {
  LOADED: (state: any, payload: any) => {
    state.guides = payload.data;
    state.total = payload.notRead;
  },
};

const actions = {
  loadGuides({ commit }: any, data: any) {
    commit("LOADED", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
