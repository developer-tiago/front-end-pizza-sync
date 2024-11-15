<template>
  <div ref="inputSearch" class="ms-2 relative max-w-72 w-full">
    <input
      class="input input-bordered input-sm w-full"
      v-model="search"
      type="text"
      placeholder="Buscar cliente..."
      @keydown.enter="searchClient"
    />
    <ul
      v-if="clients.length > 0"
      class="bg-base-100 w-full p-2 rounded-lg shadow-md absolute top-full mt-1 z-10 max-h-[300px] overflow-y-auto custom-scroll"
    >
      <!-- Iteração de clientes -->
      <li
        v-for="client in clients"
        :key="client.id"
        class="p-2 hover:bg-base-200 cursor-pointer"
        @click="redirectClient(client.id)"
      >
        <p class="text-sm">{{ client.name }}</p>
        <p class="text-xs text-gray-500">
          {{ getAddress(client.street, client.number, client.neighborhood) }}
        </p>
        <p class="text-xs text-gray-500">{{ $formatPhone(client.phone_prefix, client.phone) }}</p>
      </li>
    </ul>
    <ul
      v-if="loadingSearch || clientNotFound"
      class="bg-base-100 w-full p-2 rounded-lg shadow-md absolute top-full mt-1 z-10 max-h-[300px] overflow-y-auto custom-scroll"
    >
      <!-- Mensagem de carregamento -->
      <li v-if="loadingSearch" class="text-center text-sm">
        Aguarde, realizando busca...
      </li>

      <!-- Mensagem para lista vazia -->
      <li v-if="clientNotFound" class="text-center text-sm">
        Nenhum cliente encontrado
      </li>
    </ul>
  </div>
</template>

<script>
import ClientApi from "@/server/clients";

export default {
  data() {
    return {
      search: "",
      clients: [],
      clientNotFound: false,
      loadingSearch: false,
    };
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    async searchClient() {
      this.clients = [];
      this.clientNotFound = false;
      this.loadingSearch = true;
      await ClientApi.seachClient(this.search)
        .then((response) => {
          if (response.data.length === 0) {
            this.clientNotFound = true;
          } else {
            this.clients = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loadingSearch = false;
        });
    },

    redirectClient(id) {
      this.$router.push(`/clients/${id}`);

      this.search = "";
      this.clients = [];
      this.clientNotFound = false;
      this.loadingSearch = false;
    },

    handleClickOutside(event) {
      const inputSearch = this.$refs.inputSearch;
      if (inputSearch && !inputSearch.contains(event.target)) {
        this.clients = [];
        this.clientNotFound = false;
        this.loadingSearch = false;
      }
    },

    getAddress(street, number, neighborhood) {
      if (street && number && neighborhood) {
        return `${street}, ${number} - ${neighborhood}`;
      }

      if (street && number) {
        return `${street}, ${number}`;
      }

      if (street) {
        return street;
      }

      return "";
    },
  },
};
</script>

<style scoped>
/* Estilos para a barra de rolagem */
.custom-scroll::-webkit-scrollbar {
  width: 8px; /* Largura da barra de rolagem */
}

.custom-scroll::-webkit-scrollbar-track {
  background: var(--tw-bg-opacity); /* Cor de fundo da barra */
  border-radius: 4px; /* Borda arredondada do trilho */
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(
    var(--tw-bg-opacity),
    var(--tw-text-opacity),
    0.3
  ); /* Cor da barra de rolagem */
  border-radius: 4px; /* Arredondamento */
  border: 2px solid #f1f1f1; /* Margem em volta para melhor visual */
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(
    var(--tw-bg-opacity),
    var(--tw-text-opacity),
    0.5
  ); /* Cor da barra ao passar o mouse */
}

@media (prefers-color-scheme: dark) {
  .custom-scroll::-webkit-scrollbar-track {
    background: var(--tw-bg-opacity) #1f2937; /* Cor do trilho no tema escuro */
  }

  .custom-scroll::-webkit-scrollbar-thumb {
    background-color: rgba(var(--tw-text-opacity), var(--tw-bg-opacity), 0.5);
  }

  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: rgba(var(--tw-text-opacity), var(--tw-bg-opacity), 0.7);
  }
}

/* Para navegadores baseados em Firefox */
.custom-scroll {
  scrollbar-width: thin; /* Define a barra como fina */
  scrollbar-color: rgba(var(--tw-text-opacity), var(--tw-bg-opacity), 0.3)
    rgba(var(--tw-bg-opacity), 0.1); /* Cor da barra e do trilho */
}
</style>
