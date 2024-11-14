<template>
  <div v-if="isLoading" class="flex justify-center">
    <span class="loading loading-dots loading-lg text-center"></span>
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
          <th>Descrição</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="categories.length > 0">
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.name }}</td>
          <td>
            <span v-if="category.description">{{ category.description }}</span>
            <span v-else>---</span>
          </td>
          <td>
            <div class="flex justify-end gap-2">
              <button class="btn btn-square btn-outline btn-xs">
                <Icon name="ic:twotone-edit" />
              </button>
              <button
                class="btn btn-square btn-outline btn-xs"
                @click="openDeleteModal(category)"
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

<script>
import ModalAddCategory from "./components/ModalAddCategory.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import Pagination from "@/components/Pagination.vue";
import AlertSuccess from "@/components/AlertSuccess.vue";
import CategoryApi from "@/server/categories";

export default {
  components: {
    ModalAddCategory,
    ModalDelete,
    Pagination,
    AlertSuccess,
  },

  data() {
    return {
      isLoading: true,
      busy: false,
      modal: {
        create: false,
        edit: false,
        delete: false,
      },
      modalSelected: null,
      categories: [],
      pagination: {
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 10,
      },
      alert: {
        text: "",
        show: false,
        type: "success",
      },
    };
  },

  async mounted() {
    this.loadCategories();
  },

  methods: {
    async loadCategories() {
      this.busy = true;
      await CategoryApi.paginate(this.pagination.current_page)
        .then((response) => {
          if (
            response.data.data.length === 0 &&
            this.pagination.current_page > 1
          ) {
            this.pagination.current_page--;
            this.loadCategories();
          }

          this.categories = response.data.data;
          this.pagination.total = response.data.total;
          this.pagination.last_page = response.data.last_page;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
          this.busy = false;
        });
    },

    goToPage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        this.loadCategories();
      }
    },

    categoryCreated() {
      this.loadCategories();

      this.alert.text = "Categoria adicionada com sucesso!";
      this.alert.type = "success";
      this.alert.show = true;
    },

    openDeleteModal(category) {
      this.modalSelected = {
        title: "Excluir categoria",
        confirmationQuestion: `Deseja realmente excluir a categoria <b>${category.name}</b>?`,
        id: category.id,
      };

      this.modal.delete = true;
    },

    async deleteCategory(id) {
      await CategoryApi.delete(id)
        .then(() => {
          this.loadCategories();

          this.modal.delete = false;

          this.alert = {
            text: "Categoria excluída com sucesso!",
            type: "success",
            show: true,
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
