<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Variabili reattive per il form
const nome = ref('')
const cognome = ref('')
const email = ref('')
const password = ref('')

// Funzione di Registrazione (simulata)
const handleRegister = async () => {
  // 1. Logica simulata: creiamo un utente con i dati inseriti
  console.log("Registrazione con:", nome.value, cognome.value, email.value)
  
  const newUser = { 
    nome: nome.value, 
    cognome: cognome.value, 
    email: email.value,
    matricola: '000' + Math.floor(Math.random() * 100000) // Matricola random
  }
  
  const fakeToken = 'new-user-fake-token-' + Date.now()
  
  // 2. Salviamo i dati nello store (come se avessimo fatto login)
  authStore.login(fakeToken, newUser)
  
  // 3. Reindirizziamo alla Home
  router.push('/home')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f8f9fa] font-sans">
    
    <header class="bg-[#151e2b] text-white py-4 px-8 shadow-md flex items-center">
      <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
        </svg>
        <span class="text-2xl font-bold tracking-wide">StudentHub</span>
      </div>
    </header>

    <main class="flex-grow flex items-center justify-center px-4 py-10">
      
      <div class="bg-[#151e2b] text-white w-full max-w-md p-8 rounded-3xl shadow-2xl">
        
        <h2 class="text-3xl font-bold text-center mb-8">Registrati a StudentHub</h2>
        
        <form @submit.prevent="handleRegister" class="space-y-5">
          
          <div>
            <label class="block text-sm font-medium mb-1 pl-1">Inserisci il tuo nome</label>
            <input 
              v-model="nome"
              type="text" 
              placeholder="Mario"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 pl-1">Inserisci il tuo cognome</label>
            <input 
              v-model="cognome"
              type="text" 
              placeholder="Rossi"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 pl-1">Inserisci la tua mail</label>
            <input 
              v-model="email"
              type="email" 
              placeholder="example@domain.com"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 pl-1">Crea la tua password</label>
            <input 
              v-model="password"
              type="password" 
              placeholder="your password"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500"
              required
            />
          </div>

          <div class="pt-2">
            <button 
              type="submit"
              class="w-full bg-[#3b76ad] hover:bg-[#2c5a85] text-white font-bold py-3 rounded-full shadow-lg transition transform hover:scale-105"
            >
              Registrati a StudentHub
            </button>
          </div>
        </form>

        <div class="mt-6 text-center text-sm text-gray-300">
          Hai già un account? 
          <router-link to="/login" class="underline text-white hover:text-[#3b76ad] transition font-medium">
            Accedi
          </router-link>
        </div>

      </div>

          </main>
      </div>
    </template>