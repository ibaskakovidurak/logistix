<template>
  <v-card class="pa-6">
    <h1 class="text-h4 mb-6 text-center">К сожалению, такой страницы не существует...</h1>
    <div class="text-center">
      <v-btn
          variant="outlined"
          @click="$router.push({ name: 'home' })"
      >
        Главная страница
      </v-btn>
    </div>
  </v-card>
</template>
<script setup lang="ts">
</script>