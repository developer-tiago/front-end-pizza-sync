<template>
  <vue-tel-input
    v-bind="bindProps"
    mode="international"
    class="input-tel"
    @open="openDropdown"
  />
  <!-- <vue-tel-input
    v-bind="bindProps"
    mode="international"
    class="input input-bordered input-md input-tel ps-0"
    @validate="checkEvent"
    @open="openDropdown"
  /> -->
</template>

<script>
import { VueTelInput } from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";

export default {
  components: {
    VueTelInput,
  },

  data() {
    return {
      phone: "",
      bindProps: {
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
      },
      widthPhone: 0,
    };
  },

  mounted() {
    this.updateWidthDropdown();

    window.addEventListener("resize", this.updateWidthDropdown);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateWidthDropdown);
  },

  methods: {
    // checkEvent(event) {
      // this.validation.phone = null;

    //   if (event && event.valid === false) {
    //     this.message.error.phone =
    //       "Este formato de celular não é valido no país selecionado";
    //     this.validation.phone = false;
    //   }
    // },

    openDropdown() {
      setTimeout(() => {
        const dropdownList = document.querySelector(".vti__dropdown-list");

        if (dropdownList) {
          dropdownList.style.width = this.widthPhone;

          setTimeout(() => {
            dropdownList.classList.add("visible");
          }, 10);
        }
      }, 10);
    },

    updateWidthDropdown() {
      if (this.widthPhone === 0) {
        setTimeout(() => {
          const inputTel = document.querySelector(".input-tel");
          this.widthPhone = inputTel.offsetWidth + "px";
        }, 10);
      }
      const inputTel = document.querySelector(".input-tel");
      this.widthPhone = inputTel.offsetWidth + "px";

      const dropdownList = document.querySelector(".vti__dropdown-list");

      if (dropdownList) {
        dropdownList.style.width = this.widthPhone;
      }
    },
  },
};
</script>

<style>
.vue-tel-input {
  @apply input input-bordered input-md ps-0;
  border-color: var(--fallback-bc,oklch(var(--bc)/0.2));
  box-shadow: none !important;
}

.vue-tel-input .vti__dropdown-list {
  @apply bg-base-100 rounded-md mt-5;
  border-color: var(--fallback-bc,oklch(var(--bc)/0.2));
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
  border-color: var(--fallback-bc,oklch(var(--bc)/0.2));
}

.vti__search_box::placeholder {
  color: transparent;
}

.vti__dropdown-item.highlighted {
  @apply bg-base-200;
}
</style>
