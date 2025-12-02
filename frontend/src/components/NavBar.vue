<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Funzione logout
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-[#151e2b] text-white py-4 px-8 shadow-md flex justify-between items-center">
    
    <div @click="router.push('/home')" class="flex items-center gap-3 cursor-pointer hover:opacity-90 transition">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
      </svg>
      <span class="text-2xl font-bold tracking-wide">StudentHub</span>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-lg font-medium hidden md:block">
        Ciao, {{ authStore.user?.nome || 'Studente' }}
      </span>
      
      <div class="relative group cursor-pointer" @click="handleLogout">
        <div class="w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center overflow-hidden">
           <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        
        <div class="absolute right-0 top-12 bg-white text-black text-xs py-1 px-2 rounded shadow opacity-0 group-hover:opacity-100 transition pointer-events-none">
          Logout
        </div>
      </div>
    </div>

  </nav>
</template>