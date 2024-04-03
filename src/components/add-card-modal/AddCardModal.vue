<template>
  <div class="notice text-red p-6">
    {{ t("wallet.top-up.notice") }}
  </div>
  <div class="card-form p-6">
    <Form
      @submit="handleSubmit"
      :validation-schema="schemaAddCard"
      v-slot="{ errors }"
      class="grid gap-6 mb-3 md:grid-cols-2"
    >
      <div>
        <ion-label class="mb-5">{{ t("wallet.top-up.cardEmail") }} <span>*</span></ion-label>
        <div class="w-full relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
              ></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>

          <Field
            v-model="formAddValues.cardEmail"
            placeholder="name@flowbite.com"
            required
            name="cardEmail"
            type="text"
            :class="{ hasError: !!errors.cardEmail }"
            v-focus
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div class="clear-input" @click="handleClearValue" v-if="formAddValues.cardEmail.length">
            <button type="reset" value="Reset" @click="handleClearValue('cardEmail')">
              &times;
            </button>
          </div>
        </div>
        <p v-if="!!errors.cardEmail" :class="'validate-message'">{{ errors.cardEmail }}</p>
      </div>

      <div>
        <ion-label class="mb-5">{{ t("wallet.top-up.cardName") }}<span>*</span></ion-label>
        <div class="w-full relative">
          <input
            v-model="formAddValues.cardName"
            :class="{
              hasError:
                !!errors.cardName && checkValidate.cardName && !formAddValues.cardName.length,
            }"
            @blur="validate('cardName')"
            name="cardName"
            type="text"
            id="first_name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="t('wallet.top-up.cardName')"
            required
            v-focus
          />

          <div class="clear-input" v-if="formAddValues.cardName.length">
            <button type="reset" value="Reset" @click="handleClearValue('cardName')">
              &times;
            </button>
          </div>
        </div>
        <div
          v-if="!!errors.cardName && checkValidate.cardName && !formAddValues.cardName.length"
          class="validate-message"
        >
          {{ errors.cardName }}
        </div>

        <div
          v-if="!!errors.cardName && checkValidate.cardName && formAddValues.cardName.length > 50"
          class="validate-message"
        >
          {{ t("wallet.top-up.error.card_name_max") }}
        </div>
      </div>
      <div>
        <ion-label class="mb-5">{{ t("wallet.top-up.cardNumber") }}<span>*</span></ion-label>
        <div class="w-full relative">
          <input
            v-model="formAddValues.cardNumber"
            v-cardformat:formatCardNumber
            :class="{
              hasError:
                !!errors.cardNumber && checkValidate.cardNumber && !formAddValues.cardNumber.length,
            }"
            @blur="validate('cardNumber')"
            name="cardNumber"
            type="tel"
            id="first_name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="t('wallet.top-up.cardNumber')"
            required
            v-focus
          />

          <div class="clear-input" v-if="formAddValues.cardNumber.length">
            <button type="reset" value="Reset" @click="handleClearValue('cardNumber')">
              &times;
            </button>
          </div>
        </div>
        <div
          v-if="!!errors.cardNumber && checkValidate.cardNumber && !formAddValues.cardNumber.length"
          class="validate-message"
        >
          {{ errors.cardNumber }}
        </div>
      </div>
      <div>
        <ion-label class="mb-5">{{ t("wallet.top-up.cardCVC") }}<span>*</span></ion-label>
        <div class="w-full relative">
          <input
            v-model="formAddValues.cardCVC"
            v-cardformat:formatCardCVC
            @blur="validate('cardCVC')"
            :class="{
              hasError: !!errors.cardCVC && checkValidate.cardCVC && !formAddValues.cardCVC.length,
            }"
            name="cardCVC"
            type="text"
            id="first_name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="t('wallet.top-up.cardCVC')"
            required
            v-focus
          />
          <div class="clear-input" v-if="formAddValues.cardCVC.length">
            <button type="reset" value="Reset" @click="handleClearValue('cardCVC')">&times;</button>
          </div>
        </div>
        <div
          v-if="!!errors.cardCVC && checkValidate.cardCVC && !formAddValues.cardCVC.length"
          class="validate-message"
        >
          {{ errors.cardCVC }}
        </div>
      </div>

      <div>
        <ion-label class="mb-5">{{ t("wallet.top-up.cardExpYear") }}<span>*</span></ion-label>
        <div class="w-full relative">
          <input
            v-model="formAddValues.cardExpYear"
            v-cardformat:formatCardExpiry
            name="cardExpYear"
            @blur="validate('cardExpYear')"
            :class="{
              hasError:
                !!errors.cardExpYear &&
                checkValidate.cardExpYear &&
                !formAddValues.cardExpYear.length,
            }"
            type="text"
            id="first_name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="t('wallet.top-up.cardExpYear')"
            required
            v-focus
          />
          <div class="clear-input" v-if="formAddValues.cardExpYear.length">
            <button type="reset" value="Reset" @click="handleClearValue('cardExpYear')">
              &times;
            </button>
          </div>
        </div>
        <div
          v-if="
            !!errors.cardExpYear && checkValidate.cardExpYear && !formAddValues.cardExpYear.length
          "
          class="validate-message"
        >
          {{ errors.cardExpYear }}
        </div>
      </div>
      <button class="btn btn-primary sbmBtn" type="submit" @click="handleSubmit(formAddValues)">
        {{ t("common.save") }}
      </button>
    </Form>
  </div>
</template>

<script src="./addCardModal" lang="ts"></script>
<style src="./addCardModal.scss" lang="scss"></style>
