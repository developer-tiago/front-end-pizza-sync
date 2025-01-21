<script lang="ts" setup>
import EnvironmentApi from "@/server/environments";
import { defineEmits, defineProps, ref } from "vue";

// Interfaces
interface Form {
  name: string;
}

interface Validation {
  name: boolean;
}

interface Props {
  openModal: boolean;
}

// Recebendo as props
const openModal = defineProps<Props>();

// Variáveis
const validation = ref<Validation>({
  name: false,
});

const form = ref<Form>({
  name: "",
});

let busy: Ref<boolean> = ref(false);

// DefineEmits
const emit = defineEmits<{
  (event: "created"): void;
  (event: "close"): void;
}>();

// Função para emitir o evento created

// Funções
function checkForm(): boolean {
  let checkFields = false;

  if (!form.value.name) {
    validation.value.name = true;
    checkFields = true;
  }

  return checkFields;
}

async function createEnvironment(): Promise<void> {
  try {
    busy.value = true;

    if (checkForm()) {
      busy.value = false;
      return;
    }

    await EnvironmentApi.store(form.value);

    emit("created");
    emit("close");
  } catch (error: any) {
    console.log(error);
  } finally {
    busy.value = false;
  }
}

function handleOverlayClick(event: MouseEvent): void {
  if (event.target instanceof HTMLElement && event.target.classList.contains("modal-overlay")) {
    emit("close");
  }
}
</script>

<template>
  <div
    v-if="openModal"
    class="modal-overlay modal modal-open"
    @click="handleOverlayClick"
  >
    <div class="modal-box relative">
      <!-- TITLE -->
      <h2 class="font-bold text-lg mb-4">Adicionar Ambiente</h2>

      <!-- BODY -->
      <div class="flex flex-col gap-4 mb-4">
        <label for="name" class="flex flex-col gap-2"
          >Nome
          <input
            v-model="form.name"
            type="text"
            class="input input-bordered input-md w-full"
            :class="{ 'input-error': validation.name }"
            @input="validation.name = false"
          />
          <small v-if="validation.name" class="text-error"
            >O campo 'Nome' é obrigatório.</small
          >
        </label>
      </div>

      <!-- FOOTER -->
      <div class="flex justify-end gap-4">
        <button class="btn btn-outline btn-error" @click="$emit('close')">
          Cancelar
        </button>
        <button
          class="btn btn-outline btn-success"
          :disabled="busy"
          @click="createEnvironment()"
        >
          Adicionar
        </button>
      </div>
    </div>
  </div>
</template>
