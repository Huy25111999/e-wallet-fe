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
                <h3>{{ t("wallet.myCard") }}</h3>
              </div>
              <div class="modal-card" id="modal-card">
                <h3 class="cursor-pointer">+ {{ t("wallet.addCard") }}</h3>
              </div>
            </div>

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
                           @click="onSelectCard(item)"
                      >
                        <div
                            class="__thumnail flex justify-center items-center"
                        >
                          <img src="@/common/assets/icon/card.png"/>
                        </div>

                        <div class="__content w-full flex items-center">
                          <div class="__info flex-1">
                            <!-- <div class="type"></div> -->
                            <div class="name">{{ item?.cardName }}</div>
                            <div class="description flex justify-between items-center">
                              <div class="__number">
                                <p>
                                  {{ t("wallet.cardNo") }}
                                  {{item?.cardNumberPublic }}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div class="__ex-date">
                            <div style="font-size: 15px; color: red" @click="() => onSelectCard(bank)">
                              <ion-icon :icon="trashOutline" @click="() => onDelete(bank)"></ion-icon>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>


            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->

      <modal-breakpoint
        :title="t('wallet.withdraw.title')"
        trigger="modal-card"
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

<script lang="ts" src="./cardPage.component.ts"></script>

<style lang="scss" scoped src="./cardPage.scss"></style>
