<template>
  <v-app>
    <v-main class="bg-grey-lighten-5">
      <v-container>
        <v-row>
          <v-col cols="12">
            <RouterView />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

