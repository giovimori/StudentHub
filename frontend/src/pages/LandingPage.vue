<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <div class="flex-grow flex flex-col font-sans">
    
    <NavBar :hideUserInfo="true" />

    <main class="flex-grow flex flex-col items-center justify-center text-center px-4 relative">
      
      <h1 class="text-5xl md:text-6xl font-extrabold text-black leading-tight mb-2">
        Il tuo futuro universitario,
      </h1>
      <h1 class="text-5xl md:text-6xl font-extrabold text-[#3b76ad] leading-tight mb-8">
        costruito insieme.
      </h1>

      <p class="text-gray-600 text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
        Analizza i tuoi risultati, visualizza le tue statistiche e raggiungi i tuoi obiettivi<br class="hidden md:block"> con
        <span class="text-[#3b76ad]"> StudentHub</span>. La tua carriera universitaria in un colpo d'occhio
      </p>

      <router-link 
        to="/login" 
        class="bg-[#3b76ad] hover:bg-[#2c5a85] text-white font-bold text-xl py-4 px-12 rounded-xl shadow-lg transition-transform transform hover:scale-105 mb-20"
      >
        Accedi a StudentHub
      </router-link>

      <div class="mb-10 text-gray-400 text-xs max-w-5xl mx-auto px-4 leading-relaxed">
        Il sistema Web denominato "StudentHub" è un'opera dell'ingegno a carattere esclusivamente accademico e dimostrativo. 
        Questo progetto è stato ideato, progettato e realizzato integralmente dagli studenti 
        <span class="font-medium">Andruccioli Diego, Mici Rei e Morelli Giovanni</span> 
        dell'Alma Mater Studiorum - Università di Bologna (UniBo).
      </div>

    </main>
    </div>
</template>