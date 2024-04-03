<template>
  <Field
    type="radio"
    :name="name"
    :value="modelValue"
    @input="$emit('input', $event)"
    :placeholder="placeholder"
    :class="`w-full ${errorMessage && meta.touched && 'mb-1 validate-error'} ${
      modelValue && 'has-value'
    } `"
    :id="id"
  />
  <label :for="id" class="label-radio ml-3">{{ label }}</label>
</template>

<script lang="ts">
import { useField } from "vee-validate";
import { defineComponent } from "vue";
import { Field } from "vee-validate";

export default defineComponent({
  name: "InputRadio",
  components: { Field },
  props: {
    id: {
      type: String,
    },
    modelValue: {
      type: String,
      required: true,
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
    type: {
      type: String,
      default: "text",
    },
  },

  setup(props, context) {
    const { errorMessage, meta } = useField(props.name);

    return {
      errorMessage,
      meta,
    };
  },
});
</script>

<style lang="scss">
ion-label {
  font-weight: 400;
  font-size: 14px;
  color: #313131;
  span {
    color: red;
  }
}
.has-value {
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
