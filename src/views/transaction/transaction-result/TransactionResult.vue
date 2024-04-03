<template>
  <div class="wrapper-scanIfo">
    <div class="__header flex justify-between items-center">
      <div class="nav-left flex items-center">
        <button class="goback" @click="goBack">
          <img src="@/common/assets/icon/transaction/backDark.svg" />
        </button>
        <h3>{{ intl("transaction.transaction_money") }}</h3>
      </div>
    </div>
    <div class="__main">
      <div class="logo-img flex justify-between items-center">
        <img src="@/common/assets/logo.svg" />
      </div>

      <!-- START MESSAGE TRANSACTION -->
      <div :class="`message ${$props.qrCodeData?.success ? 'success' : 'error'}`">
        <h3 class="title text-left">
          {{
            $props.qrCodeData?.success
              ? intl("transaction.transaction_message_success")
              : intl("transaction.transaction_message_fail")
          }}
        </h3>
        <p v-if="$props.qrCodeData?.message" class="content text-left">
          {{ $props.qrCodeData?.message }}
        </p>
      </div>
      <!-- END  -->
      <div class="title-transaction text-left">{{ intl("transaction.transaction_detail") }}</div>
      <div class="detail-transaction">
        <ul class="feature-list">
          <li class="cursor-pointer account-holder">
            <div class="__name">
              <span>{{ intl("transaction.transaction_account_holder") }}</span>
            </div>
            <div class="__value">{{ userInfo?.account }}</div>
          </li>
          <li class="cursor-pointer" v-if="$props?.qrCodeData?.accountTo">
            <div class="__name">
              <span>{{ intl("transaction.beneficiary_account") }}</span>
            </div>
            <div class="__value">
              <span class="amount"> {{ $props?.qrCodeData?.accountTo }} </span>
            </div>
          </li>
          <li class="cursor-pointer">
            <div class="__name">
              <span>{{ intl("transaction.transaction_amount") }}</span>
            </div>
            <div class="__value">
              <span class="amount">
                ${{ Number($props?.qrCodeData?.amount) || route.query?.price }}
              </span>
            </div>
          </li>
          <li class="cursor-pointer" v-if="$props?.qrCodeData?.content">
            <div class="__name">
              <span>{{ intl("transaction.transaction_content") }}</span>
            </div>
            <div class="__value">
              <div class="content">{{ $props?.qrCodeData?.content }}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="actions">
        <button
          v-if="$props.qrCodeData?.success"
          class="confirm w-full"
          @click="() => router.push({ path: '/tabs/dashboard', replace: true })"
        >
          {{ intl("transaction.transaction_home") }}
        </button>
        <button v-else class="confirm w-full" @click="handleTryAgain">
          {{ intl("transaction.transaction_try_again") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./transactionResult.component.ts"></script>

<style lang="scss" src="./transactionResult.scss" scoped></style>
