<template>
  <ion-page>
    <ion-tabs @ionTabsWillChange="beforeTabChange" @ionTabsDidChange="afterTabChange">
      <ion-router-outlet class="main-content"></ion-router-outlet>
      <ion-tab-bar slot="bottom" v-show="showTabBar">
        <ion-tab-button tab="dashboard" href="/tabs/dashboard">
          <img
            class="img-active"
            v-if="tabSelected === 'dashboard'"
            src="@/common/assets/icon/sideBar/homeActive.svg"
          />
          <img v-else src="@/common/assets/icon/sideBar/home.svg" />
        </ion-tab-button>

        <ion-tab-button tab="history" href="/tabs/history">
          <img
            class="img-active"
            v-if="tabSelected === 'history'"
            src="@/common/assets/icon/sideBar/historyActive.svg"
          />
          <img v-else src="@/common/assets/icon/sideBar/history.svg" />
        </ion-tab-button>

        <ion-tab-button class="scan-tab" tab="transaction" href="/tabs/transaction">
          <div class="btn-scan">
            <img src="@/common/assets/icon/sideBar/scan.svg" />
          </div>
        </ion-tab-button>

        <ion-tab-button tab="wallets" href="/tabs/wallets/detail">
          <img
            class="img-active"
            v-if="tabSelected === 'wallets'"
            src="@/common/assets/icon/sideBar/walletActive.svg"
          />
          <img v-else src="@/common/assets/icon/sideBar/wallet.svg" />
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <img
            class="img-active"
            v-if="tabSelected === 'profile'"
            src="@/common/assets/icon/sideBar/profileActive.svg"
          />
          <img v-else src="@/common/assets/icon/sideBar/profile.svg" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, watchEffect } from "vue";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonPage,
  IonRouterOutlet,
  loadingController,
} from "@ionic/vue";
import { home, scan, wallet, person, time } from "ionicons/icons";
import { useStore } from "vuex";
import { requestUserInfo } from "@/api/profile";
import router from "@/router";
import { showLoading } from "@/helpers/loadingHelper";
import { loadHistoryList } from "@/api/history";
import moment from "moment";
import { connect } from "@/common/websocket";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "TabsPage",
  components: {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonPage,
    IonRouterOutlet,
  },
  setup() {
    const store = useStore();
    const tabSelected = ref("dashboard");
    const customerId = computed(() => store.getters.auth.customerId) as any;
    const navigate = (url: string) => {
      router.replace(url);
    };
    const route = useRoute();
    const fromDate = ref(moment().subtract(30, "days").startOf("days").toDate());
    const toDate = ref(moment().endOf("days").toDate());

    const showTabBar = computed(() => {
      const url = route.path.split("/");
      if (url.includes("verification")) {
        return false;
      }
      return true;
    });

    const loadHistory = () => {
      if (!customerId.value) return;
      showLoading();
      const params = {
        status: 1,
        dateFrom: fromDate.value.getTime(),
        dateTo: toDate.value.getTime(),
        type: 0,
        page: 1,
        size: 10,
      };

      loadHistoryList(customerId.value, params)
        .then((res) => {
          store.dispatch("history/loadHistory", res.data);
        })
        .finally(() => {
          loadingController.dismiss();
        });
    };

    const fetchCustomerInfo = () => {
      requestUserInfo(customerId.value).then((res) => {
        store.dispatch("auth/getInfo", res.data);
      });
    };

    onMounted(() => {
      connect();
    });

    const beforeTabChange = (event) => {
      // do something before tab change
      tabSelected.value = event.tab;
      if (event.tab === "history") {
        loadHistory();
      }

      fetchCustomerInfo();
    };

    const afterTabChange = () => {
      // do something after tab change
    };

    return {
      beforeTabChange,
      afterTabChange,
      navigate,
      tabSelected,
      showTabBar,
      // icon
      home,
      scan,
      wallet,
      person,
      time,
    };
  },
});
</script>

<style lang="scss">
ion-tabs {
  background: #fff;
}

.tab-selected {
  // color: #404cb2;
  .img-active {
    border-bottom: 4px solid #466ee0;
    padding: 7px;
  }
}

.main-content {
  background: #fff;
}
.ion-activatable path {
  fill: #404cb2 !important;
}

ion-tab-bar {
  background: #ffffff;
  height: 70px;
  box-shadow: 1px -15px 19px -12px rgba(0, 0, 0, 0.14);
  border-radius: 16px 16px 0px 0px;
  ion-tab-button {
    background: #ffffff;
    position: relative;
  }

  .scan-tab {
    .btn-scan {
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135.54deg, #4fb4ed -0.96%, #343edf 100%);
      width: 52px;
      height: 52px;
      border-radius: 50%;
    }
  }
}
</style>
