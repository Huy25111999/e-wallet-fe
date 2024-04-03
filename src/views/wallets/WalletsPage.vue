<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-wallet">
        <div class="__header flex justify-between item-center">
          <div class="logo-brand">
            <img src="@/common/assets/logo.svg" />
          </div>
        </div>
        <div class="__main">
          <div class="your-balance">
            <div class="title">
              <img src="@/common/assets/icon/wallet/wallet-2.svg" />
              <h4 class="ml-3">{{ t("wallet.yourBalance") }}</h4>
            </div>
            <div class="total-money">
              <h3>{{ formatNumber(userInfo?.amount) }}</h3>
            </div>
          </div>
          <div class="my-card">
            <div class="__header flex justify-between items-center">
              <div class="title">
                <h3>{{ t("wallet.myBanking") }}</h3>
              </div>
              <div class="add-card" id="add-bank">
                <h3 class="cursor-pointer">+ {{ t("wallet.addBanking") }}</h3>
              </div>
            </div>
            <div class="__main">
              <div class="total-card">
                <h3>{{ t("wallet.totalCard") }}: {{ userInfo?.bankingCard?.length }}</h3>
              </div>
              <ul
                class="card-list"
                v-if="userInfo && userInfo?.bankingCard && userInfo?.bankingCard.length"
              >
                <li
                  v-for="bank in userInfo?.bankingCard"
                  class="__item flex light-blue"
                  v-bind:key="bank.cardId"
                >
                  <div class="__thumnail flex justify-center items-center">
                    <img src="@/common/assets/icon/bank.svg" />
                  </div>
                  <div class="__content w-full flex items-center">
                    <div class="__info flex-1">
                      <div class="name">{{ bank?.name || bank?.bankName }}</div>
                      <div class="description flex justify-between items-center">
                        <div class="__number">
                          <p>
                            {{ t("wallet.acNo") }} ****
                            {{ bank?.cardNo.slice(bank?.cardNo.length - 4) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="__ex-date">
                      <div style="font-size: 15px; color: red" @click="() => onSelectCard(bank)">
                        <ion-icon :icon="trashOutline"></ion-icon>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <modal-breakpoint
        :title="t('wallet.withdraw.title')"
        trigger="add-bank"
        ref="modal"
        :dismiss="resetFormValues"
      >
        <div class="card-form p-6">
          <Form
            @submit="handleSubmit"
            ref="formAdd"
            :validation-schema="schemaAddCard"
            v-slot="{ errors }"
          >
            <div class="mb-3">
              <input-field
                name="bankName"
                :hasCharacter="true"
                :label="t('wallet.withdraw.bank_name')"
                v-model="formAddValues.bankName"
                :errors="errors"
              />
            </div>
            <div class="mb-3">
              <input-field
                name="swiftCode"
                :hasCharacter="true"
                :label="t('wallet.withdraw.swift_code')"
                v-model="formAddValues.swiftCode"
                :errors="errors"
              />
            </div>
            <div class="mb-3 relative">
              <input-field
                name="account_number"
                :label="t('wallet.withdraw.account_number')"
                type="number"
                inputmode="numeric"
                v-model="formAddValues.account_number"
                :errors="errors"
              />
            </div>
            <div class="mb-3">
              <input-field
                name="account_name"
                :hasCharacter="true"
                :label="t('wallet.withdraw.account_name')"
                v-model="formAddValues.account_name"
                :errors="errors"
              />
            </div>
            <input type="submit" hidden />
            <div class="flex justify-center items-center">
              <ion-button class="submit" type="submit">{{ t("wallet.withdraw.save") }}</ion-button>
            </div>
          </Form>
        </div>
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

<script lang="ts" src="./wallets.component.ts"></script>

<style lang="scss" scoped src="./wallets.scss"></style>
