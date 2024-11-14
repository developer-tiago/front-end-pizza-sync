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

<script>
import ModalAddEnvironment from "./components/ModalAddEnvironment.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import Pagination from "@/components/Pagination.vue";
import AlertSuccess from "@/components/AlertSuccess.vue";
import EnvironmentApi from "@/server/environments";

export default {
  components: {
    ModalAddEnvironment,
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
      environments: [],
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
    this.loadEnvironments();
  },

  methods: {
    async loadEnvironments() {
      this.busy = true;
      await EnvironmentApi.paginate(this.pagination.current_page)
        .then((response) => {
          if (
            response.data.data.length === 0 &&
            this.pagination.current_page > 1
          ) {
            this.pagination.current_page--;
            this.loadEnvironments();
          }

          this.environments = response.data.data;
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
        this.loadEnvironments();
      }
    },

    environmentCreated() {
      this.loadEnvironments();

      this.alert.text = "Ambiente adicionado com sucesso!";
      this.alert.type = "success";
      this.alert.show = true;
    },

    openDeleteModal(environment) {
      this.modalSelected = {
        title: "Excluir ambiente",
        confirmationQuestion: `Deseja realmente excluir o ambiente <b>${environment.name}</b>?`,
        id: environment.id,
      };

      this.modal.delete = true;
    },

    async deleteEnvironment(id) {
      await EnvironmentApi.delete(id)
        .then(() => {
          this.loadEnvironments();

          this.modal.delete = false;

          this.alert = {
            text: "Ambiente excluído com sucesso!",
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
