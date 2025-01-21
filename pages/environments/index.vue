<script lang="ts" setup>
import { ref, onMounted } from "vue";
import ModalAddEnvironment from "./components/ModalAddEnvironment.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import Pagination from "@/components/Pagination.vue";
import AlertSuccess from "@/components/AlertSuccess.vue";
import EnvironmentApi from "@/server/environments";

// Interfaces
interface Modal {
  create: boolean;
  edit: boolean;
  delete: boolean;
}
interface Pagination {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}
interface Alert {
  text: string;
  show: boolean;
  type: string;
}
interface Environment {
  id: string;
  account_id: string;
  name: string;
  created_at: string
}

// Variáveis
const modal = ref<Modal>({
  create: false,
  edit: false,
  delete: false,
});
const pagination = ref<Pagination>({
  total: 0,
  current_page: 1,
  last_page: 1,
  per_page: 10,
});
const alert = ref<Alert>({
  text: "",
  show: false,
  type: "success",
});
const modalSelected: any = ref(null)
const environments = ref<Environment[]>([]);
const isLoading: Ref<boolean> = ref(true);
const busy: Ref<boolean> = ref(false);

// Funções
async function loadEnvironments(): Promise<void> {
  try {
    busy.value = true;

    const response = await EnvironmentApi.paginate(pagination.value.current_page)

    if (response.data.data.length === 0 && pagination.value.current_page > 1) {
      pagination.value.current_page--
      loadEnvironments()
    }

    environments.value = response.data.data;
    pagination.value.total = response.data.total;
    pagination.value.last_page = response.data.last_page;

  } catch (error: any) {
    console.log(error)
  } finally {
    isLoading.value = false;
    busy.value = false
  }
}

function goToPage(page: number): void {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page;
    loadEnvironments();
  }
}

function environmentCreated(): void {
  loadEnvironments();

  alert.value.text = "Ambiente adicionado com sucesso!";
  alert.value.type = "success";
  alert.value.show = true;
}

function openDeleteModal(environment: Environment): void {
  modalSelected.value = {
    title: "Excluir ambiente",
    confirmationQuestion: `Deseja realmente excluir o ambiente <b>${environment.name}</b>?`,
    id: environment.id,
  };

  modal.value.delete = true;
}

async function deleteEnvironment(id: string): Promise<void> {
  try {
    await EnvironmentApi.delete(id)

    loadEnvironments();

    modal.value.delete = false;

    alert.value = {
      text: "Ambiente excluído com sucesso!",
      type: "success",
      show: true,
    };
  } catch (error) {
    console.log(error)
  }
}

// OnMounted
onMounted(() => {
  loadEnvironments();
})
</script>

<template>
  <div v-if="isLoading" class="flex justify-center">
    <span class="loading loading-dots loading-lg text-center"></span>
  </div>
  <div v-else>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Ambientes</h1>
      <button class="btn btn-neutral btn-sm" @click="modal.create = true">
        Adicionar
      </button>
    </div>

    <table class="table table-lg mb-4">
      <thead>
        <tr>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="environments.length > 0">
        <tr v-for="environment in environments" :key="environment.id">
          <td>{{ environment.name }}</td>
          <td>
            <div class="flex justify-end gap-2">
              <button class="btn btn-square btn-outline btn-xs">
                <Icon name="ic:twotone-edit" />
              </button>
              <button
                class="btn btn-square btn-outline btn-xs"
                @click="openDeleteModal(environment)"
              >
                <Icon name="ic:twotone-delete" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="100%" class="text-center py-8">
            Nenhum ambiente encontrado
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :pagination="pagination"
      :busy="busy"
      @goToPage="goToPage($event)"
    />

    <ModalAddEnvironment
      v-if="modal.create"
      :openModal="modal.create"
      @close="modal.create = false"
      @created="environmentCreated()"
    />

    <ModalDelete
      v-if="modal.delete"
      :openModal="modal.delete"
      :content="modalSelected"
      @close="modal.delete = false"
      @callBack="deleteEnvironment($event)"
    />

    <AlertSuccess
      v-if="alert.show"
      :text="alert.text"
      :type="alert.type"
      @finished="alert.show = false"
    />
  </div>
</template>
