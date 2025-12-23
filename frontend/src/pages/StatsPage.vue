<script setup>
import NavBar from '../components/NavBar.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Registrazione plugin Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const loading = ref(true)

// Variabili reattive per i dati (inizializzate a 0/vuoto)
const mediaPonderata = ref(0)
const baseLaurea = ref(0)
const chartData = ref({
  labels: [],
  datasets: []
})

// Configurazione Grafico (Styling)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // Nascondiamo la legenda (c'è solo una linea)
    tooltip: {
      backgroundColor: '#151e2b',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: (context) => `Voto: ${context.raw}`
      }
    }
  },
  scales: {
    y: {
      min: 16,
      max: 32,
      ticks: { stepSize: 1 },
      grid: { color: '#e5e7eb' }
    },
    x: {
      grid: { display: false },
      ticks: { 
        display: false // Nascondi etichette asse X (Nomi esami)
      }
    }
  }
}

// Fetch Dati dal Backend
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/stats', { 
      withCredentials: true 
    })
    
    const apiData = response.data

    // 1. Assegnazione valori semplici
    mediaPonderata.value = apiData.mediaPonderata
    baseLaurea.value = apiData.baseLaurea

    // 2. Costruzione dati grafico
    // Il backend ci dà solo i dati grezzi, noi aggiungiamo lo stile (colori, bordi)
    chartData.value = {
      labels: apiData.chartData.labels, // Nomi esami
      datasets: [
        {
          label: 'Andamento Voti',
          backgroundColor: '#3b76ad',
          borderColor: '#3b76ad',
          data: apiData.chartData.data, // Voti
          tension: 0.3, // Linea curva
          pointBackgroundColor: '#fff',
          pointBorderColor: '#3b76ad',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: false
        }
      ]
    }

  } catch (error) {
    console.error("Errore caricamento statistiche:", error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans">
    
    <NavBar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">
      
      <div class="mb-8">
        <nav class="text-sm text-gray-500 mb-2 font-medium">
          <router-link to="/home" class="hover:text-[#3b76ad]">Home</router-link> 
          <span class="mx-2">></span> 
          <span class="text-[#3b76ad] font-bold">Statistiche</span>
        </nav>
        <h1 class="text-4xl font-bold text-[#3b76ad] mb-1">Statistiche</h1>
        <p class="text-xl font-bold text-black">Diamo un'occhiata ai tuoi risultati!</p>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-500 text-lg animate-pulse">
        Caricamento dati in corso...
      </div>

      <div v-else-if="!chartData.labels.length" class="text-center py-20 bg-white rounded-3xl border-2 border-gray-200 shadow-sm">
        <p class="text-2xl text-gray-400 font-bold mb-4">Non ci sono ancora dati sufficienti</p>
        <router-link to="/career/insert" class="text-[#3b76ad] font-bold hover:underline mt-2 inline-block px-6 py-2 bg-blue-50 rounded-full transition">
          Inserisci il tuo primo esame
        </router-link>
      </div>

      <div v-else>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div class="p-4 bg-blue-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#3b76ad]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-600">Media Ponderata</h3>
              <p class="text-4xl font-extrabold text-[#151e2b]">{{ mediaPonderata }}</p>
            </div>
          </div>

          <div class="bg-white border-2 border-black rounded-2xl p-6 flex items-center gap-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <div class="p-4 bg-green-50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-600">Base di Laurea</h3>
              <p class="text-4xl font-extrabold text-[#151e2b]">{{ baseLaurea }}</p>
            </div>
          </div>

        </div>

        <div class="bg-white border-2 border-black rounded-2xl p-6 shadow-md">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-[#151e2b]">Andamento Carriera</h2>
            <!-- Badge rimosso come richiesto -->
          </div>
          
          <div class="h-80 w-full relative">
            <Line v-if="chartData.labels.length > 0" :data="chartData" :options="chartOptions" />
          </div>
        </div>

      </div>

    </main>

  </div>
</template>