<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

const phone = ref("");
const bindProps = ref({
  validCharactersOnly: true,
  mode: "auto",
  defaultCountry: "BR",
  disabledFetchingCountry: false,
  disabled: false,
  disabledFormatting: false,
  placeholder: "",
  true: false,
  enabledCountryCode: false,
  enabledFlags: true,
  preferredCountries: [],
  onlyCountries: [],
  ignoredCountries: [],
  autocomplete: "off",
  name: "telephone",
  maxLen: 25,
  wrapperClasses: "",
  inputClasses: "",
  dropdownOptions: {
    disabledDialCode: true,
    showFlags: true,
    showSearchBox: true,
  },
  inputOptions: {
    showDialCode: true,
  },
});
const widthPhone = ref("0");

function openDropdown() {
  setTimeout(() => {
    const dropdownList = document.querySelector(
      ".vti__dropdown-list"
    ) as HTMLElement;

    if (dropdownList) {
      dropdownList.style.width = widthPhone.value;

      setTimeout(() => {
        dropdownList.classList.add("visible");
      }, 10);
    }
  }, 10);
}

function updateWidthDropdown() {
  if (widthPhone.value == "0") {
    setTimeout(() => {
      const inputTel = document.querySelector(".input-tel") as HTMLElement;
      widthPhone.value = inputTel.offsetWidth + "px";
    }, 10);
  }
  const inputTel = document.querySelector(".input-tel") as HTMLElement;
  widthPhone.value = inputTel.offsetWidth + "px";

  const dropdownList = document.querySelector(
    ".vti__dropdown-list"
  ) as HTMLElement;

  if (dropdownList) {
    dropdownList.style.width = widthPhone.value;
  }
}

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateWidthDropdown);
});

onMounted(() => {
  updateWidthDropdown();

  window.addEventListener("resize", updateWidthDropdown);
});
</script>

<template>
  <vue-tel-input
    v-model="phone"
    v-bind="bindProps"
    mode="international"
    class="input-tel"
    @open="openDropdown"
  />
</template>

<style>
.vue-tel-input {
  @apply input input-bordered input-md ps-0;
  border-color: var(--fallback-bc, oklch(var(--bc) / 0.2));
  box-shadow: none !important;
}

.vue-tel-input .vti__dropdown-list {
  @apply bg-base-100 rounded-md mt-5;
  border-color: var(--fallback-bc, oklch(var(--bc) / 0.2));
}

.vue-tel-input .vti__dropdown:hover {
  @apply bg-base-100 rounded-3xl;
  /*  */
}

.vue-tel-input .vti__dropdown.open {
  @apply bg-base-100 rounded-3xl;
}

.vti__search_box_container {
  @apply ps-1 pe-4 pt-1;
}

.vti__search_box {
  @apply rounded-md w-full;
  border-color: var(--fallback-bc, oklch(var(--bc) / 0.2));
}

.vti__search_box::placeholder {
  color: transparent;
}

.vti__dropdown-item.highlighted {
  @apply bg-base-200;
}
</style>
