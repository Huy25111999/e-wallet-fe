<template lang="">
  <modal-breakpoint
    :title="intl('profile.phone.title')"
    :trigger="$props.refPhoneModal"
    initial-breakpoint="0.4"
    ref="modal"
  >
    <div class="card-form p-6">
      <Form
        @submit="handleSubmit"
        class="form-request"
        ref="formRequest"
        :validation-schema="schemaRequestCode"
        v-slot="{ errors }"
      >
        <div class="input-field">
          <ion-label id="select-country">
            <img class="flag" :src="require('@/common/assets/icon/profile/' + getFlag())" />+
            {{ getCountryNumber() }}</ion-label
          >
          <Field name="phone" v-model="formInit.phone" v-slot="{ handleChange }">
            <input
              type="number"
              inputmode="numeric"
              @change="handleChange"
              v-model="formInit.phone"
            />
          </Field>
        </div>
        <p v-if="errors.phone" class="text-left error mt-2">
          {{ errors.phone }}
        </p>

        <div class="flex justify-center items-center">
          <ion-button class="w-full" type="submit">{{ intl("common.save") }}</ion-button>
        </div>
      </Form>
    </div>

    <modal-breakpoint
      :title="intl('profile.phone.country')"
      trigger="select-country"
      initial-breakpoint="0.4"
    >
      <ion-list>
        <ion-radio-group v-model="formInit.countryCode">
          <ion-item
            v-for="(item, index) in countries"
            :key="index"
            @click="() => handleSelectCountry(item.value)"
          >
            <ion-label>
              <div class="flex">
                <img :src="require('@/common/assets/icon/profile/' + item?.flag)" />
                <span class="ml-2">{{ item?.name }}</span>
              </div>
            </ion-label>
            <ion-radio slot="start" :value="item.value"></ion-radio>
          </ion-item>
        </ion-radio-group>
      </ion-list>
    </modal-breakpoint>
  </modal-breakpoint>
</template>
<script src="./profilePhoneEditModal.component.ts" lang="ts"></script>
<style lang="scss" src="./profilePhoneEditModal.scss"></style>
