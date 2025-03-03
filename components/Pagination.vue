<script setup lang="ts">
import { computed, defineEmits, defineProps } from "vue";

const props = defineProps({
  pagination: Object,
  busy: Boolean,
});
const emit = defineEmits<{
  (event: "goToPage", page: number): void;
}>();
const pages = computed(() => {
  let startPage = Math.max(
    1,
    props.pagination?.current_page - Math.floor(3 / 2)
  );
  let endPage = Math.min(startPage + 3 - 1, props.pagination?.last_page);

  if (endPage - startPage < 3 - 1) {
    startPage = Math.max(1, endPage - 3 + 1);
  }

  return Array.from(
    { length: endPage - startPage + 1 },
    (v, k) => startPage + k
  );
});
</script>

<template>
  <div class="join w-full d-flex justify-center">
    <button
      class="join-item btn btn-sm"
      :disabled="props.pagination?.current_page === 1"
      @click="emit('goToPage', 1)"
    >
      «
    </button>

    <button
      class="join-item btn btn-sm"
      :disabled="props.pagination?.current_page === 1"
      @click="emit('goToPage', props.pagination?.current_page - 1)"
    >
      ‹
    </button>

    <button
      class="join-item btn btn-sm"
      :disabled="busy"
      v-for="page in pages"
      :key="page"
      @click="emit('goToPage', page)"
      :class="{ 'btn-active': props.pagination?.current_page === page }"
    >
      {{ page }}
    </button>

    <button
      class="join-item btn btn-sm"
      :disabled="props.pagination?.current_page === props.pagination?.last_page"
      @click="emit('goToPage', props.pagination?.current_page + 1)"
    >
      ›
    </button>

    <button
      class="join-item btn btn-sm"
      :disabled="props.pagination?.current_page === props.pagination?.last_page"
      @click="emit('goToPage', props.pagination?.last_page)"
    >
      »
    </button>
  </div>
</template>
