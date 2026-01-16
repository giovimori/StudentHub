<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'
import IconDocumentText from '../components/icons/IconDocumentText.vue'
import IconChartBar from '../components/icons/IconChartBar.vue'
import IconTrophy from '../components/icons/IconTrophy.vue'
import XpBar from '../components/XpBar.vue'

const router = useRouter()
</script>

<template>
  <div class="flex-grow flex flex-col bg-background-light font-sans w-full">
    
    <NavBar />

    <main class="flex-grow flex flex-col items-center justify-center p-4">

      <XpBar class="mb-16" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
        
        <div @click="router.push('/career')" class="flex flex-col items-center group cursor-pointer">
          <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-secondary bg-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-dark">
            <IconDocumentText class="w-16 h-16 text-white" />
          </div>
          <h2 class="mt-4 text-2xl font-bold text-secondary group-hover:text-primary transition">Carriera</h2>
        </div>

        <div @click="router.push('/stats')" class="flex flex-col items-center group cursor-pointer">
          <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-secondary bg-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-dark">
            <IconChartBar class="w-16 h-16 text-white" />
          </div>
          <h2 class="mt-4 text-2xl font-bold text-secondary group-hover:text-primary transition">Statistiche</h2>
        </div>

        <div @click="router.push('/objectives')" class="flex flex-col items-center group cursor-pointer">
          <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-secondary bg-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary-dark">
            <IconTrophy class="w-20 h-16 text-white" />
          </div>
          <h2 class="mt-4 text-2xl font-bold text-secondary group-hover:text-primary transition">Obiettivi</h2>
        </div>

      </div>

    </main>

  </div>
</template>