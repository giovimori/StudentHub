<script setup>
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] text-gray-900 font-sans">
    
    <div class="flex-grow w-full flex flex-col">
      <router-view />
    </div>

    <AppFooter />
    
  </div>
</template>