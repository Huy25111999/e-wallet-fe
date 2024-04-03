<template>
  <ion-label class="mb-5">{{ label }}<span>*</span></ion-label>
  <div class="w-full relative">
    <Field
      :type="type"
      :name="name"
      :value="modelValue"
      :inputmode="inputmode"
      @input="updateValue"
      :placeholder="placeholder"
      :class="`w-full ${errorMessage && 'mb-1 validate-error'} ${modelValue && 'has-value'} `"
      ref="inputRef"
    />
    <div class="clear-input" @click="handleClearValue" v-if="modelValue">
      <ion-icon :icon="closeCircleOutline" />
    </div>
  </div>
  <p v-if="errorMessage" :class="'validate-message'">{{ errorMessage }}</p>
</template>

<script lang="ts">
import { IonLabel, IonIcon } from "@ionic/vue";
import { useField } from "vee-validate";
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { closeCircleOutline } from "ionicons/icons";
import { toNonAccent } from "@/helpers/languageHelper";
import { Field } from "vee-validate";

export default defineComponent({
  name: "InputField",
  components: { IonLabel, Field, IonIcon },
  props: {
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
    inputmode: {
      type: String,
      default: "text",
    },
    hasCharacter: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const { errorMessage, meta } = useField(props.name);
    const inputRef = ref();

    const updateValue = (event: any) => {
      let value = event.target.value;

      if (props.hasCharacter) {
        value = toNonAccent(value);
      }

      context.emit("update:modelValue", value);
    };

    const handleClearValue = (event: any) => {
      context.emit("update:modelValue", "");
    };

    const onBlockSpecialCharactor = (evt: any) => {
      if ((evt.which != 8 && evt.which != 0 && evt.which < 48) || evt.which > 57) {
        evt.preventDefault();
      }
    };

    onMounted(() => {
      if (props.type === "number" && inputRef.value?.$el) {
        inputRef.value.$el.addEventListener("keypress", onBlockSpecialCharactor);
        inputRef.value.$el.addEventListener("paste", onBlockSpecialCharactor);
      }
    });

    onUnmounted(() => {
      if (props.type === "number" && inputRef.value?.$el) {
        inputRef.value.$el.removeEventListener("keypress", onBlockSpecialCharactor);
        inputRef.value.$el.removeEventListener("paste", onBlockSpecialCharactor);
      }
    });

    return {
      errorMessage,
      meta,
      closeCircleOutline,
      updateValue,
      handleClearValue,
      inputRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.clear-input {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  opacity: 0.5;
  ion-icon {
    color: #9896a8;
  }
}
ion-label {
  font-weight: 400;
  font-size: 14px;
  color: #9896a8;
  span {
    color: red;
  }
}
input {
  background: #fff;
  border-bottom: 1px solid #d7d7d7;
  font-size: 14px;
  opacity: 0.5;
  color: #313131;
  padding-bottom: 4px;
  padding-right: 20px;

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
