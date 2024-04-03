const data = {};

const state = {
  language: data,
};

const mutations = {
  SET_LANG(state, payload) {
    state.language = payload;
  },
};

const actions = {
  setLang({ commit }, payload) {
    commit("SET_LANG", payload);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
