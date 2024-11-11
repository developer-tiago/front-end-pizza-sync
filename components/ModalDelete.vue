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
        <button class="btn btn-outline btn-error" @click="$emit('close')">
          Cancelar
        </button>
        <button class="btn btn-outline btn-success" @click="callBack()">
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    openModal: {
      type: Boolean,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      form: {
        name: "",
        description: "",
      },
    };
  },

  methods: {
    handleOverlayClick(event) {
      if (event.target.classList.contains("modal-overlay")) this.$emit("close");
    },

    callBack() {
      this.$emit("callBack", this.content.id);
    },
  },
};
</script>
