<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-wallet">
        <div class="__header flex items-center">
          <div class="button-back" @click="router.push('/tabs/dashboard')">
            <img src="@/common/assets/icon/history/arrow-left.svg" />
          </div>
          <h4 class="text-center history_title">{{ intl("history.title") }}</h4>
        </div>
        <div class="__main">
          <div class="__banner-info">
            <div class="date_info">
              <div class="cycle_filter">
                <div class="flex-items-center">
                  <div style="width: 40px; height: 40px">
                    <img
                      style="width: 40px; height: 40px"
                      @click="pre"
                      src="@/common/assets/icon/wallet/back_blue.svg"
                    />
                  </div>
                </div>
                <div class="detail_filter text-center">
                  <div class="text_filter text-center">
                    {{ getNameMY(toDate, "MMMM") }}
                  </div>
                  <div class="date_text_filter text-center">
                    {{ formatDateToDayMonthYearNameShort(fromDate) }} -
                    {{ formatDateToDayMonthYearNameShort(toDate) }}
                  </div>
                </div>
                <div class="flex items-center">
                  <div style="width: 40px; height: 40px">
                    <img
                      style="width: 40px; height: 40px"
                      @click="next"
                      src="@/common/assets/icon/wallet/next-blue.svg"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="InSpendInfo">
              <div class="inCome">
                <img class="icon_search" src="@/common/assets/icon/history/incom.svg" />
                <div>
                  <div class="textInfo">{{ intl("history.income") }}</div>
                  <div>
                    <div class="inComeMoney">
                      {{ formatNumber(moneyVolatility?.amountTotalPlus) }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="spending">
                <img class="icon_search" src="@/common/assets/icon/history/spending.svg" />
                <div>
                  <div class="textInfo">{{ intl("history.spending") }}</div>
                  <div>
                    <div class="spendingMoney">
                      {{ formatNumber(moneyVolatility?.amountTotalMinus) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="__main_filter">
            <!-- all -->
            <div class="filter_item cursor-pointer" @click="filterIcon('all', 0)">
              <div :class="`card_filter ${filter === 'all' && 'active'}`">
                <img src="@/common/assets/icon/history/filter-all.svg" />
              </div>
              <div class="filter_name">{{ intl("history.all") }}</div>
            </div>
            <!-- top_up -->
            <div
              class="filter_item cursor-pointer flex justify-center items-center flex-col"
              @click="filterIcon('top_up', 1)"
            >
              <div :class="`card_filter ${filter === 'top_up' && 'active'}`">
                <img src="@/common/assets/icon/history/received.svg" />
              </div>
              <div class="filter_name">{{ intl("history.top_up") }}</div>
            </div>
            <!-- withdrawl -->
            <div
              class="cursor-pointer flex justify-center items-center flex-col"
              @click="filterIcon('withdraw', 3)"
            >
              <div :class="`card_filter ${filter === 'withdraw' && 'active'}`">
                <img src="@/common/assets/icon/history/filter-send.svg" />
              </div>
              <div class="filter_name">{{ intl("history.withdraw") }}</div>
            </div>
            <!-- transfer -->
            <div
              class="cursor-pointer flex justify-center items-center flex-col"
              @click="filterIcon('transfer', 2)"
            >
              <div :class="`card_filter ${filter === 'transfer' && 'active'}`">
                <img src="@/common/assets/icon/history/tranfer.svg" />
              </div>
              <div class="filter_name">{{ intl("history.transfer") }}</div>
            </div>
            <!-- refund -->
            <div
              class="cursor-pointer filter_item flex justify-center items-center flex-col"
              @click="filterIcon('refund', 4)"
            >
              <div :class="`card_filter ${filter === 'refund' && 'active'}`">
                <img src="@/common/assets/icon/history/filter-failed.svg" />
              </div>
              <div class="filter_name">{{ intl("history.refund") }}</div>
            </div>
          </div>
          <div class="__main_content">
            <div v-if="!listTransactions?.length" class="no_transaction">
              <div class="flex justify-center">
                <img src="@/common/assets/icon/history/no-transaction.png" />
              </div>
              <div class="__no_transaction_text">
                {{ intl("history.no_transaction") }}
              </div>
            </div>
            <div v-if="listTransactions?.length" class="has_transaction">
              <transaction-card
                v-for="tran in listTransactions"
                :data="tran"
                v-bind:key="tran.id"
              ></transaction-card>
              <ion-infinite-scroll @ionInfinite="ionInfinite">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
              </ion-infinite-scroll>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script lang="ts" src="./historyPage.component.ts"></script>

<style lang="scss" scoped src="./historyPage.scss"></style>
