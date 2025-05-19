<template>
  <v-text-field
    type="text"
    v-model="timeInput"
    @input="applyMask"
    placeholder="HH:mm"
    maxlength="5"
    autocomplete="off"
    @change="onInputUpdated"
    @keypress="onKeypress"
    append-inner-icon="mdi-clock-time-eight-outline"
  ></v-text-field>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
// Define props
const props = defineProps({
  modelValue: {
    type: String,
  },
});

// Define emits
const emit = defineEmits(["update:modelValue"]);

const timeInput = ref(null);

watch(
  () => props.modelValue,
  (newValue) => {
    timeInput.value = newValue;
  },
  { immediate: true }
);
watch(
  timeInput,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { deep: true }
);

// watch(timeInput, (newValue) => {
//   emit("input", newValue);
// });

const onKeypress = (e) => {
  const key = e.key;
  const isValidKey = /[0-9:]/.test(key);

  if (!isValidKey) {
    e.preventDefault();
  }
};

const applyMask = () => {
  // let value = timeInput.value.replace(/\D/g, ""); // Remove non-numeric characters
  let value = timeInput.value;
  // Auto-insert colon after 2 digits (HH:mm format)
  if(!value) return;
  if (value.length >= 3) {
    if (value.indexOf(":") === -1) {
      value = value.slice(0, 2) + ":" + value.slice(2, 4);
      // Update the input value
      let [hours, minutes] = value.split(":");
      timeInput.value = [hours, minutes].filter(Boolean).join(":");
    } else {
      let [hours, minutes] = value.split(":");
      hours = hours.padStart(2, "0");
      minutes = minutes.padStart(2, "0");
      value = hours + ":" + minutes;
    }
  }
};

const onInputUpdated = () => {
  let value = timeInput.value;

  if (!value || value.length === 0) {
    timeInput.value = "";
    return;
  }

  // Normalize format
  if (!value.includes(":")) {
    value = value.padStart(2, "0") + ":00";
  }

  let [hours = "00", minutes = "00"] = value.split(":");

  hours = hours.padStart(2, "0");
  minutes = minutes.padStart(2, "0");

  // Convert to numbers for logic
  let h = parseInt(hours);
  let m = parseInt(minutes);

  // Special: if hours === 24, reset to 0
  if (h === 24) h = 0;

  //  Clamp max
  if (h > 23) h = 0;
  if (m > 59) m = 0;

  // Return to formatted string
  timeInput.value = `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}`;
};
</script>
