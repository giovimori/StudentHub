<script setup>
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans">
    <NavBar />
    <main class="flex-grow flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-9xl font-extrabold text-[#3b76ad] mb-4">404</h1>
      <h2 class="text-3xl font-bold text-[#151e2b] mb-4">Pagina non trovata</h2>
      <router-link to="/home" class="bg-[#151e2b] text-white font-bold py-3 px-8 rounded-full hover:bg-[#3b76ad] transition shadow-lg">
        Torna alla Dashboard
      </router-link>
    </main>
  </div>
</template>