<template>
  <div
    v-if="openModal"
    class="modal-overlay modal modal-open"
    @click="handleOverlayClick"
  >
    <div class="modal-box w-8/12 max-w-5xl relative">
      <!-- TITLE -->
      <h2 class="font-bold text-lg mb-4">Adicionar Produto</h2>

      <!-- BODY -->
      <div class="flex flex-wrap mb-4">
        <label for="name" class="flex flex-col gap-2 mb-4 w-full"
          >Nome
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="input input-bordered input-md"
            :class="{ 'input-error': validation.name }"
            @input="validation.name = false"
          />
          <small v-if="validation.name" class="text-error"
            >O campo 'Nome' é obrigatório.</small
          >
        </label>

        <label
          for="code"
          class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
          >Código
          <input
            id="code"
            v-model="form.code"
            type="text"
            class="input input-bordered input-md"
            :class="{ 'input-error': validation.code }"
            @input="validation.code = false"
          />
          <small v-if="validation.code" class="text-error"
            >O campo 'Código' é obrigatório.</small
          >
        </label>

        <label
          for="price"
          class="flex flex-col gap-2 sm:ps-2 mb-4 w-full sm:w-1/2"
          >Preço
          <InputMoney
            id="price"
            v-model="form.price"
            @input="validation.price = false"
          />
        </label>

        <label
          for="category"
          class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
          >Categoria
          <select
            id="category"
            v-model="form.category_id"
            type="text"
            class="select select-bordered input-md"
            :class="{ 'select-error': validation.category }"
            @change="validation.category = false"
          >
            <option disabled selected :value="null">
              Selecione uma categoria
            </option>
            <option v-for="category in categories" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <small v-if="validation.category" class="text-error"
            >O campo 'Categoria' é obrigatório.</small
          >
        </label>

        <label
          for="environment"
          class="flex flex-col gap-2 sm:ps-2 mb-4 w-full sm:w-1/2"
          >Ambiente
          <select
            id="environment"
            v-model="form.environment_id"
            type="text"
            class="select select-bordered input-md"
            :class="{ 'select-error': validation.environment }"
            @change="validation.environment = false"
          >
            <option disabled selected :value="null">
              Selecione um ambiente
            </option>
            <option v-for="environment in environments" :value="environment.id">
              {{ environment.name }}
            </option>
          </select>
          <small v-if="validation.environment" class="text-error"
            >O campo 'Ambiente' é obrigatório.</small
          >
        </label>

        <label for="description" class="flex flex-col gap-2 w-full"
          >Descrição
          <textarea
            id="description"
            v-model="form.description"
            class="textarea textarea-bordered textarea-md w-full"
            maxlength="255"
          />
          <small class="text-end">{{ form.description.length }} / 255</small>
        </label>
      </div>

      <!-- FOOTER -->
      <div class="flex justify-end gap-4">
        <button class="btn btn-outline btn-error" @click="$emit('close')">
          Cancelar
        </button>
        <button class="btn btn-outline btn-success" @click="createProdutct()">
          Adicionar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductApi from "@/server/products";
import CategoryApi from "@/server/categories";
import EnvironmentApi from "@/server/environments";
import InputMoney from "@/components/inputMoney.vue";

export default {
  components: {
    InputMoney,
  },
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
        code: "",
        price: 0,
        category_id: null,
        environment_id: null,
        description: "",
      },
      validation: {
        name: false,
        code: false,
        price: false,
        category: false,
        environment: false,
      },
      busy: false,
      categories: [],
      environments: [],
    };
  },

  mounted() {
    this.loadCategories();
    this.loadEnvironments();
  },

  methods: {
    loadCategories() {
      CategoryApi.index()
        .then((response) => {
          this.categories = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    loadEnvironments() {
      EnvironmentApi.index()
        .then((response) => {
          this.environments = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleOverlayClick(event) {
      if (event.target.classList.contains("modal-overlay")) this.$emit("close");
    },

    createProdutct() {
      this.busy = true;

      if (this.checkForm()) {
        this.busy = false;

        return;
      }

      ProductApi.store(this.form)
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

      if (this.form.code === "") {
        this.validation.code = true;
        checkFields = true;
      }

      if (this.form.category_id === null) {
        this.validation.category = true;
        checkFields = true;
      }

      if (this.form.environment_id === null) {
        this.validation.environment = true;
        checkFields = true;
      }

      return checkFields;
    },
  },
};
</script>
