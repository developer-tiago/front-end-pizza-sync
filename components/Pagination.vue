<template>
  <div class="join w-full d-flex justify-center">
    <button
      class="join-item btn btn-sm"
      :disabled="pagination.current_page === 1"
      @click="$emit('goToPage', 1)"
    >
      «
    </button>

    <button
      class="join-item btn btn-sm"
      :disabled="pagination.current_page === 1"
      @click="$emit('goToPage', pagination.current_page - 1)"
    >
      ‹
    </button>

    <button
      class="join-item btn btn-sm"
      :disabled="busy"
      v-for="page in pages"
      :key="page"
      @click="$emit('goToPage', page)"
      :class="{ 'btn-active': pagination.current_page === page }"
    >
      {{ page }}
    </button>

    <button
      class="join-item btn btn-sm"
      :disabled="pagination.current_page === pagination.last_page"
      @click="$emit('goToPage', pagination.current_page + 1)"
    >
      ›
    </button>

    <button
      class="join-item btn btn-sm"
      :disabled="pagination.current_page === pagination.last_page"
      @click="$emit('goToPage', pagination.last_page)"
    >
      »
    </button>
  </div>
</template>

<script>
export default {
  props: {
    pagination: Object,
    busy: Boolean,
  },

  computed: {
    pages() {
      let startPage = Math.max(
        1,
        this.pagination.current_page - Math.floor(3 / 2)
      );
      let endPage = Math.min(startPage + 3 - 1, this.pagination.last_page);

      if (endPage - startPage < 3 - 1) {
        startPage = Math.max(1, endPage - 3 + 1);
      }

      return Array.from(
        { length: endPage - startPage + 1 },
        (v, k) => startPage + k
      );
    },
  },
};
</script>
