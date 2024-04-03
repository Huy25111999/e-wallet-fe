<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="wrapper-wallet">
        <div class="__header flex justify-center items-center">
          <button
            class="btn-back"
            @click="() => router.push({ path: '/tabs/profile', replace: true })"
          >
            <img src="@/common/assets/icon/Path.png" />
          </button>
          <h3 class="text-center">{{ intl("verification.information_verifycation") }}</h3>
        </div>
        <div class="__main">
          <!-- select type -->
          <div v-if="!showPreviewImg && !showFormUser">
            <div class="card-options">
              <div :class="`box-item ${verificationSelected === 'passport' && 'box-active'}`">
                <div
                  :class="`__item cursor-pointer ${
                    verificationSelected === 'passport' && 'active'
                  }`"
                  @click="() => handleSelectOption('passport')"
                >
                  <div class="avatar">
                    <img src="@/common/assets/icon/Passport.svg" />
                  </div>
                  <div class="title">
                    <p>{{ intl("verification.upload_passport") }}</p>
                  </div>
                  <div class="description">
                    <p class="text-center">
                      {{ intl("verification.upload_passport_des") }}
                    </p>
                  </div>
                </div>
              </div>

              <div :class="`box-item ${verificationSelected === 'id' && 'box-active'}`">
                <div
                  :class="`__item cursor-pointer  ${verificationSelected === 'id' && 'active'}`"
                  @click="() => handleSelectOption('id')"
                >
                  <div class="avatar">
                    <img src="@/common/assets/icon/Pic.svg" />
                  </div>
                  <div class="title">
                    <p>{{ intl("verification.upload_id_document") }}</p>
                  </div>
                  <div class="description">
                    <p class="text-center">
                      {{ intl("verification.upload_id_document_des") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="authentications">
              <h3>{{ intl("verification.authentication") }}</h3>
              <ul class="__content">
                <li>
                  <div class="icon">
                    <img src="@/common/assets/verify.svg" />
                  </div>
                  <p>{{ intl("verification.authentication_enjoy_serve") }}</p>
                </li>
                <li>
                  <div class="icon">
                    <img src="@/common/assets/verify.svg" />
                  </div>
                  <p>{{ intl("verification.authentication_maximize_account") }}</p>
                </li>
              </ul>
            </div>

            <button
              :class="`${!verificationSelected && 'disabled'} btn-confirm`"
              :disabled="!verificationSelected"
              @click="handleOpenCamera"
            >
              {{ intl("verification.take_photo") }}
            </button>
          </div>
        </div>

        <!-- preview -->
        <preview-photo
          :photos="photos"
          v-if="showPreviewImg && !showFormUser"
          :onNextStep="onNextStep"
          :onRetake="onRetake"
        />

        <!-- form user -->
        <verification-user
          :photos="photos"
          v-if="!showPreviewImg && showFormUser"
          :verificationSelected="verificationSelected"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" src="./verification.compontent.ts"></script>
<style lang="scss" scoped src="./verificationpage.scss"></style>
