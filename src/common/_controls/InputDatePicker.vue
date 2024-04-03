<template>
  <ion-label class="mb-4">{{ label }}<span>*</span></ion-label>
  <Field :name="name" :value="currentValue">
    <datepicker
      class="custom-picker w-full"
      inputFormat="dd/MM/yyyy"
      :placeholder="placeholder"
      v-model="currentValue"
      :upperLimit="upperLimit"
      :lowerLimit="lowerLimit"
      @update:modelValue="updateValue"
      :class="`${errorMessage && ' mb-1 validate-error'} ${modelValue && 'has-value'}`"
    />
  </Field>

  <p v-if="errorMessage" :class="'validate-message'">{{ errorMessage }}</p>
</template>

<script lang="ts">
import { IonLabel } from "@ionic/vue";
import { useField } from "vee-validate";
import { computed, defineComponent, ref } from "vue";
import Datepicker from "vue3-datepicker";
import { Field } from "vee-validate";

export default defineComponent({
  name: "InputDatePicker",
  components: { IonLabel, Datepicker, Field },
  props: {
    modelValue: {
      type: Date,
    },
    label: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
    },
    errors: {},
    upperLimit: {
      type: Date,
    },
    lowerLimit: {
      type: Date,
    },
  },

  setup(props, context) {
    const { errorMessage, meta } = useField(props.name);

    const updateValue = (newDate: any) => {
      context.emit("update:modelValue", newDate);
    };

    const currentValue = computed(() => props.modelValue);

    return { updateValue, errorMessage, meta, currentValue };
  },
});
</script>

<style lang="scss">
ion-label {
  color: #9896a8 !important;
  font-weight: 400;
  font-size: 14px;
  span {
    color: red;
  }
}
.custom-picker {
  background: #fff;
  border-bottom: 1px solid #d7d7d7;
  font-size: 14px;
  opacity: 0.5;
  color: #313131;
  padding-bottom: 4px;

  &:focus {
    outline: none;
    border-color: #0f38a9;
  }
}
.has-value {
  font-weight: 600;
  font-size: 14px;
  color: #19163d;
  opacity: 1;
}

.validate-error {
  border-color: red;
}

.validate-message {
  color: red;
  font-size: 13px;
}
</style>
