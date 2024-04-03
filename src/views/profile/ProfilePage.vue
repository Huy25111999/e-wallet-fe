<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-wallet">
        <div class="__header">
          <div class="profile-content">
            <h4 class="text-center">{{ t("profile.header") }}</h4>
          </div>
          <div class="avatar-user">
            <div class="avatar">
              <!-- set up avatar -->
              <input
                type="file"
                hidden
                ref="inputRef"
                accept="image/*"
                @change="onFileChange"
              />

              <img
                v-if="fileSelected"
                class="__img cursor-pointer"
                :src="fileSelected"
                @click="openPopover($event)"
              />
              <img
                v-if="!fileSelected"
                class="__img cursor-pointer"
                @click="openPopover($event)"
                alt=""
              />

              <ion-popover
                trigger="right-end"
                side="right"
                alignment="end"
                :is-open="isOpenPopover"
                :event="eventPopover"
                @didDismiss="isOpenPopover = false"
              >
                <ion-content class="p-3">
                  <ul class="avatar-options">
                    <!-- set by select file -->
                    <li
                      class="flex items-center cursor-pointer p-3"
                      @click="onSelectFile"
                    >
                      <ion-icon :icon="imageOutline" />
                      <p class="ml-2 text-sm font-medium">
                        {{ t("profile.avatar.option_select_file") }}
                      </p>
                    </li>
                  </ul>
                </ion-content>
              </ion-popover>

              <!-- verify kyc -->
              <img
                class="img-verify"
                :src="
                  require(userInfo?.isVerifiedKyc === STATUS_KYC.isVerified
                    ? '@/common/assets/icon/profile/verified.svg'
                    : '@/common/assets/icon/profile/not-veryfy.svg')
                "
                @click="
                  userInfo?.isVerifiedKyc !== STATUS_KYC.isVerified &&
                    onOpenVerifyKyc()
                "
              />
            </div>
          </div>
          <div class="wrapper-user">
            <ul class="__user-info">
              <li>
                <p>{{ t("profile.label.full-name") }}</p>
                <span v-if="userInfo?.kyc">{{
                  userInfo?.kyc?.firstName + " " + userInfo?.kyc?.lastName
                }}</span>
                <span v-else>---------</span>
              </li>
              <li id="refPhoneModal">
                <p>{{ t("profile.label.phone-number") }}</p>
                <span v-if="userInfo?.phone">{{
                  hidePhoneNumber(userInfo?.phone)
                }}</span>
                <span v-else class="text-green-300">
                  {{ t("common.update") }}</span
                >
              </li>
              <li>
                <p>{{ t("profile.label.account-number") }}</p>
                <span>{{ userInfo?.account }}</span>
              </li>
              <li>
                <p>{{ t("profile.label.date-of-birth") }}</p>
                <span v-if="userInfo?.kyc">{{
                  formatDateOfBirth(Number(userInfo?.kyc?.birthday))
                }}</span>
                <span v-else>---------</span>
              </li>
              <li v-if="userInfo?.isVerifiedKyc === STATUS_KYC.isVerified"></li>

              <li
                v-if="userInfo?.isVerifiedKyc === STATUS_KYC.unverify"
                @click="onOpenVerifyKyc"
              >
                <p class="w-full text-center unverify cursor-pointer">
                  {{ t("profile.label.unverify") }}
                </p>
              </li>

              <li
                v-if="userInfo?.isVerifiedKyc === STATUS_KYC.rejected"
                @click="onOpenVerifyKyc"
              >
                <p class="w-full text-center unverify cursor-pointer">
                  {{ t("profile.label.rejected") }}
                </p>
              </li>

              <li
                v-if="userInfo?.isVerifiedKyc === STATUS_KYC.verify_processing"
              >
                <p class="w-full text-center unverify cursor-pointer">
                  {{ t("profile.label.processing") }}
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div class="__main">
          <ul class="feature-list">
            <li
              class="cursor-pointer"
              @click="() => router.push('/tabs/transaction/paymentqr')"
            >
              <div class="__name">
                <div class="icon">
                  <img src="@/common/assets/icon/profile/qr.svg" />
                </div>
                <span>{{ t("profile.label.payment-qr") }}</span>
              </div>
              <div class="__value">
                <img src="@/common/assets/icon/profile/arrow.svg" />
              </div>
            </li>
            <li class="cursor-pointer">
              <div class="__name">
                <div class="icon">
                  <img src="@/common/assets/icon/profile/balance.svg" />
                </div>
                <span>{{ t("profile.label.total-balance") }}</span>
              </div>
              <div class="__value">
                <p class="mb-0 mr-2 amount">
                  {{ formatNumber(userInfo?.amount) }}
                </p>
              </div>
            </li>
            <li
              class="cursor-pointer"
              @click="() => router.push('/tabs/wallets/detail')"
            >
              <div class="__name">
                <div class="icon">
                  <img src="@/common/assets/icon/profile/linking.svg" />
                </div>
                <span>{{ t("profile.label.banking") }}</span>
              </div>
              <div class="__value">
                <img src="@/common/assets/icon/profile/arrow.svg" />
              </div>
            </li>

            <li
              class="cursor-pointer"
              @click="() => router.push('/tabs/wallets/card')"
            >
              <div class="__name">
                <div class="icon">
                  <img src="@/common/assets/icon/profile/credit-card.svg" />
                </div>
                <span>{{ t("profile.label.card") }}</span>
              </div>
              <div class="__value">
                <img src="@/common/assets/icon/profile/arrow.svg" />
              </div>
            </li>

            <li class="cursor-pointer" id="change-language">
              <div class="__name">
                <div class="icon">
                  <img src="@/common/assets/icon/profile/language.svg" />
                </div>
                <span>{{ t("profile.label.language") }}</span>
              </div>
              <div class="__value">
                <img
                  class="rounded"
                  :src="
                    require('@/common/assets/icon/profile/' +
                      getFlag($i18n.locale))
                  "
                />
              </div>
            </li>
            <li
              v-if="
                NODE_ENV === 'development' || NODE_ENV === 'development_tas'
              "
              class="cursor-pointer"
            >
              <div class="__name">
                <div class="icon">
                  <img src="@/common/assets/icon/profile/setting.svg" />
                </div>
                <span>{{ t("profile.label.development-version") }}</span>
              </div>
              <div class="__value">
                <p class="mb-0 mr-2 version">
                  {{ version }}
                </p>
              </div>
            </li>
            <li v-if="NODE_ENV === 'releases'" class="cursor-pointer">
              <div class="__name">
                <div class="icon">
                  <img src="@/common/assets/icon/profile/setting.svg" />
                </div>
                <span>{{ t("profile.label.release-version") }}</span>
              </div>
              <div class="__value">
                <p class="mb-0 mr-2 version">
                  {{ version }}
                </p>
              </div>
            </li>
            <li @click="handleLogout" class="cursor-pointer">
              <div class="__name">
                <div class="icon">
                  <img src="@/common/assets/icon/profile/logout.svg" />
                </div>
                <span>{{ t("profile.label.logout") }}</span>
              </div>
              <div class="__value"></div>
            </li>
          </ul>
        </div>
      </div>

      <ProfilePhoneEditModal refPhoneModal="refPhoneModal" />

      <modal-breakpoint
        :title="t('profile.language')"
        trigger="change-language"
        initial-breakpoint="0.7"
        ref="modal"
      >
        <ion-list>
          <ion-radio-group v-model="$i18n.locale">
            <ion-item
              v-for="(item, index) in country"
              :key="index"
              @click="() => handleSelectCountry(item.value)"
            >
              <ion-label>
                <div class="flex">
                  <img
                    class="rounded"
                    :src="require('@/common/assets/icon/profile/' + item?.flag)"
                  />
                  <span class="ml-2">{{ item?.name }}</span>
                </div>
              </ion-label>
              <ion-radio slot="start" :value="item?.value"></ion-radio>
            </ion-item>
          </ion-radio-group>
        </ion-list>
      </modal-breakpoint>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./profile.component.ts"></script>

<style lang="scss" scoped src="./profile.scss"></style>
