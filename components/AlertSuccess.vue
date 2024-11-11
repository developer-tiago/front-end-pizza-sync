<template>
  <div class="w-full flex justify-center">
    <div class="fixed bottom-0 mb-4">
      <div
        role="alert"
        class="alert alert-success"
        :class="typeAlert()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 shrink-0 stroke-current me-2"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ text }}</span>
      </div>
    </div>
  </div>
</template>


<script setup>
const emit = defineEmits(['finished']);
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

const typeAlert = () => {
  switch (props.type) {
    case "success":
      return "alert-success";
    case "error":
      return "alert-error";
    case "warning":
      return "alert-warning";
    default:
      return "alert-success";
  }
}

setTimeout(function () {
  emit("finished")
}, 3000);
</script>