import store from "../store";

const state = {
    notification: null,
    total: 0,
};

const mutations = {
    LOADED: (state: any, payload: any) => {
        state.notification = payload.data;
        state.total = payload.notRead;
    },
};

const actions = {
    loadNotification({ commit }: any, data: any) {
        commit("LOADED", data);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
