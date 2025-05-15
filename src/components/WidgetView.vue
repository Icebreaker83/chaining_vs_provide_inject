<template>
  <div class="d-flex align-center pa-2">
    <span>View: {{ data.name }}</span>
    <template v-if="edit">
      <v-btn
        v-tooltip="'Rename view'"
        icon="mdi-pencil"
        size="small"
        variant="text"
        @click="onRename"
      />
      <v-btn
        v-tooltip="'Remove view'"
        icon="mdi-close"
        size="small"
        variant="text"
        @click="emit('delete')"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { IWidgetView } from "@/types/widgets";
import { useWidgetsStore } from "@/stores/widgets";
import { uid } from "uid";

const props = defineProps<{
  value: IWidgetView;
}>();

const data = reactive<IWidgetView>({ id: "", name: "" });
watch(
  () => props.value,
  (newVal) => {
    Object.assign(data, newVal);
  },
  { immediate: true }
);

const emit = defineEmits<{
  delete: [];
  update: [data: IWidgetView];
}>();

const { edit } = storeToRefs(useWidgetsStore());

const onRename = () => {
  data.name = uid();
  emit("update", data);
};
</script>
