<template>
  <div class="drawer">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <div class="navbar bg-base-300 w-full">
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
        <div class="mx-2 flex-1 px-2 font-bold text-lg">Meal Sync</div>
        <ul class="menu menu-horizontal">
          <!-- Navbar menu content here -->
          <li>
            <router-link to="/" title="Home">
              <Icon name="material-symbols:house-outline" class="w-5 h-5" />
            </router-link>
          </li>
          <li class="ms-2">
            <router-link to="/environments" title="Ambientes">
              <Icon name="ic:outline-door-front" class="w-5 h-5" />
            </router-link>
          </li>
          <li class="ms-2">
            <router-link to="/products" title="Produtos">
              <Icon
                name="material-symbols:production-quantity-limits-outline-rounded"
                class="w-5 h-5"
              />
            </router-link>
          </li>
          <li class="me-2">
            <router-link to="/categories" title="Categorias">
              <Icon name="material-symbols:category-outline" class="w-5 h-5" />
            </router-link>
          </li>
          <label class="grid cursor-pointer place-items-center" title="Tema">
            <input
              type="checkbox"
              value="dracula"
              class="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
              @change="toggleTheme"
              :checked="currentTheme === 'dracula'"
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
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </label>
        </ul>
      </div>
      <!-- Page content here -->
      <div class="container mx-auto">
        <div class="card bg-base-100 shadow-2xl p-4 m-4">
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
      <ul class="menu bg-base-200 min-h-full w-80 p-4 gap-2">
        <!-- Sidebar content here -->
        <li>
          <router-link
            class="text-md font-bold"
            :class="{ active: $route.path === '/' }"
            to="/"
          >
            <Icon name="material-symbols:house-outline" class="w-6 h-6" />
            Home
          </router-link>
        </li>
        <li>
          <router-link
            class="text-md font-bold"
            :class="{ active: $route.path === '/products' }"
            to="/products"
          >
            <Icon
              name="material-symbols:production-quantity-limits-outline-rounded"
              class="w-6 h-6"
            />
            Produtos
          </router-link>
        </li>
        <li>
          <router-link
            class="text-md font-bold"
            :class="{ active: $route.path === '/categories' }"
            to="/categories"
          >
            <Icon name="material-symbols:category-outline" class="w-6 h-6" />
            Categorias</router-link
          >
        </li>
        <li>
          <router-link
            class="text-md font-bold"
            :class="{ active: $route.path === '/environments' }"
            to="/environments"
          >
            <Icon name="ic:outline-door-front" class="w-6 h-6" />
            Ambientes</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

// Define o tema como uma ref reativa tipada como string
const currentTheme = ref<string>("cupcake");

// Função para alternar o tema entre 'cupcake' e 'dracula'
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === "dracula" ? "cupcake" : "dracula";
  applyTheme();
};

// Função para carregar o tema do `localStorage` e aplicar no `<html>`
const loadTheme = () => {
  currentTheme.value = localStorage.getItem("theme") || "cupcake";
  applyTheme();
};

// Função para aplicar o tema no `document.documentElement` e salvar no `localStorage`
const applyTheme = () => {
  document.documentElement.setAttribute("data-theme", currentTheme.value);
  localStorage.setItem("theme", currentTheme.value);
};

// Executa a função `loadTheme` quando o componente é montado
onMounted(() => {
  loadTheme();
});
</script>
