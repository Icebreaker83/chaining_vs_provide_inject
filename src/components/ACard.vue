<template>
  <v-sheet rounded>
    <v-container fluid>
      <v-row>
        <v-col cols="12" class="text-h6 d-flex flex-wrap">
          <slot name="title">
            <div v-if="props.title" class="d-flex align-center text-h6">
              {{ props.title }}
            </div>
          </slot>
          <slot name="actions"> </slot>
        </v-col>
      </v-row>

      <slot></slot>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string;
}>();
</script>
