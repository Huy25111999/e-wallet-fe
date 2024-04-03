import TransactionPage from "@/views/transaction/TransactionPage.vue";
import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";

import { routesAuth } from "./auth";

// ERROR PAGE
import NotFoundPageView from "@/views/error/404Page.vue";
import store from "@/vuex/store";
import { getParams } from "@/helpers/pathHelper";
import { paramsDischargeVerify } from "@/views/transaction/scan-qr-page/verify-otp/verifyOtp.component";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/dashboard",
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/dashboard",
      },
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/DashboardPage.vue"),
      },
      {
        path: "history",
        component: () => import("@/views/history/HistoryPage.vue"),
      },
      // TRANSACTION
      {
        path: "transaction",
        component: TransactionPage,
        children: [
          {
            path: "",
            redirect: "/tabs/transaction/scanqr",
          },
          {
            path: "scanqr",
            name: "scanqr",
            component: () => import("@/views/transaction/scan-qr-page/ScanPage.vue"),
          },
          {
            path: "paymentqr",
            name: "paymentqr",
            component: () => import("@/views/transaction/payment-qr-page/PaymentPage.vue"),
          },
          {
            path: "paymentqr/get-money",
            component: () =>
              import("@/views/transaction/payment-qr-page/qrcode-page/QrCodePage.vue"),
          },
        ],
      },

      // WALLET
      {
        path: "wallets/",
        redirect: "/tabs/wallets/detail",
      },
      {
        path: "wallets/detail",
        component: () => import("@/views/wallets/WalletsPage.vue"),
      },
      {
        path: "wallets/top-up",
        name: "topUp",
        component: () => import("@/views/wallets/top-up-new/topUpPageNew.vue"),
      },
      {
        path: "wallets/withdraw",
        name: "withdraw",
        component: () => import("@/views/wallets/withdraw/withdrawPage.vue"),
      },
      {
        path: "card/",
        redirect: "/tabs/wallets/card",
      },
      {
        path: "wallets/card",
        component: () => import("@/views/wallets/card/cardPage.vue"),
      },
      {
        path: "wallets/:type/success/:amount/:dateTime",
        component: () => import("@/views/wallets/success/successPage.vue"),
      },
      {
        path: "wallets/:type/error/:amount/:dateTime",
        component: () => import("@/views/wallets/error/errorPage.vue"),
      },
      // PROFILE
      {
        path: "profile",
        component: () => import("@/views/profile/ProfilePage.vue"),
      },
      {
        path: "profile/verification",
        component: () => import("@/views/verification/VerificationPage.vue"),
      },
    ],
  },

  ...routesAuth,
  // //When route not exist return page not found
  {
    path: "/:catchAll(.*)",
    name: "Not found",
    component: NotFoundPageView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const dischargeInfo = store.getters.transaction.dischargeInfo;
  const token = store.getters.auth.token;

  //Sau khi đăng nhập đi đến trang thanh toán
  const pathParams = getParams(to.fullPath);

  if (to.path === "/tabs/transaction/scanqr" && pathParams && Object.keys(pathParams)?.length > 0) {
    const dischargeInfo: paramsDischargeVerify = {
      appKey: pathParams?.appKey as string,
      currency: pathParams?.currency as string,
      price: Number(pathParams?.price) as number,
      receiverKey: pathParams?.receiverKey as string,
      fromWhere: pathParams?.fromWhere as string,
    };
    store.dispatch("transaction/fetchDischargeInfo", dischargeInfo);
  }

  //
  if (dischargeInfo && from.path === "/auth/login/user" && token) {
    window.location.href = `/tabs/transaction/scanqr?receiverKey=${dischargeInfo.receiverKey}&fromWhere=${dischargeInfo.fromWhere}&price=${dischargeInfo.price}&currency=${dischargeInfo.currency}&appKey=${dischargeInfo.appKey}`;
  } else if (to.fullPath === "/tabs/dashboard" && from.fullPath === "/auth/login/user") {
    next();
  } else if (to.fullPath !== "/auth/login/user" && !token) {
    next({ path: "/auth/login/user" });
  } else next();
});

export default router;
