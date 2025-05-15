<template>
  <a-card
    :title="`Widget: ${props.value.name}`"
    min-width="200"
    :border="dirty ? 'info lg' : false"
  >
    <template #actions>
      <div v-if="edit" class="ms-auto">
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
            <template v-for="item in props.value.changes" :key="item.id">
              <v-list-group v-if="item.id !== props.value.id" :value="item.id">
                <template #activator="{ props: changesListProps }">
                  <v-list-item
                    :="changesListProps"
                    :title="`View: ${item.name}`"
                  />
                </template>

                <v-list-item
                  v-for="(change, index) in item.changes"
                  :key="index"
                  :prepend-icon="change.icon"
                  :title="change.title"
                />
              </v-list-group>
              <template v-else>
                <v-list-item
                  v-for="(change, index) in item.changes"
                  :key="index"
                  :prepend-icon="change.icon"
                  :title="change.title"
                />
              </template>
            </template>
          </v-list>
        </v-menu>
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
    </template>
    <v-row v-for="item in value.children" :key="item.id" dense>
      <v-col>
        <WidgetView
          :value="item"
          @delete="deleteView(props.value, item)"
          @update="updateView(props.value, $event)"
        />
      </v-col>
    </v-row>
  </a-card>
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
