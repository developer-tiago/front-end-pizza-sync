<template>
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-2xl font-bold">Mesas</h1>
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
    <tbody v-if="seatings.length > 0">
      <tr v-for="seating in seatings" :key="seating.id">
        <td>{{ seating.name }}</td>
        <td>
          <div class="flex justify-end gap-2">
            <button class="btn btn-square btn-outline btn-xs">
              <Icon name="ic:twotone-edit" />
            </button>
            <button
              class="btn btn-square btn-outline btn-xs"
              @click="openDeleteModal(seating)"
            >
              <Icon name="ic:twotone-delete" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td colspan="100%" class="text-center py-8">Nenhuma mesa encontrada</td>
      </tr>
    </tbody>
  </table>

  <Pagination
    :pagination="pagination"
    :busy="busy"
    @goToPage="goToPage($event)"
  />

  <ModalAddTable
    v-if="modal.create"
    :openModal="modal.create"
    @close="modal.create = false"
    @created="seatingCreated()"
  />

  <ModalDelete
    v-if="modal.delete"
    :openModal="modal.delete"
    :content="modalSelected"
    @close="modal.delete = false"
    @callBack="deleteSeating($event)"
  />

  <AlertSuccess
    v-if="alert.show"
    :text="alert.text"
    :type="alert.type"
    @finished="alert.show = false"
  />
</template>

<script>
import SeatingApi from "@/server/seatings";
import ModalAddTable from "./components/ModalAddTable.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import AlertSuccess from "@/components/AlertSuccess.vue";

export default {
  components: {
    ModalAddTable,
    ModalDelete,
    AlertSuccess,
  },

  data() {
    return {
      seatings: [],
      modal: {
        create: false,
        edit: false,
        delete: false,
      },
      modalSelected: null,
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

  mounted() {
    this.loadSeatings();
  },

  methods: {
    async loadSeatings() {
      await SeatingApi.paginate(this.pagination.current_page)
        .then((response) => {
          if (
            response.data.data.length === 0 &&
            this.pagination.current_page > 1
          ) {
            this.pagination.current_page--;
            this.loadSeatings();
          }

          this.seatings = response.data.data;
          this.pagination.total = response.data.total;
          this.pagination.last_page = response.data.last_page;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    goToPage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        this.loadSeatings();
      }
    },

    async deleteSeating(id) {
      await SeatingApi.delete(id)
        .then(() => {
          this.loadSeatings();

          this.modal.delete = false;

          this.alert = {
            text: "Mesa excluída com sucesso!",
            type: "success",
            show: true,
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },

    openDeleteModal(seating) {
      this.modalSelected = {
        title: "Excluir mesa",
        confirmationQuestion: `Deseja realmente excluir a mesa <b>${seating.name}</b>?`,
        id: seating.id,
      };

      this.modal.delete = true;
    },

    seatingCreated() {
      this.loadSeatings();

      this.alert.text = "Mesa adicionada com sucesso!";
      this.alert.type = "success";
      this.alert.show = true;
    },
  },
};
</script>
