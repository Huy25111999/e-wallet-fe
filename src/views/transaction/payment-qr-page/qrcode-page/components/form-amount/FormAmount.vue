<template>
  <div class="wrapper-wallet">
    <div class="__header flex justify-between items-center">
      <div class="nav-left flex items-center">
        <button class="goback" @click="goBack">
          <img src="@/common/assets/icon/transaction/backDark.svg" />
        </button>
        <h3>{{ intl("transaction.transaction_qr_get_money") }}</h3>
      </div>
    </div>
    <div class="__main">
      <div class="wrapper-form">
        <div class="thumnail flex justify-center items-center">
          <img src="@/common/assets/icon/transaction/thumnail.png" />
        </div>
        <Form
          class="form-amount"
          @submit="handleSubmit"
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
                  pattern="[0-9]{10}"
                  type="number"
                  inputmode="numeric"
                  :placeholder="
                    intl(
                      'transaction.transaction_qr_get_money_set_amount_placeholder'
                    )
                  "
                  v-model="formValues.amount"
                  @change="handleChange"
                />
                <ion-icon
                  :icon="closeCircleOutline"
                  class="clear-input"
                  @click="() => handleResetValue(resetField, 'amount')"
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
                  :placeholder="
                    intl('transaction.transaction_qr_get_money_set_content')
                  "
                  v-model="formValues.content"
                  @change="handleChange"
                />
                <ion-icon
                  :icon="closeCircleOutline"
                  class="clear-input"
                  @click="() => handleResetValue(resetField, 'content')"
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
</template>
<script lang="ts" src="./formAmount.component.ts"></script>
<style lang="scss" src="./formAmount.scss" scoped></style>
