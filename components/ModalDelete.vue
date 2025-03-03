<script setup lang="ts">
import { defineEmits ,defineProps } from "vue";

const props = defineProps({
  openModal: {
    type: Boolean,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits<{
  (event: "close"): void;
  (event: 'callBack', id: string): void;
}>();

function handleOverlayClick(event: MouseEvent) {
  if ((event.target as HTMLElement).classList.contains("modal-overlay")) emit("close");
}

function callBack() {
  emit("callBack", props.content.id);
}
</script>

<template>
  <div
    v-if="openModal"
    class="modal-overlay modal modal-open"
    @click="handleOverlayClick"
  >
    <div class="modal-box relative">
      <!-- TITLE -->
      <h2 class="font-bold text-lg mb-4">{{ content.title }}</h2>

      <!-- BODY -->
      <div class="mb-4" v-html="content.confirmationQuestion" />

      <!-- FOOTER -->
      <div class="flex justify-end gap-4">
        <button class="btn btn-outline btn-error" @click="emit('close')">
          Cancelar
        </button>
        <button class="btn btn-outline btn-success" @click="callBack()">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>
