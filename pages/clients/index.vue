<template>
  <div v-if="isLoading" class="flex justify-center">
    <span class="loading loading-dots loading-lg text-center"></span>
  </div>
  <div v-else>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <button class="btn btn-neutral btn-sm" @click="modal.create = true">
        Adicionar
      </button>
    </div>

    <table class="table table-lg mb-4">
      <thead>
        <tr>
          <th>Name</th>
          <th>Endereço</th>
          <th>Telefone</th>
        </tr>
      </thead>
      <tbody v-if="clients.length > 0">
        <tr v-for="client in clients" :key="client.id">
          <td>{{ client.name }}</td>
          <td>
            {{ getAddress(client.street, client.number, client.neighborhood) }}
          </td>
          <td>{{ getPhone(client.phone) }}</td>
          <td>
            <div class="flex justify-end gap-2">
              <button
                class="btn btn-square btn-outline btn-xs"
                @click="editClient(client)"
              >
                <Icon name="ic:twotone-edit" />
              </button>
              <button
                class="btn btn-square btn-outline btn-xs"
                @click="openDeleteModal(client)"
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
            Nenhuma cliente encontrado
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      :pagination="pagination"
      :busy="busy"
      @goToPage="goToPage($event)"
    />

    <ModalAddClient
      v-if="modal.create"
      :openModal="modal.create"
      @close="modal.create = false"
      @created="clientCreated()"
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
import ModalAddClient from "./components/ModalAddClient.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import Pagination from "@/components/Pagination.vue";
import AlertSuccess from "@/components/AlertSuccess.vue";
import ClientApi from "@/server/clients";

export default {
  components: {
    ModalAddClient,
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
      clients: [],
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
    this.loadClients();
  },

  methods: {
    async loadClients() {
      this.busy = true;
      await ClientApi.paginate(this.pagination.current_page)
        .then((response) => {
          if (
            response.data.data.length === 0 &&
            this.pagination.current_page > 1
          ) {
            this.pagination.current_page--;
            this.loadClients();
          }

          this.clients = response.data.data;
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
        this.loadClients();
      }
    },

    clientCreated() {
      this.loadClients();

      this.alert.text = "Cliente adicionado com sucesso!";
      this.alert.type = "success";
      this.alert.show = true;
    },

    openDeleteModal(client) {
      this.modalSelected = {
        title: "Excluir cliente",
        confirmationQuestion: `Deseja realmente excluir o cliente <b>${client.name}</b>?`,
        id: client.id,
      };

      this.modal.delete = true;
    },

    async deleteCategory(id) {
      await ClientApi.delete(id)
        .then(() => {
          this.loadClients();

          this.modal.delete = false;

          this.alert = {
            text: "Cliente excluído com sucesso!",
            type: "success",
            show: true,
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getPhone(phone) {
      if (!phone) return "";
      // Verifica se o número possui DDD e separa o DDD e o restante do número
      const ddd = phone.slice(0, 2);
      const numeroPrincipal = phone.slice(2);

      // Formata o número principal dependendo do comprimento
      let numeroFormatado;
      if (numeroPrincipal.length === 9) {
        // Para números com 9 dígitos (celulares), formata como (xxxxx-xxxx)
        numeroFormatado = `${numeroPrincipal.slice(
          0,
          5
        )}-${numeroPrincipal.slice(5)}`;
      } else if (numeroPrincipal.length === 8) {
        // Para números com 8 dígitos (fixos), formata como (xxxx-xxxx)
        numeroFormatado = `${numeroPrincipal.slice(
          0,
          4
        )}-${numeroPrincipal.slice(4)}`;
      } else {
        return "Número de telefone inválido";
      }

      // Retorna o número completo com prefixo, DDD e número formatado
      return `(${ddd}) ${numeroFormatado}`;
    },

    getAddress(address, number, neighborhood) {
      if (address && number && neighborhood) {
        return `${address}, ${number} - ${neighborhood}`;
      }

      if (address && number) {
        return `${address}, ${number}`;
      }

      if (address && neighborhood) {
        return `${address} - ${neighborhood}`;
      }

      return address;
    },
  },
};
</script>
