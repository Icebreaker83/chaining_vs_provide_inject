<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <Dashboard title="Dashboard" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useWidgetsStore } from "@/stores/widgets";
const { reset } = useWidgetsStore();
reset();
</script>
