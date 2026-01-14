<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import IconBack from '../components/icons/IconBack.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex-grow flex flex-col font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-12 max-w-5xl">
      
      <div class="mb-8">
        <div @click="router.back()" class="inline-flex items-center gap-2 text-gray-600 hover:text-[#3b76ad] transition font-bold text-lg cursor-pointer">
          <IconBack class="h-6 w-6" />
          Indietro
        </div>
      </div>
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-[#3b76ad] mb-4">Contatti del Team</h1>
        <p class="text-xl text-gray-600">
          Hai bisogno di contattare uno degli sviluppatori? <br>
          Ecco i nostri riferimenti ufficiali.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div class="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center group">
          <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-sm group-hover:border-[#3b76ad] transition">
            <span class="text-2xl font-bold text-gray-400">DA</span>
          </div>
          <h3 class="text-xl font-bold text-[#151e2b]">Diego Andruccioli</h3>
          <p class="text-sm text-[#3b76ad] font-bold mb-4">Backend Developer</p>
          <div class="space-y-3 text-sm">
             <a href="mailto:diego.andruccioli@studio.unibo.it" class="block bg-gray-50 py-2 px-4 rounded-lg text-gray-700 hover:bg-[#3b76ad] hover:text-white transition truncate">diego.andruccioli@studio.unibo.it</a>
          </div>
        </div>
        <div class="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center group">
          <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-sm group-hover:border-[#3b76ad] transition">
            <span class="text-2xl font-bold text-gray-400">RM</span>
          </div>
          <h3 class="text-xl font-bold text-[#151e2b]">Rei Mici</h3>
          <p class="text-sm text-[#3b76ad] font-bold mb-4">Frontend & Design</p>
          <div class="space-y-3 text-sm">
             <a href="mailto:rei.mici@studio.unibo.it" class="block bg-gray-50 py-2 px-4 rounded-lg text-gray-700 hover:bg-[#3b76ad] hover:text-white transition truncate">rei.mici2@studio.unibo.it</a>
          </div>
        </div>
         <div class="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center group">
          <div class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-sm group-hover:border-[#3b76ad] transition">
            <span class="text-2xl font-bold text-gray-400">GM</span>
          </div>
          <h3 class="text-xl font-bold text-[#151e2b]">Giovanni Morelli</h3>
          <p class="text-sm text-[#3b76ad] font-bold mb-4">Full Stack & Security</p>
          <div class="space-y-3 text-sm">
             <a href="mailto:giovanni.morelli@studio.unibo.it" class="block bg-gray-50 py-2 px-4 rounded-lg text-gray-700 hover:bg-[#3b76ad] hover:text-white transition truncate">giovanni.morelli8@studio.unibo.it</a>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>