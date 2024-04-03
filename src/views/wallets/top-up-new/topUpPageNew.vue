<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-slides :ionSlideDrag="false" ref="slidesRef" class="swiper-no-swiping slide-content">
        <!--          Form top-up-->
        <ion-slide>
          <div class="wrapper-wallet">
            <div class="__header flex justify-between item-center">
              <div class="logo-brand w-full">
                <img @click="goBack" src="@/common/assets/icon/wallet/back.svg" />
                <h1 class="flex-1">{{ t("wallet.top-up.button.top-up") }}</h1>
              </div>
            </div>
            <!--            -->
            <div class="__main">
              <Form
                @submit="handleTopUp"
                v-slot="{ errors }"
                class="form-request"
                ref="formRequest"
                :validation-schema="schemaRequestCode"
              >
                <div class="your-balance">
                  <div class="title">
                    <img src="@/common/assets/icon/wallet/balance.svg" />
                    <h4 class="ml-3">{{ t("wallet.top-up.balance") }}</h4>
                  </div>
                  <div class="total-money">
                    {{ formatNumber(userInfo?.amount) }}
                  </div>
                </div>
                <div>
                  <Field
                    name="amount"
                    v-model="formValues.amount"
                    type="number"
                    v-slot="{ handleChange }"
                  >
                    <ion-input
                      class="custom"
                      :clear-input="true"
                      type="number"
                      inputmode="numeric"
                      :placeholder="t('wallet.top-up.amount-placeholder')"
                      v-model="formValues.amount"
                      @ionChange="handleChange"
                    ></ion-input>
                  </Field>
                  <p v-if="errors.amount" class="error">{{ errors.amount }}</p>
                </div>
                <div>
                  <div class="amount-chip flex justify-between flex-wrap items-center mt-2">
                    <button
                      type="button"
                      :class="[
                        { 'margin-left-chip chip-button': true },
                        { active: formValues.amount === 100 },
                      ]"
                      @click="setValueAmount(100)"
                    >
                      <ion-label>$100</ion-label>
                    </button>
                    <!--   -->
                    <button
                      type="button"
                      :class="[
                        { 'margin-left-chip chip-button': true },
                        { active: formValues.amount === 150 },
                      ]"
                      @click="setValueAmount(150)"
                    >
                      <ion-label>$150</ion-label>
                    </button>
                    <button
                      type="button"
                      :class="[
                        { 'margin-left-chip chip-button': true },
                        { active: formValues.amount === 200 },
                      ]"
                      @click="setValueAmount(200)"
                    >
                      <ion-label>$200</ion-label>
                    </button>

                    <button
                      type="button"
                      :class="[
                        { 'margin-left-chip chip-button': true },
                        { active: formValues.amount === 250 },
                      ]"
                      @click="setValueAmount(250)"
                    >
                      <ion-label>$250</ion-label>
                    </button>
                  </div>
                </div>
                <div class="my-card">
                  <div class="__header flex justify-between items-center">
                    <div class="title">
                      <h3>{{ t("wallet.top-up.receive-money") }}</h3>
                    </div>
                  </div>
                  <div class="__main">
                    <ul class="card-list">
                      <li
                        :class="[
                          '__item flex light-blue-400',
                          { active: selectedCard === item?.id },
                        ]"
                        v-for="(item, index) in userCard"
                        :key="index"
                        @click="selectCard(item)"
                      >
                        <div class="__thumnail flex justify-center items-center">
                          <img src="@/common/assets/icon/card.png" />
                        </div>
                        <div class="__content w-full flex items-center">
                          <div class="__info flex-1">
                            <div class="type"></div>
                            <div class="name">{{ item?.cardName }}</div>
                            <div class="description flex items-center">
                              <div class="__number">
                                <p>
                                  {{ t("wallet.cardNo") }}
                                  {{ hidePhoneNumber(item?.cardNumberPublic) }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>

                    <div :class="['add-withdrawal flex white add-button']" id="add-card">
                      <div class="__add_card flex justify-center items-center">
                        <img src="@/common/assets/icon/add_card.svg" />
                      </div>
                      <div class="__content_add">
                        <div class="name">
                          {{ t("wallet.top-up.button.top_up_add") }}
                        </div>
                      </div>
                    </div>

                    <!--  -->
                  </div>
                </div>

                <div class="flex justify-center items-center">
                  <button type="submit" class="submit uppercase">
                    {{ t("wallet.top-up.button.top-up") }}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </ion-slide>
        <!--          Form confirm-->
        <ion-slide>
          <div class="wrapper-wallet">
            <div class="__header flex justify-between item-center">
              <div class="logo-brand">
                <img
                  @click="handleChangeSlide({ indexSlide: 0, time: 500 })"
                  src="@/common/assets/icon/wallet/back.svg"
                />
                <h1>{{ t("wallet.top-up.button.top-up") }}</h1>
              </div>
            </div>
            <div class="__main">
              <Form @submit="handleTopUp" class="form-request" ref="formConfirm">
                <div class="my-card">
                  <div class="__header flex justify-between items-center">
                    <div class="title">
                      <h3>{{ t("wallet.top-up.receive-money") }}</h3>
                    </div>
                  </div>
                  <div class="__main">
                    <ul class="card-list">
                      <li :class="['__item flex light-blue-400 active']" @click="selectCard(item)">
                        <div class="__thumnail flex justify-center items-center">
                          <img src="@/common/assets/icon/bank.svg" />
                        </div>
                        <div class="__content">
                          <div class="name">{{ selectedCard?.bankName }}</div>
                          <div class="description flex items-center">
                            <div class="__number">
                              <p>
                                {{ t("wallet.acNo") }} ****
                                {{ hidePhoneNumber(selectedCard?.cardNo) }}
                              </p>
                            </div>
                            <div class="__ex-date"></div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="__header flex justify-between items-center">
                    <div class="title">
                      <h3>{{ t("wallet.top-up.transaction-detail") }}</h3>
                    </div>
                  </div>
                  <div class="detail-transaction">
                    <ul class="feature-list">
                      <li class="cursor-pointer">
                        <div class="__name">
                          <span>{{ t("wallet.top-up.title.account") }}</span>
                        </div>
                        <div class="__value">
                          {{ userInfo?.account }}
                        </div>
                      </li>
                      <li class="cursor-pointer">
                        <div class="__name">
                          <span>{{ t("wallet.top-up.title.transfer-amount") }}</span>
                        </div>
                        <div class="__value">
                          <span class="amount">
                            {{ formatNumber(formValues?.amount) }}
                          </span>
                        </div>
                      </li>
                      <li class="cursor-pointer">
                        <div class="__name">
                          <span>{{ t("wallet.top-up.title.fee") }}</span>
                        </div>
                        <div class="__value">
                          <span class="amount">
                            {{ formatNumber(0) }}
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div class="__header flex justify-between items-center">
                    <div class="title">
                      <h3>{{ t("wallet.top-up.total") }}</h3>
                    </div>
                    <div class="total-money">
                      <span> {{ formatNumber(formValues?.amount) }}</span>
                    </div>
                  </div>
                </div>
              </Form>
              <div class="flex justify-center items-center">
                <button
                  type="button"
                  class="submit cancel"
                  @click="handleChangeSlide({ indexSlide: 0, time: 500 })"
                >
                  {{ t("wallet.top-up.button.cancel") }}
                </button>
                <button type="button" class="submit ml-2">
                  {{ t("wallet.top-up.button.confirm") }}
                </button>
              </div>
            </div>
          </div>
        </ion-slide>
        <!--          Form OTP-->
        <ion-slide>
          <div class="wrapper-otp p-4">
            <div class="logo-img-otp">
              <div class="logo-brand">
                <img
                  @click="handleChangeSlide({ indexSlide: 0, time: 500 })"
                  src="@/common/assets/icon/wallet/back.svg"
                />
                <h1>{{ t("wallet.top-up.button.top-up") }}</h1>
              </div>
            </div>

            <h1 class="header">{{ t("user-login-page.header-otp") }}</h1>
            <label class="sub-header-otp flex items-center"
              >{{ t("user-login-page.sub-header-otp") }}
              <h3 class="ml-1 mb-0 font-bold text-base">
                {{ userInfo?.phone }}
              </h3>
            </label>

            <Form class="form-confirm" ref="formConfirm">
              <v-otp-input
                class="flex justify-center items-center"
                ref="otpInput"
                input-classes="otp-input-custom"
                separator=""
                :num-inputs="6"
                :should-auto-focus="true"
                :is-input-num="true"
                :conditionalClass="['one', 'two', 'three', 'four', 'five', 'six']"
                @on-change="handleOnChange"
                @on-complete="handleOnComplete"
              />
              <div class="mt-5 flex flex-col items-center">
                <div class="flex items-center resend-title">
                  {{ t("transaction.resend_code_question") }}
                </div>
                <p v-show="resendOtp.isEnd" class="resend ml-2 cursor-pointer" @click="onReTakeOtp">
                  {{ t("transaction.resend_code") }}
                </p>
                <div v-show="!resendOtp.isEnd" class="countdown flex items-center">
                  <p class="mr-1">{{ t("user-login-page.label.resend") }}</p>
                  (
                  <vue-countdown
                    :auto-start="false"
                    class="m-0"
                    ref="countDownRef"
                    :time="resendOtp.time"
                    v-slot="{ seconds }"
                    @end="onResendOtp"
                  >
                    {{ seconds }}s
                  </vue-countdown>
                  )
                </div>
              </div>

              <div class="flex justify-center items-center">
                <ion-button class="w-full confirm" @click="handleConfirm"
                  >{{ t("wallet.top-up.button.confirm") }}
                </ion-button>
              </div>
            </Form>
          </div>
        </ion-slide>
      </ion-slides>

      <modal-breakpoint
        :title="t('wallet.withdraw.title')"
        trigger="add-card"
        ref="modal"
        :dismiss="resetFormValues"
        initial-breakpoint="1"
      >
        <add-card-modal></add-card-modal>
      </modal-breakpoint>

      <ModalDelete
        :title="t('wallet.withdraw.title_remove')"
        :content="t('wallet.withdraw.content_remove')"
        :handleConfirm="deleteCardFn"
        trigger="remove-card"
        ref="modalDeleteRef"
      >
      </ModalDelete>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./topUpPageNew.component.ts"></script>

<style lang="scss" scoped src="./topUpPageNew.scss"></style>
