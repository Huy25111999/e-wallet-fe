<template>
  <!-- Form Type Amount -->
  <div class="wrapper-scanIfo" v-if="disabledFormAmount">
    <div class="__header flex justify-between items-center">
      <div class="nav-left flex items-center">
        <button class="goback" @click="goBack">
          <img src="@/common/assets/icon/transaction/backDark.svg" />
        </button>
        <h3 class="text-left">
          {{ intl("transaction.transaction_qr_code_get_money") }}
        </h3>
      </div>
    </div>
    <div class="__main">
      <div class="information-user">
        <div class="title">
          <h3 class="text-left">
            {{ intl("transaction.transaction_infomation_recipient") }}
          </h3>
        </div>
        <div class="info-item flex justify-between items-center">
          <div class="left">
            {{ intl("transaction.transaction_account_holder") }}
          </div>
          <div class="right">
            {{ route?.query?.receiverKey ? route?.query?.receiverKey : userInfo?.account }}
          </div>
        </div>
        <div class="info-item flex justify-between items-center">
          <div class="left">
            {{ intl("transaction.beneficiary_account") }}
          </div>
          <div class="right">
            {{ $props?.qrCodeData?.account }}
          </div>
        </div>
      </div>

      <div class="wrapper-form mt-10">
        <Form
          class="form-amount"
          @submit="handleCreateOtp"
          :validation-schema="formAmountSchema"
          v-slot="{ errors }"
        >
          <div class="title text-left">
            {{ intl("transaction.transaction_qr_get_money_set_amount") }}
          </div>
          <div class="mb-4">
            <div class="relative">
              <Field
                name="amount"
                v-model="formValues.amount"
                v-slot="{ handleChange, resetField }"
              >
                <input
                  class="field-item"
                  type="number"
                  inputmode="numeric"
                  :placeholder="intl('transaction.transaction_qr_get_money_set_amount_placeholder')"
                  v-model="formValues.amount"
                  @change="handleChange"
                />
                <ion-icon
                  :icon="closeCircleOutline"
                  class="clear-input"
                  @click="resetField"
                  v-if="formValues.amount"
                />
              </Field>
            </div>
            <p class="text-danger text-left w-full" v-if="errors.amount">
              {{ errors.amount }}
            </p>
          </div>
          <div class="mb-4">
            <div class="relative">
              <Field
                name="content"
                v-model="formValues.content"
                v-slot="{ handleChange, resetField }"
              >
                <input
                  class="field-item"
                  :placeholder="intl('transaction.transaction_qr_get_money_set_content')"
                  v-model="formValues.content"
                  @change="handleChange"
                />
                <ion-icon
                  :icon="closeCircleOutline"
                  class="clear-input"
                  @click="resetField"
                  v-if="formValues.content"
                />
              </Field>
            </div>
            <p class="text-danger text-left w-full" v-if="errors.content">
              {{ errors.content }}
            </p>
          </div>

          <input type="submit" hidden />

          <div class="action-group flex justify-center items-center">
            <button type="button" class="btn-cancel" @click="goBack">
              {{ intl("transaction.transaction_cancel") }}
            </button>
            <button class="btn-submit" type="submit">
              {{ intl("transaction.transaction_confirm") }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>

  <!-- Form Transaction -->
  <div class="wrapper-scanIfo" v-else>
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

      <div class="title-transaction text-left">
        {{ intl("transaction.transaction_detail") }}
      </div>
      <div class="detail-transaction">
        <ul class="feature-list">
          <li class="cursor-pointer account-holder">
            <div class="__name">
              <span>{{ intl("transaction.transaction_account_holder") }}</span>
            </div>
            <div class="__value">
              <span class="amount">
                {{ route?.query?.receiverKey ? route?.query?.receiverKey : userInfo?.account }}
              </span>
            </div>
          </li>
          <li class="cursor-pointer account-holder" v-if="$props?.qrCodeData?.account">
            <div class="__name">
              <span>{{ intl("transaction.beneficiary_account") }}</span>
            </div>
            <div class="__value">
              <span class="amount"> {{ $props?.qrCodeData?.account }} </span>
            </div>
          </li>
          <li class="cursor-pointer">
            <div class="__name">
              <span>{{ intl("transaction.transaction_amount") }}</span>
            </div>
            <div class="__value">
              <span class="amount">
                ${{ Number($props?.qrCodeData?.amount) || formValues.amount }}
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
      <div class="actions flex justify-center items-center">
        <button class="cancel" @click="goBack">
          {{ intl("transaction.transaction_cancel") }}
        </button>
        <button class="confirm" @click="handleCreateOtp">
          {{ intl("transaction.transaction_confirm") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./scanQrInfo.component.ts"></script>

<style lang="scss" src="./scanQrInfo.scss" scoped></style>
