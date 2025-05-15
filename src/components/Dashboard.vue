<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex flex-wrap align-center">
        <span class="text-h5 me-auto">{{ props.title }}</span>
        <div v-if="edit" class="d-flex gap">
          <v-menu>
            <template #activator="{ props: menuProps }">
              <v-btn
                v-if="dirty"
                :="menuProps"
                color="info"
                text="[All changes]"
                variant="text"
              />
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in allChanges"
                :key="index"
                :prepend-icon="item.icon"
                :title="item.title"
              />
            </v-list>
          </v-menu>
          <v-btn
            color="info"
            :prepend-icon="smAndDown ? undefined : 'mdi-check'"
            :icon="smAndDown ? 'mdi-check' : undefined"
            :text="smAndDown ? undefined : 'Save'"
            :size="smAndDown ? 'small' : 'default'"
            :disabled="!dirty"
            @click="onSave"
          />
          <v-btn
            color="grey"
            :prepend-icon="smAndDown ? undefined : 'mdi-close'"
            :icon="smAndDown ? 'mdi-close' : undefined"
            :text="smAndDown ? undefined : 'Cancel'"
            :size="smAndDown ? 'small' : 'default'"
            @click="setEdit(false)"
          />
        </div>

        <v-btn
          v-else
          color="info"
          prepend-icon="mdi-pencil"
          text="Edit"
          @click="setEdit(true)"
        />
      </v-col>
    </v-row>

    <v-row align="start">
      <v-col v-for="widget in widgets" :key="widget.id">
        <widget
          ref="widgetsRefs"
          :value="widget"
          @delete="deleteWidget(widget)"
        />
      </v-col>
      <v-col v-if="edit">
        <v-btn
          v-tooltip="'Add widget'"
          icon="mdi-plus"
          color="success"
          @click="onAddWidget"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/stores/widgets";
import Widget from "@/components/Widget.vue";
import type { WidgetChanges } from "@/types/widgets";
import { useDisplay } from "vuetify";

const props = defineProps<{
  title: string;
}>();

const { data, widgets, edit, deletedWidgets } = storeToRefs(useWidgetsStore());
const { onSave, addWidget, setEdit, deleteWidget } = useWidgetsStore();
const { smAndDown } = useDisplay();
watch(
  data,
  (newVal) => {
    widgets.value = JSON.parse(JSON.stringify(newVal));
  },
  { immediate: true }
);

const widgetsRefs = ref<InstanceType<typeof Widget>[]>([]);

const onAddWidget = () => {
  addWidget();
};

const allChanges = computed(() => {
  const widgetChanges =
    widgetsRefs.value.reduce((acc, item) => {
      if (!item.dirty) return acc;
      acc.push(...item.changes);
      return acc;
    }, <WidgetChanges[]>[]) ?? [];
  return [...deletedWidgets.value, ...widgetChanges];
});

const dirty = computed(() => {
  return !!allChanges.value.length;
});
</script>
<style scoped lang="scss">
.gap {
  gap: 1rem;
}
</style>
