<template>
  <v-sheet rounded min-width="200" :border="dirty ? 'info lg' : false">
    <v-container fluid>
      <v-row v-if="edit" align="center">
        <v-menu v-if="dirty">
          <template #activator="{ props: tooltipProps }">
            <v-btn
              :="tooltipProps"
              v-tooltip="'click to see all changes'"
              icon="mdi-book-edit"
              color="info"
              variant="text"
            />
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in props.value.changes"
              :key="index"
              :prepend-icon="item.icon"
              :title="item.title"
            />
          </v-list>
        </v-menu>
        <div class="ms-auto">
          <v-btn
            v-tooltip="'Add view'"
            icon="mdi-plus-circle"
            variant="text"
            @click="addView(props.value)"
          />
          <v-btn
            v-tooltip="'Remove widget'"
            icon="mdi-close-circle"
            color="red"
            variant="text"
            @click="emit('delete')"
          />
        </div>
      </v-row>
      <v-row v-for="item in value.children" :key="item.id" dense>
        <v-col>
          <WidgetView
            :value="item"
            @delete="deleteView(props.value, item)"
            @update="updateView(props.value, item)"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import type { IWidget } from "@/types/widgets";
import { useWidgetsStore } from "@/stores/widgets";

const props = defineProps<{
  value: IWidget;
}>();

const emit = defineEmits<{
  delete: [];
}>();

const { addView, deleteView, updateView } = useWidgetsStore();
const { edit } = storeToRefs(useWidgetsStore());

const dirty = computed(() => {
  return !!props.value.changes.length;
});

defineExpose({
  dirty,
  changes: props.value.changes,
});
</script>
<style scoped lang="scss">
.gap {
  gap: 1rem;
}
</style>
