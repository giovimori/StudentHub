<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NavBar from '../components/NavBar.vue'
import IconBack from '../components/icons/IconBack.vue'


const router = useRouter()
const authStore = useAuthStore()

const nome = ref('')
const cognome = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  
  const userData = {
    nome: nome.value,
    cognome: cognome.value,
    email: email.value,
    password: password.value
  }

  const success = await authStore.register(userData)
  
  if (success) {
    router.push('/home')
  } else {
    errorMessage.value = authStore.error || ''
  }
}
</script>

<template>
  <div class="flex-grow flex flex-col bg-[#f8f9fa] font-sans">
    
    <NavBar />

    <main class="flex-grow flex flex-col items-center justify-center px-4 py-10">
      
      <div class="mb-6 w-full max-w-md">
        <div @click="router.back()" class="inline-flex items-center gap-2 text-gray-600 hover:text-[#3b76ad] transition font-bold text-lg cursor-pointer">
          <IconBack class="h-6 w-6" />
          Indietro
        </div>
      </div>
      
      <div class="bg-[#151e2b] text-white w-full max-w-md p-8 rounded-3xl shadow-2xl">
        
        <h2 class="text-3xl font-bold text-center mb-8">Registrati a StudentHub</h2>
        
        <div v-if="errorMessage" class="bg-red-500 text-white p-3 rounded mb-4 text-center text-sm font-bold">
          {{ errorMessage }}
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-5">
          
          <div>
            <label class="block text-sm font-medium mb-1 pl-1">Inserisci il tuo nome</label>
            <input v-model="nome" type="text" placeholder="Mario" required
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 pl-1">Inserisci il tuo cognome</label>
            <input v-model="cognome" type="text" placeholder="Rossi" required
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 pl-1">Inserisci la tua mail</label>
            <input v-model="email" type="email" placeholder="example@domain.com" required
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1 pl-1">Crea la tua password</label>
            <input v-model="password" type="password" placeholder="your password" required
              class="w-full px-4 py-3 rounded-lg bg-gray-200 text-gray-900 border border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 transition placeholder-gray-500" />
          </div>

          <div class="pt-2">
            <button type="submit" :disabled="authStore.loading"
              class="w-full bg-[#3b76ad] hover:bg-[#2c5a85] disabled:opacity-50 text-white font-bold py-3 rounded-full shadow-lg transition transform hover:scale-105">
              {{ authStore.loading ? 'Registrazione...' : 'Registrati a StudentHub' }}
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