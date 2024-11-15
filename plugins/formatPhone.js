export default defineNuxtPlugin((nuxtApp) => {
  function formatPhone(phone_prefix, phone) {
    if (!phone_prefix || !phone) return "";
    const formattedPrefix = `+${phone_prefix}`;
    const formattedPhone = phone
      .replace(/\D/g, "") // Remove caracteres não numéricos
      .replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3"); // Aplica a máscara de telefone

    return `${formattedPrefix} ${formattedPhone}`;
  }

  nuxtApp.provide("formatPhone", formatPhone);
});
