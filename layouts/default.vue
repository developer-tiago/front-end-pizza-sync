<template>
  <div class="drawer">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <!-- <div class="navbar container mx-auto bg-base-100 w-full"> -->
      <div class="navbar px-4 bg-base-100 w-full">
        <div class="flex-none">
          <label
            for="my-drawer-3"
            aria-label="open sidebar"
            class="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-6 w-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div class="w-full flex items-center justify-between">
          <!-- Navbar menu content here -->
          <InputSearchClient />
          <div class="flex gap-2">
            <label class="grid cursor-pointer place-items-center">
              <input
                type="checkbox"
                value="dim"
                class="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
                @change="toggleTheme"
                :checked="currentTheme === 'dim'"
              />
              <svg
                class="stroke-base-100 fill-base-100 col-start-1 row-start-1"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <path
                  d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                />
              </svg>
              <svg
                class="stroke-base-100 fill-base-100 col-start-2 row-start-1"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                ></path>
              </svg>
            </label>
            <div class="avatar cursor-pointer">
              <div class="w-10 rounded-full">
                <img src="../public/avatar.jpeg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Page content here -->
      <!-- <div class="container mx-auto"> -->
      <div class="px-4">
        <div class="card bg-base-100 shadow-xl p-4">
          <NuxtPage />
        </div>
      </div>
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer-3"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul class="menu bg-base-200 min-h-full w-20 p-3 gap-2">
        <!-- Sidebar content here -->
         <li @click="redirectPage('/')">
          <img class="py-0.5 px-2" src="../public/pizza.png" alt="">
         </li>
        <li>
          <div
            class="tooltip tooltip-right"
            :class="{ active: $route.path === '/' }"
            data-tip="Home"
            @click="redirectPage('/')"
          >
            <Icon name="ic:outline-home" class="w-6 h-6" />
          </div>
        </li>
        <li>
          <div
            class="tooltip tooltip-right"
            :class="{ active: $route.path === '/clients' }"
            data-tip="Clientes"
            @click="redirectPage('/clients')"
          >
            <Icon name="ic:outline-person" class="w-6 h-6" />
          </div>
        </li>

        <li>
          <div
            class="tooltip tooltip-right"
            :class="{ active: $route.path === '/products' }"
            data-tip="Produtos"
            @click="redirectPage('/products')"
          >
            <Icon name="ic:outline-shopping-cart" class="w-6 h-6" />
          </div>
        </li>

        <li>
          <div
            class="tooltip tooltip-right"
            :class="{ active: $route.path === '/categories' }"
            data-tip="Categorias"
            @click="redirectPage('/categories')"
          >
            <Icon name="ic:outline-category" class="w-6 h-6" />
          </div>
        </li>

        <li>
          <div
            class="tooltip tooltip-right"
            :class="{ active: $route.path === '/environments' }"
            data-tip="Ambientes"
            @click="redirectPage('/environments')"
          >
            <Icon name="ic:outline-door-front" class="w-6 h-6" />
          </div>
        </li>

        <li>
          <div
            class="tooltip tooltip-right"
            :class="{ active: $route.path === '/tables' }"
            data-tip="Mesas"
            @click="redirectPage('/tables')"
          >
            <Icon name="ic:outline-table-bar" class="w-6 h-6" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputSearchClient from "@/components/InputSearchClient.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Define o tema como uma ref reativa tipada como string
const currentTheme = ref<string>("pastel");

// Função para alternar o tema entre 'pastel' e 'dim'
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === "dim" ? "pastel" : "dim";
  applyTheme();
};

// Função para carregar o tema do `localStorage` e aplicar no `<html>`
const loadTheme = () => {
  currentTheme.value = localStorage.getItem("theme") || "pastel";
  applyTheme();
};

// Função para aplicar o tema no `document.documentElement` e salvar no `localStorage`
const applyTheme = () => {
  document.documentElement.setAttribute("data-theme", currentTheme.value);
  localStorage.setItem("theme", currentTheme.value);
};

const redirectPage = (path: string) => {
  router.push(path);
};

// Executa a função `loadTheme` quando o componente é montado
onMounted(() => {
  loadTheme();
});
</script>
