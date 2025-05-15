<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <Dashboard title="Solution using chaining props/emits" />
      </v-col>

      <v-col cols="12" md="6">
        <!-- <Dashboard title="Solution using provide/inject" /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useWidgetsStore } from "@/stores/widgets";
const { reset } = useWidgetsStore();
reset();
</script>
