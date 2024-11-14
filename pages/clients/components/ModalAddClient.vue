<template>
  <div
    v-if="openModal"
    class="modal-overlay modal modal-open"
    @click="handleOverlayClick"
  >
    <div class="modal-box w-8/12 max-w-5xl relative">
      <!-- TITLE -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-lg">Adicionar Cliente</h2>

        <button v-if="form.id" class="btn btn-outline btn-sm btn-success">
          Fazer pedido
          <Icon name="ic:outline-local-pizza" class="w-6 h-6" />
        </button>
      </div>

      <!-- BODY -->
      <div class="flex flex-wrap mb-4">
        <label for="name" class="flex flex-col gap-2 mb-4 w-full"
          >Nome
          <input
          id="name"
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

        <label
          for="phone"
          class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
          >Telefone
          <InputPhone
            id="phone"
            v-model="form.phone"
            :class="{ 'input-error': validation.phone }"
            @input="validation.phone = false"
          />

          <small v-if="validation.phone" class="text-error"
            >O campo 'Telefone' é inválido.</small
          >
        </label>

        <label
          for="email"
          class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
          >E-mail
          <input
            id="email"
            v-model="form.email"
            type="text"
            class="input input-bordered input-md"
            :class="{ 'input-error': validation.email }"
            @input="validation.email = false"
          />
          <small v-if="validation.email" class="text-error"
            >O campo 'E-mail' é inválido.</small
          >
        </label>

        <label
          for="street"
          class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
          >Rua
          <input
            id="street"
            v-model="form.street"
            type="text"
            class="input input-bordered input-md"
            :class="{ 'input-error': validation.street }"
            @input="validation.street = false"
          />
          <small v-if="validation.street" class="text-error"
            >O campo 'Rua' é obrigatório.</small
          >
        </label>

        <label
          for="number"
          class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
          >Número
          <input
            id="number"
            v-model="form.number"
            type="text"
            class="input input-bordered input-md"
            :class="{ 'input-error': validation.number }"
            @input="validation.number = false"
          />
          <small v-if="validation.number" class="text-error"
            >O campo 'Número' é obrigatório.</small
          >
        </label>

        <label
          for="neighborhood"
          class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
          >Bairro
          <input
            id="neighborhood"
            v-model="form.neighborhood"
            type="text"
            class="input input-bordered input-md"
          />
        </label>

        <label
          for="city"
          class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
          >Cidade
          <input
            id="city"
            v-model="form.city"
            type="text"
            class="input input-bordered input-md"
          />
        </label>

        <label for="complement" class="flex flex-col gap-2 sm:pe-2 w-full sm:w-1/2"
          >Complemento
          <input
            id="complement"
            v-model="form.complement"
            type="text"
            class="input input-bordered input-md"
          />
        </label>

        <label
          for="country"
          class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
          >País
          <select
            id="country"
            v-model="form.country_id"
            type="text"
            class="select select-bordered input-md"
          >
            <option disabled selected :value="null">Selecione um país</option>
            <option v-for="country in countries" :value="country.id">
              {{ country.name }}
            </option>
          </select>
        </label>
      </div>

      <!-- FOOTER -->
      <div class="flex justify-end gap-4">
        <button class="btn btn-outline btn-error" @click="$emit('close')">
          Cancelar
        </button>
        <button class="btn btn-outline btn-success" @click="createClient()">
          Adicionar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import InputPhone from "@/components/InputPhone.vue";
import ClientApi from "@/server/clients";
import CountryApi from "@/server/countries";

export default {
  components: {
    InputPhone,
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
        id: null,
        name: "",
        email: "",
        phone_prefix: "",
        phone: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        complement: "",
        country_id: null,
      },
      validation: {
        name: false,
        email: false,
        phone_prefix: false,
        phone: false,
        street: false,
        number: false,
      },
      busy: false,
      countries: [],
    };
  },

  mounted() {
    this.loadCountries();
  },

  methods: {
    loadCountries() {
      CountryApi.index()
        .then((response) => {
          this.countries = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    handleOverlayClick(event) {
      if (event.target.classList.contains("modal-overlay")) this.$emit("close");
    },

    createClient() {
      this.busy = true;

      if (this.checkForm()) {
        this.busy = false;
        return;
      }

      this.busy = true;

      ClientApi.store(this.form)
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
