<template>
  <li class="__item mt-3 text-sm rounded">
    <div class="transaction_card flex flex-col">
      <div class="flex items-start">
        <div class="transaction_icon">
          <img
            v-if="notificationItem.type === TRANSACTION_TYPE.TOP_UP"
            src="@/common/assets/icon/history/received.svg"
          />
          <img
            v-if="notificationItem.type === TRANSACTION_TYPE.TRANSFER"
            src="@/common/assets/icon/history/tranfer.svg"
          />
          <img
            v-if="notificationItem.type === TRANSACTION_TYPE.WITHDRAW"
            src="@/common/assets/icon/history/filter-send.svg"
          />
          <img
            v-if="notificationItem.type === TRANSACTION_TYPE.REFUND"
            src="@/common/assets/icon/history/filter-failed.svg"
          />
          <img
            v-if="notificationItem.typeMsg === 'DEFAULT'"
            src="@/common/assets/icon/notifications.png"
          />
        </div>
        <div class="transaction_content flex-1">
          <div class="transaction_name_money">
            <div
              class="transaction_type font-bold"
              v-if="notificationItem.typeMsg == 'DEFAULT' && !showMore"
            >
              {{ notificationItem?.title }}
            </div>

            <div class="transaction_name">
              {{ getTitle(Number(notificationItem?.type)) }}
            </div>
            <div
              v-if="notificationItem.type === 1 || notificationItem.type === 4"
              class="transaction_money_green"
            >
              $ {{ notificationItem?.amount }}
            </div>
            <div
              v-if="notificationItem.type === 3 || notificationItem.type === 2"
              class="transaction_money_red"
            >
              $ {{ notificationItem?.amount }}
            </div>
          </div>

          <div class="transaction_date_type">
            <div class="flex items-end flex-1">
              <div :class="`text-notification w-full`">
                <p :class="`${!showMore && 'line-clamp-2'}`" @click="onShowContent">
                  {{ notificationItem?.content }}
                </p>

                <p
                  v-if="
                    showMore &&
                    notificationItem?.content &&
                    notificationItem.content.length > CHART_LIMIT
                  "
                  class="cursor-pointer show-more text-cyan-400 underline"
                  @click="onHideContent"
                >
                  {{ intl("notification.hide_content") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="transaction_date flex justify-end items-center">
        <span v-if="notificationItem?.transactionDate">
          {{ notificationItem?.transactionDate }}</span
        >
        <span v-else>{{ formatTime(notificationItem.createAt) }}</span>
      </div>
    </div>
  </li>
</template>
<script lang="ts" src="./notificationItem.ts"></script>
<style lang="scss" src="./notificatonItem.scss" scoped></style>
