<template>
  <div
    v-if="openModal"
    class="modal-overlay modal modal-open"
    @click="handleOverlayClick"
  >
    <div class="modal-box relative">
      <!-- TITLE -->
      <h2 class="font-bold text-lg mb-4">Adicionar Ambiente</h2>

      <!-- BODY -->
      <div class="flex flex-col gap-4 mb-4">
        <label for="name" class="flex flex-col gap-2"
          >Nome
          <input
            v-model="form.name"
            type="text"
            class="input input-bordered input-md w-full"
            :class="{ 'input-error': validation.name }"
            @input="validation.name = false"
          />
          <small v-if="validation.name" class="text-error"
            >O campo 'Nome' é obrigatório.</small
          >
        </label>
      </div>

      <!-- FOOTER -->
      <div class="flex justify-end gap-4">
        <button class="btn btn-outline btn-error" @click="$emit('close')">
          Cancelar
        </button>
        <button
          class="btn btn-outline btn-success"
          :disabled="busy"
          @click="createEnvironment()"
        >
          Adicionar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EnvironmentApi from "@/server/environments";

export default {
  props: {
    openModal: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      form: {
        name: "",
      },
      validation: {
        name: false,
      },
      busy: false,
    };
  },

  methods: {
    handleOverlayClick(event) {
      if (event.target.classList.contains("modal-overlay")) this.$emit("close");
    },

    createEnvironment() {
      this.busy = true;

      if (this.checkForm()) {
        this.busy = false;
        return;
      }

      EnvironmentApi.store(this.form)
        .then(() => {
          this.$emit("created");
          this.$emit("close");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.busy = false;
        });
    },

    checkForm() {
      let checkFields = false;

      if (this.form.name === "") {
        this.validation.name = true;
        checkFields = true;
      }

      return checkFields;
    },
  },
};
</script>
