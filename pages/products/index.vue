<template>
  <div v-if="isLoading" class="flex justify-center">
    <span class="loading loading-dots loading-lg text-center"></span>
  </div>
  <div v-else>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Produtos</h1>
      <button class="btn btn-neutral btn-sm" @click="modal.create = true">
        Adicionar
      </button>
    </div>

    <table  class="table table-lg mb-4">
      <thead>
        <tr>
          <th class="w-1 whitespace-nowrap">Código</th>
          <th>Name</th>
          <th class="w-1 whitespace-nowrap">Preço</th>
          <th>Categoria</th>
          <th class="w-1 whitespace-nowrap">Descrição</th>
          <th class="w-1 whitespace-nowrap"></th>
        </tr>
      </thead>
      <tbody v-if="products.length > 0">
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.code }}</td>
          <td>{{ product.name }}</td>
          <td>{{ $formatCurrency(product.price) }}</td>
          <td>
            {{ product.category.name }}
          </td>
          <td>
            <div class="flex justify-center">
              <button class="btn btn-square btn-outline btn-xs">
                <Icon name="ic:outline-description" />
              </button>
            </div>
          </td>
          <td>
            <div class="flex gap-2">
              <button class="btn btn-square btn-outline btn-xs">
                <Icon name="ic:twotone-edit" />
              </button>
              <button
                class="btn btn-square btn-outline btn-xs"
                @click="openDeleteModal(product)"
              >
                <Icon name="ic:twotone-delete" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="100%" class="text-center py-8">Nenhum produto encontrado</td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :pagination="pagination"
      :busy="busy"
      @goToPage="goToPage($event)"
    />

    <ModalAddProduct
      v-if="modal.create"
      :openModal="modal.create"
      @close="modal.create = false"
      @created="productCreated()"
    />

    <ModalDelete
      v-if="modal.delete"
      :openModal="modal.delete"
      :content="modalSelected"
      @close="modal.delete = false"
      @callBack="deleteProduct($event)"
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
import ModalAddProduct from "./components/ModalAddProduct.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import Pagination from "@/components/Pagination.vue";
import AlertSuccess from "@/components/AlertSuccess.vue";
import ProductApi from "@/server/products";

export default {
  components: {
    ModalAddProduct,
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
      products: [],
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
    this.loadProducts();
  },

  methods: {
    async loadProducts() {
      this.busy = true;
      await ProductApi.paginate(this.pagination.current_page)
        .then((response) => {
          if (
            response.data.data.length === 0 &&
            this.pagination.current_page > 1
          ) {
            this.pagination.current_page--;
            this.loadProducts();
          }
          this.products = response.data.data;
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
        this.loadProducts();
      }
    },

    productCreated() {
      this.loadProducts();

      this.alert = {
        text: "Produto adicionado com sucesso!",
        type: "success",
        show: true,
      };
    },

    openDeleteModal(product) {
      this.modalSelected = {
        title: "Excluir produto",
        confirmationQuestion: `Deseja realmente excluir a categoria <b>${product.name}</b>?`,
        id: product.id,
      };

      this.modal.delete = true;
    },

    async deleteProduct(id) {
      await ProductApi.delete(id)
        .then(() => {
          this.loadProducts();

          this.modal.delete = false;
          
          this.alert = {
            text: "Produto excluído com sucesso!",
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
