<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import api from '../api/axios'
import type { GamificationStatus } from '../types'
import IconBookOpen from '../components/icons/IconBookOpen.vue'
import IconDocumentText from '../components/icons/IconDocumentText.vue'
import IconChartBar from '../components/icons/IconChartBar.vue'
import IconTrophy from '../components/icons/IconTrophy.vue'

const router = useRouter()

// Stato reattivo per i dati di gamification
const loading = ref(true)
const gamificationData = ref<GamificationStatus>({
  xp_totali: 0,
  livello: {
    numero: 0,
    nome: 'Caricamento...',
  },
  progress: {
    percentuale: 0,
    xp_mancanti: 0,
    prossima_soglia: 100
  }
})

const progressWidth = computed(() => {
  return `${Math.max(5, gamificationData.value.progress.percentuale)}%`
})

onMounted(async () => {
  try {
    const response = await api.get<GamificationStatus>('/gamification/status')
    gamificationData.value = response.data
  } catch (error) {
    console.error("Errore recupero livello:", error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex-grow flex flex-col bg-background-light font-sans w-full">
    
    <NavBar />

    <main class="flex-grow flex flex-col items-center justify-center p-4">

      <div class="text-center mb-16 w-full max-w-2xl">
        
        <h1 class="text-3xl md:text-4xl font-bold italic mb-4 text-secondary">
          <span v-if="loading" class="animate-pulse">Caricamento...</span>
          <span v-else>
            Lv. {{ gamificationData.livello.numero }} - {{ gamificationData.livello.nome }}
          </span>
        </h1>
        
        <div class="relative w-full md:w-3/4 h-8 bg-gray-300 border-4 border-secondary rounded-sm mx-auto flex items-center shadow-lg overflow-visible mt-8">
          
          <div 
            class="absolute top-1/2 transform -translate-y-1/2 z-10 transition-all duration-1000 ease-out"
            :style="{ left: `calc(${progressWidth} - 22px)` }"
          >
          <IconBookOpen width="70" height="70" class="drop-shadow-md" />
        </div>
          
          <div 
            class="h-full bg-primary border-r-4 border-secondary transition-all duration-1000 ease-out"
            :style="{ width: progressWidth }"
          ></div>
        </div>
        
        <p class="mt-4 text-sm font-bold text-gray-600">
          <span v-if="gamificationData.progress.prossima_soglia">
            {{ gamificationData.xp_totali }} / {{ gamificationData.progress.prossima_soglia }} XP
          </span>
          <span v-else class="text-yellow-600">
            Livello Massimo Raggiunto! ({{ gamificationData.xp_totali }} XP)
          </span>
        </p>

      </div>

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