<template>
  <v-text-field
    type="text"
    v-model="timeInput"
    @input="applyMask"
    placeholder="mm:ss"
    maxlength="5"
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

const timeInput = ref(""); // For display (mm:ss)

// Watch for changes in modelValue and update timeInput for display
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      let minutes, seconds;
      const sp = newValue.split(":");
      if (sp.length === 2) {
        // hours = "00"; // fix 00
        minutes = sp[0];
        seconds = sp[1];
        emit(
          "update:modelValue",
          `00:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`
        );
      } else if (sp.length === 3) {
        // hours = sp[0]; // fix 00
        minutes = sp[1];
        seconds = sp[2];
      }

      timeInput.value = `${minutes.padStart(2, "0")}:${seconds}`;
    } else {
      timeInput.value = "";
    }
  },
  { immediate: true }
);

// Watch for changes in timeInput and update modelValue with hh:mm:ss format
watch(timeInput, (newValue) => {
  if (newValue) {
    let minutes, seconds;
    const sp = newValue.split(":");
    if (sp.length === 2) {
      // hours = "00"; // fix 00
      minutes = sp[0];
      seconds = sp[1];
    } else if (sp.length === 3) {
      // hours = sp[0]; // fix 00
      minutes = sp[1];
      seconds = sp[2];
    }
    const formattedValue = `00:${minutes.padStart(2, "0")}:${seconds}`;
    emit("update:modelValue", formattedValue);
  } else {
    emit("update:modelValue", null);
  }
});

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

  if (value === null || value.length === 0) {
    timeInput.value = "";
    return;
  }

  if (value.indexOf(":") !== -1) {
    let [minutes, seconds] = value.split(":");
    minutes = minutes.padStart(2, "0");
    seconds = seconds.padStart(2, "0");
    value = `${minutes}:${seconds}`;
  }

  if (value.indexOf(":") === -1 && value.length > 0) {
    value = value.padStart(2, "0") + ":00";
  }

  let [minutes, seconds] = value.split(":");
  if (minutes >= 60) {
    minutes = "59";
    seconds = "59";
  } else if (seconds && seconds.length === 1) {
    seconds = "0" + seconds;
  } else if (seconds && seconds >= 60) {
    seconds = "59";
  }

  timeInput.value = `${minutes}:${seconds}`;
};
</script>
