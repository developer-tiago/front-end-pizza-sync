<template>
  <div
    v-if="openModal"
    class="modal-overlay modal modal-open"
    @click="handleOverlayClick"
  >
    <div class="modal-box relative">
      <!-- TITLE -->
      <h2 class="font-bold text-lg mb-4">Adicionar Categoria</h2>

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
          <small v-if="validation.name" class="text-error">O campo 'Nome' é obrigatório.</small>
        </label>
        <label for="description" class="flex flex-col gap-2"
          >Descrição
          <textarea
            id="description"
            v-model="form.description"
            class="textarea textarea-bordered textarea-md  w-full"
            maxlength="255"
          ></textarea>
          <small class="text-end">{{ form.description.length }} / 255</small>
        </label>
      </div>

        <!-- FOOTER -->
        <div class="flex justify-end gap-4">
          <button class="btn btn-outline btn-error" @click="$emit('close')">
            Cancelar
          </button>
          <button class="btn btn-outline btn-success" @click="createCategory()">
            Adicionar
          </button>
        </div>
    </div>
  </div>
</template>

<script>
import CategoryApi from "@/server/categories";

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
        description: "",
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

    createCategory() {
      this.busy = true;

      if (this.checkForm()) {
        this.busy = false;
        return;
      }

      this.busy = true;

      CategoryApi.store(this.form)
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
