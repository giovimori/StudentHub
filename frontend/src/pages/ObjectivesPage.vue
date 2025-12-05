<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const activeTab = ref('leaderboard') 
const loading = ref(true)
const leaderboard = ref([])
const objectives = ref([])
const myRank = ref(0)
const errorMsg = ref('')

// Avatar placeholder basato sul nome
const getAvatar = (nome) => `https://api.dicebear.com/7.x/initials/svg?seed=${nome}`

const fetchData = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    // 1. CLASSIFICA: La rotta corretta è in /api/users/leaderboard
    const lbRes = await axios.get('http://localhost:3000/api/users/leaderboard', { 
      withCredentials: true 
    })
    leaderboard.value = lbRes.data.leaderboard // Il backend restituisce { leaderboard: [], myRank: ... }
    myRank.value = lbRes.data.myRank

    // 2. OBIETTIVI: Dobbiamo prendere TUTTI i badge e capire quali ho sbloccato
    // Rotte corrette: /api/gamification/badges e /api/gamification/my-badges
    const [allBadgesRes, myBadgesRes] = await Promise.all([
      axios.get('http://localhost:3000/api/gamification/badges', { withCredentials: true }),
      axios.get('http://localhost:3000/api/gamification/my-badges', { withCredentials: true })
    ])

    // Creiamo un Set con gli ID dei badge sbloccati per una ricerca rapida
    const unlockedIds = new Set(myBadgesRes.data.map(b => b.id_obiettivo))

    // Mappiamo tutti gli obiettivi aggiungendo la proprietà 'sbloccato'
    objectives.value = allBadgesRes.data.map(badge => ({
      ...badge,
      sbloccato: unlockedIds.has(badge.id)
    }))

  } catch (error) {
    console.error("Errore caricamento dati:", error)
    errorMsg.value = "Impossibile caricare i dati. Assicurati che il server sia attivo."
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans min-h-screen">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-5xl">

      <div class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-[#151e2b] mb-2">Sala dei Trofei</h1>
        <p class="text-gray-600">Le tue conquiste e la classifica dell'ateneo</p>
      </div>

      <div class="flex justify-center mb-10">
        <div class="bg-white p-1 rounded-full border border-gray-200 shadow-sm inline-flex">
          <button 
            @click="activeTab = 'leaderboard'"
            class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-200"
            :class="activeTab === 'leaderboard' ? 'bg-[#3b76ad] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'"
          >
            Classifica
          </button>
          <button 
            @click="activeTab = 'objectives'"
            class="px-6 py-2 rounded-full text-sm font-bold transition-all duration-200"
            :class="activeTab === 'objectives' ? 'bg-[#3b76ad] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'"
          >
            I Miei Obiettivi
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-[#3b76ad]"></div>
        <p class="mt-2 text-sm text-gray-500">Caricamento dati...</p>
      </div>

      <div v-else-if="errorMsg" class="text-center py-12 text-red-600 font-bold">
        {{ errorMsg }}
      </div>

      <div v-else>

        <div v-if="activeTab === 'leaderboard'" class="animate-fade-in">
          
          <div v-if="leaderboard.length >= 3" class="flex flex-col md:flex-row justify-center items-end gap-4 mb-10 px-4 h-56">
            
            <div class="order-2 md:order-1 w-full md:w-1/4 flex flex-col items-center">
              <div class="relative w-16 h-16 mb-[-1rem] z-10 rounded-full border-4 border-white shadow-md overflow-hidden">
                 <img :src="getAvatar(leaderboard[1].nome)" class="w-full h-full object-cover bg-gray-200" />
              </div>
              <div class="w-full bg-gray-100 rounded-t-xl pt-6 pb-3 px-2 text-center shadow-sm h-32 flex flex-col justify-end border-t-4 border-gray-400">
                <div class="font-bold text-[#151e2b] truncate">{{ leaderboard[1].nome }}</div>
                <div class="text-sm font-bold text-gray-500">{{ leaderboard[1].xp_totali }} XP</div>
                <div class="text-xs text-gray-400 font-bold mt-1">#2</div>
              </div>
            </div>

            <div class="order-1 md:order-2 w-full md:w-1/4 flex flex-col items-center z-10">
              <div class="relative w-20 h-20 mb-[-1.5rem] z-10 rounded-full border-4 border-white shadow-lg overflow-hidden">
                 <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xl">👑</div>
                 <img :src="getAvatar(leaderboard[0].nome)" class="w-full h-full object-cover bg-yellow-100" />
              </div>
              <div class="w-full bg-yellow-50 rounded-t-xl pt-8 pb-4 px-2 text-center shadow-md h-40 flex flex-col justify-end border-t-4 border-yellow-400 relative">
                <div class="font-bold text-[#151e2b] text-lg truncate">{{ leaderboard[0].nome }}</div>
                <div class="text-sm font-bold text-[#3b76ad]">{{ leaderboard[0].xp_totali }} XP</div>
                <div class="text-sm text-yellow-600 font-bold mt-1">#1</div>
              </div>
            </div>

            <div class="order-3 md:order-3 w-full md:w-1/4 flex flex-col items-center">
              <div class="relative w-16 h-16 mb-[-1rem] z-10 rounded-full border-4 border-white shadow-md overflow-hidden">
                 <img :src="getAvatar(leaderboard[2].nome)" class="w-full h-full object-cover bg-gray-200" />
              </div>
              <div class="w-full bg-orange-50 rounded-t-xl pt-6 pb-3 px-2 text-center shadow-sm h-24 flex flex-col justify-end border-t-4 border-orange-400">
                <div class="font-bold text-[#151e2b] truncate">{{ leaderboard[2].nome }}</div>
                <div class="text-sm font-bold text-gray-500">{{ leaderboard[2].xp_totali }} XP</div>
                <div class="text-xs text-orange-400 font-bold mt-1">#3</div>
              </div>
            </div>

          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div v-for="(user, index) in leaderboard.slice(3)" :key="user.id" 
                 class="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                 :class="{'bg-blue-50': user.id === authStore.user?.id}" 
            >
              <div class="flex items-center gap-4">
                <div class="font-bold text-gray-400 w-8 text-center">#{{ index + 4 }}</div>
                <div class="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                  <img :src="getAvatar(user.nome)" class="w-full h-full object-cover" />
                </div>
                <div class="font-medium text-[#151e2b]">
                  {{ user.nome }} {{ user.cognome }} 
                  <span v-if="user.id === authStore.user?.id" class="ml-2 text-xs font-bold text-[#3b76ad]">(Tu)</span>
                </div>
              </div>
              <div class="font-bold text-[#151e2b]">
                {{ user.xp_totali }} XP
              </div>
            </div>
          </div>

          <div v-if="leaderboard.length > 0 && leaderboard.length < 3" class="text-center py-8 text-gray-500">
             Ci sono ancora pochi studenti iscritti per mostrare il podio completo!
          </div>

        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          
          <div v-for="obj in objectives" :key="obj.id" 
               class="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
               :class="{'opacity-70': !obj.sbloccato}"
          >
            <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-colors"
                 :class="obj.sbloccato ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'"
            >
              {{ obj.sbloccato ? '🏆' : '🔒' }}
            </div>

            <div class="flex-grow">
              <div class="flex justify-between items-start">
                <h3 class="font-bold text-[#151e2b]">{{ obj.nome }}</h3>
                <span v-if="obj.sbloccato" class="text-[10px] font-bold uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Fatto</span>
              </div>
              
              <p class="text-sm text-gray-500 leading-snug mb-1">{{ obj.descrizione }}</p>
              
              <div class="text-xs font-bold" :class="obj.sbloccato ? 'text-[#3b76ad]' : 'text-gray-400'">
                + {{ obj.xp_valore }} XP
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>

  </div>
</template>