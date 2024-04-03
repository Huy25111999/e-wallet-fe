<template>
  <div class="transaction_card">
    <div class="transaction_icon">
      <img v-if="data.type === 1" src="@/common/assets/icon/history/received.svg" />
      <img v-if="data.type === 2" src="@/common/assets/icon/history/tranfer.svg" />
      <img v-if="data.type === 3" src="@/common/assets/icon/history/filter-send.svg" />
      <img v-if="data.type === 4" src="@/common/assets/icon/history/filter-failed.svg" />
    </div>
    <div class="transaction_content">
      <div class="transaction_name_money">
        <div class="transaction_name">{{ data?.title || data?.description }}</div>
        <div v-if="data.actionUpdateAmount === 'plus'" class="transaction_money_green">
          {{ "+$" + data?.amount }}
        </div>
        <div v-if="data.actionUpdateAmount === 'minus'" class="transaction_money_red">
          {{ "-$" + data?.amount }}
        </div>
      </div>
      <div class="transaction_date_type">
        <div class="transaction_date">
          {{ formatDateToDayMonthYearName(data?.createAt) }}
        </div>
        <div class="transaction_type">{{ determineType(data?.type) }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./transaction-card.component.ts"></script>

<style lang="scss" scoped src="./transaction-card.scss"></style>
