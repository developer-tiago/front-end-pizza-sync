export default defineNuxtPlugin((nuxtApp) => {
  const formatCurrency = (value) => {
    if (typeof value !== "number") {
      value = parseFloat(value);
    }

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  nuxtApp.provide("formatCurrency", formatCurrency);
});
