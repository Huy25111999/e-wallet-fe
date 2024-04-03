const data = [
  {
    id: 1,
    name: "**** **** **** 1147 Visa",
    money: "12 487.12",
  },
  {
    id: 2,
    name: "**** **** **** 1233 Visa",
    money: "10 520.12",
  },
  {
    id: 3,
    name: "**** **** **** 2312 Visa",
    money: "18 520.12",
  },
  {
    id: 4,
    name: "**** **** **** 1445 Visa",
    money: "20 520.12",
  },
  {
    id: 5,
    name: "**** **** **** 3123 Visa",
    money: "23 520.12",
  },
];

const state = {
  wallets: [],
};

const mutations = {
  FETCHED: (state: any, payload: any) => {
    state.wallets = payload.data;
  },
  ADD: (state: any, payload: any) => {
    state.wallets.push(payload.data);
  },
  REMOVE: (state: any, payload: any) => {
    state.wallets = state.wallets.filter((walletItem) => walletItem.id !== payload.data);
  },
};

const actions = {
  fetched({ commit }: any, data: any) {
    commit("FETCHED", data);
  },
  add({ commit }: any, data: any) {
    commit("ADD", data);
  },
  remove({ commit }: any, data: any) {
    commit("REMOVE", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
