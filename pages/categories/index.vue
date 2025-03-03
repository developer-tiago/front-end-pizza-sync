<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ModalAddCategory from "./components/ModalAddCategory.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import Pagination from "@/components/Pagination.vue";
import AlertSuccess from "@/components/AlertSuccess.vue";
import CategoryApi from "@/server/categories";

// Interrfaces
interface Modal {
  create: boolean;
  edit: boolean;
  delete: boolean;
}
interface Category {
  id: string;
  account_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
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
const categories = ref<Category[]>([]);
const modalSelected: any = ref(null);
const isLoading: Ref<boolean> = ref(true);
const busy: Ref<boolean> = ref(false);

// Funções
async function loadCategories(): Promise<void> {
  try {
    busy.value = true;

    const response = await CategoryApi.paginate(pagination.value.current_page);

    if (response.data.data.length === 0 && pagination.value.current_page > 1) {
      pagination.value.current_page--;
      loadCategories();
    }

    categories.value = response.data.data;
    pagination.value.total = response.data.total;
    pagination.value.last_page = response.data.last_page;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
    busy.value = false;
  }
}

function goToPage(page: number): void {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page;
    loadCategories();
  }
}

function categoryCreated() {
  loadCategories();

  alert.value.text = "Categoria adicionada com sucesso!";
  alert.value.type = "success";
  alert.value.show = true;
}

function openDeleteModal(category: Category): void {
  modalSelected.value = {
    title: "Excluir categoria",
    confirmationQuestion: `Deseja realmente excluir a categoria <b>${category.name}</b>?`,
    id: category.id,
  };

  modal.value.delete = true;
}

async function deleteCategory(id: string): Promise<void> {
  try {
    await CategoryApi.delete(id);

    loadCategories();

    modal.value.delete = false;

    alert.value = {
      text: "Categoria excluída com sucesso!",
      type: "success",
      show: true,
    };
  } catch (error) {
    console.log(error);
  }
}

// OnMounted
onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div v-if="isLoading" class="flex justify-center">
    <span class="loading loading-infinity loading-lg text-center"></span>
  </div>
  <div v-else>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Categorias</h1>
      <button class="btn btn-neutral btn-sm" @click="modal.create = true">
        Adicionar
      </button>
    </div>

    <table class="table table-lg mb-4">
      <thead>
        <tr>
          <th>Name</th>
          <th class="w-1 whitespace-nowrap"></th>
        </tr>
      </thead>
      <tbody v-if="categories.length > 0">
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.name }}</td>
          <td class="flex gap-2">
            <button
              class="btn btn-square btn-outline btn-xs tooltip"
              data-tip="Descrição"
            >
              <Icon name="ic:outline-description" />
            </button>
            <button
              class="btn btn-square btn-outline btn-xs tooltip"
              data-tip="Editar"
            >
              <Icon name="ic:twotone-edit" />
            </button>
            <button
              class="btn btn-square btn-outline btn-xs tooltip"
              data-tip="Remover"
              @click="openDeleteModal(category)"
            >
              <Icon name="ic:twotone-delete" />
            </button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="100%" class="text-center py-8">
            Nenhuma categoria encontrada
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :pagination="pagination"
      :busy="busy"
      @goToPage="goToPage($event)"
    />

    <ModalAddCategory
      v-if="modal.create"
      :openModal="modal.create"
      @close="modal.create = false"
      @created="categoryCreated()"
    />

    <ModalDelete
      v-if="modal.delete"
      :openModal="modal.delete"
      :content="modalSelected"
      @close="modal.delete = false"
      @callBack="deleteCategory($event)"
    />

    <AlertSuccess
      v-if="alert.show"
      :text="alert.text"
      :type="alert.type"
      @finished="alert.show = false"
    />
  </div>
</template>
