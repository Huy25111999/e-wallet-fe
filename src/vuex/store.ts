import { TokenKey } from "@/shared/storage/storage";
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import getters from "./getters";
import authSlice from "./modules/auth";
import walletSlice from "./modules/wallets";
import languageSlice from "./modules/language";
import historySlice from "./modules/history";
import notificationSlice from "./modules/notification";
import guideSlice from "./modules/guide";
import transactionSlice from "./modules/transaction";

const persitState = createPersistedState({
  key: TokenKey,
  paths: [
    "auth",
    "wallet",
    "history",
    "language",
    "notification",
    "transaction",
    "guide",
    "transaction",
  ],
});

const store = createStore({
  modules: {
    auth: authSlice,
    wallet: walletSlice,
    history: historySlice,
    language: languageSlice,
    notification: notificationSlice,
    guide: guideSlice,
    transaction: transactionSlice,
  },
  plugins: [persitState],
  getters: getters,
});

export default store;
