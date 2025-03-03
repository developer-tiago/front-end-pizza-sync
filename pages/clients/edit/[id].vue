<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CountryApi from "@/server/countries";
import ClientApi from "@/server/clients";
// @ts-ignore
import AlertSuccess from "@/components/AlertSuccess.vue";

// INTERFACES
interface Client {
  id: string;
  account_id: string;
  country_id: string;
  name: string;
  email: string;
  street: string;
  phone: string;
  full_phone: string;
  phone_prefix: string;
  number: string;
  neighborhood: string;
  city: string;
  complement: string;
  created_at: string;
  updated_at: string;
}
interface Validation {
  name: boolean | null;
  email: boolean | null;
  street: boolean | null;
  number: boolean | null;
  full_phone: boolean | null;
}
interface Country {
  id: string;
  name: string;
}
interface PhoneValidation {
  valid: boolean;
  countryCallingCode: string;
}

// VARIÁVEIS
const isBusy = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const form = ref<Client>({
  id: "",
  account_id: "",
  country_id: "",
  name: "",
  email: "",
  phone: "",
  full_phone: "",
  phone_prefix: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  complement: "",
  created_at: "",
  updated_at: "",
});
const validation = ref<Validation>({
  name: null,
  email: null,
  street: null,
  number: null,
  full_phone: null,
});
const countries = ref<Country[]>([]);
const route = useRoute();
const userId = route.params.id as string;
const alert = ref({
  text: "",
  type: "",
  show: false,
});

// FUNÇÕES
async function loadClienteById() {
  await ClientApi.findById(userId)
    .then((response) => {
      form.value = response.data;
      combinePrefixWithTelephone(form.value.phone_prefix, form.value.phone);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isLoading.value = false;
    });
}

async function loadCountries() {
  await CountryApi.index()
    .then((response) => {
      countries.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateClient() {
  isBusy.value = true;

  await ClientApi.update(userId, form.value)
    .then(() => {
      alert.value.text = "Cliente atualizado com sucesso!";
      alert.value.type = "success";
      alert.value.show = true;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isBusy.value = false;
    });
}

function validatePhoneAndPrefix(payload: PhoneValidation) {
  if (payload.valid) {
    form.value.phone_prefix = payload.countryCallingCode;
  }
}

function combinePrefixWithTelephone(prefix: string, phone: string) {
  if (prefix && phone) {
    form.value.full_phone = `+${prefix}${phone}`;
  }
}

watch(
  () => form.value.full_phone,
  (newValue) => {
    if (newValue) {
      let phone = newValue;
      // Remover o prefixo e os espaços do número
      phone = phone
        .replace(`+${form.value.phone_prefix}`, "")
        .trim()
        .replace(/\s+/g, "");
      form.value.phone = phone;
    }
  }
);

onMounted(() => {
  loadClienteById();
  loadCountries();
});
</script>

<template>
  <div v-if="isLoading" class="flex justify-center">
    <span class="loading loading-infinity loading-lg text-center"></span>
  </div>
  <div v-else>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Cliente</h1>
      <button
        class="btn btn-neutral btn-sm"
        :disabled="isBusy"
        @click="updateClient()"
      >
        Salvar
      </button>
    </div>
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
          v-model="form.full_phone"
          :class="{ 'input-error': validation.full_phone }"
          @input="validation.full_phone = false"
          @validate="validatePhoneAndPrefix"
        />

        <small v-if="validation.full_phone" class="text-error"
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

      <label for="city" class="flex flex-col gap-2 sm:pe-2 mb-4 w-full sm:w-1/2"
        >Cidade
        <input
          id="city"
          v-model="form.city"
          type="text"
          class="input input-bordered input-md"
        />
      </label>

      <label
        for="complement"
        class="flex flex-col gap-2 sm:pe-2 w-full sm:w-1/2"
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
  </div>

  <AlertSuccess
    v-if="alert.show"
    :text="alert.text"
    :type="alert.type"
    @finished="alert.show = false"
  />
</template>
