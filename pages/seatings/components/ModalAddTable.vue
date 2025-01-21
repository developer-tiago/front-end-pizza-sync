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
      </div>

        <!-- FOOTER -->
        <div class="flex justify-end gap-4">
          <button class="btn btn-outline btn-error" @click="$emit('close')">
            Cancelar
          </button>
          <button class="btn btn-outline btn-success" @click="createTable()">
            Adicionar
          </button>
        </div>
    </div>
  </div>
</template>

<script>
import TableApi from "~/server/seatings"

export default {
  props: {
    openModal: {
      type: Boolean,
      required: true,
    },
  },

  data () {
    return {
      busy: false,
      form: {
        name: ""
      },
      validation: {
        name: false
      }
    }
  },

  methods: {
    createTable() {
      this.busy = true;

      TableApi.store(this.form)
        .then((response) => {
          console.log(response)
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
  }
}
</script>