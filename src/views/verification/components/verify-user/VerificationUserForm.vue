<template>
  <Form
    @submit="handleSubmit"
    class="form-verify"
    :validation-schema="
      verificationSelected === 'passport' ? verificationPassportSchema : verificationDocumentSchema
    "
    v-slot="{ errors }"
  >
    <div class="mb-4">
      <input-field
        v-if="verificationSelected === 'passport'"
        name="passportNo"
        :label="intl('verification.user_verify_passport')"
        :placeholder="intl('verification.user_verify_passport')"
        v-model="formValues.passportNo"
        :errors="errors"
      />
    </div>
    <div class="mb-4">
      <input-field
        v-if="verificationSelected === 'id'"
        name="documentNo"
        type="number"
        :label="intl('verification.user_verify_documentNo')"
        :placeholder="intl('verification.user_verify_documentNo')"
        v-model="formValues.documentNo"
        :errors="errors"
      />
    </div>
    <div class="mb-4">
      <input-date-picker
        name="date_of_issue"
        :upperLimit="new Date()"
        :label="intl('verification.user_verify_date_of_issue')"
        :placeholder="intl('verification.user_verify_date_of_issue')"
        v-model="formValues.date_of_issue"
        :errors="errors"
      />
    </div>
    <div class="mb-4">
      <input-date-picker
        name="date_of_expiry"
        :label="intl('verification.user_verify_date_of_expiry')"
        :placeholder="intl('verification.user_verify_date_of_expiry')"
        v-model="formValues.date_of_expiry"
        :lowerLimit="formValues.date_of_issue"
        :errors="errors"
      />
    </div>
    <div class="mb-4">
      <label class="mb-3">{{ intl("verification.user_verify_gender") }} <span>*</span></label>
      <div class="flex items-center mt-2">
        <div class="field-item flex items-center">
          <Field id="male" type="radio" name="gender" value="male" v-model="formValues.gender" />
          <label for="male" class="label-radio ml-3">{{
            intl("verification.user_verify_gender_male")
          }}</label>
        </div>
        <div class="field-item flex items-center">
          <Field
            id="female"
            type="radio"
            name="gender"
            value="female"
            v-model="formValues.gender"
          />
          <label for="female" class="label-radio ml-3">{{
            intl("verification.user_verify_gender_female")
          }}</label>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <input-field
        name="first_name"
        :label="intl('verification.user_verify_user_first_name')"
        :placeholder="intl('verification.user_verify_user_first_name')"
        v-model="formValues.first_name"
        :errors="errors"
      />
    </div>
    <div class="mb-4">
      <input-field
        name="last_name"
        :label="intl('verification.user_verify_user_last_name')"
        :placeholder="intl('verification.user_verify_user_last_name')"
        v-model="formValues.last_name"
        :errors="errors"
      />
    </div>
    <div class="mb-4">
      <input-date-picker
        name="date_of_birth"
        :label="intl('verification.user_verify_user_birthday')"
        :placeholder="intl('verification.user_verify_user_birthday')"
        v-model="formValues.date_of_birth"
        :upperLimit="new Date()"
      />
    </div>
    <div class="mb-4">
      <input-field
        name="place_of_birth"
        :label="intl('verification.user_verify_place_of_birth')"
        :placeholder="intl('verification.user_verify_place_of_birth')"
        v-model="formValues.place_of_birth"
        :errors="errors"
      />
    </div>
    <div class="mb-4">
      <input-field
        name="nationality"
        :label="intl('verification.user_verify_nationality')"
        :placeholder="intl('verification.user_verify_nationality')"
        v-model="formValues.nationality"
        :errors="errors"
      />
    </div>
    <input type="submit" hidden />
    <div class="mb-4 px-4">
      <button :class="`btn-cornfirm ${isValidForm && 'disabled'}`">
        {{ intl("verification.confirm") }}
      </button>
    </div>
  </Form>
</template>

<script lang="ts" src="./verificationUser.component.ts"></script>
<style lang="scss" scoped src="./verificationUser.scss"></style>
