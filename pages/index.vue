<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Card 1 -->
    <div class="bg-base-100 p-4 rounded-lg shadow-md">
      <h2 class="text-lg font-semibold mb-2">Vendas Totais</h2>
      <p class="text-2xl font-bold">$45,000</p>
    </div>

    <!-- Card 2 -->
    <div class="bg-base-100 p-4 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-2">Novos Usuários</h2>
      <p class="text-2xl font-bold">320</p>
    </div>

    <!-- Card 3 -->
    <div class="bg-base-100 p-4 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-2">Taxa de Conversão</h2>
      <p class="text-2xl font-bold">12.5%</p>
    </div>

    <!-- Card 4 -->
    <div class="bg-base-100 p-4 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-2">Visitas ao Site</h2>
      <p class="text-2xl font-bold">12,340</p>
    </div>
  </div>
</template>

<!-- <script>
export default {
  data () {},

  mounted() {
    console.log('home')
    localStorage.setItem('account_id', '479ee3b6-717d-497e-abd2-e149c3dff3f0')
  }
}
</script> -->
<script setup lang="ts">
useSeoMeta({
  ogImage: '/og-image.png'
})
</script>