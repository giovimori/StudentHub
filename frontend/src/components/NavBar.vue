<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import IconNavbarLogo from './icons/IconNavbarLogo.vue'
import IconUser from './icons/IconUser.vue'
import IconSettings from './icons/IconSettings.vue'
import IconLogout from './icons/IconLogout.vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const goToSettings = () => {
  router.push('/settings')
}

const props = defineProps<{
  hideUserInfo?: boolean
}>()

const showSettings = computed(() => {
  const user = authStore.user
  return user && user.ruolo !== '1' && user.ruolo !== '2'
})
</script>

<template>
  <nav class="bg-secondary text-white py-4 px-8 shadow-md flex justify-between items-center relative z-50">
    
    <div @click="router.push('/home')" class="flex items-center gap-3 cursor-pointer hover:opacity-90 transition">
      <div class="text-white w-10 h-10">
        <IconNavbarLogo />
      </div>
      <span class="text-2xl font-bold tracking-wide">Studenthub</span>
    </div>

    <div class="flex items-center gap-4" v-if="authStore.user && !props.hideUserInfo">
      <span class="text-lg font-medium hidden md:block">
        Ciao, {{ authStore.user?.nome || 'Studente' }}
      </span>
      
      <div class="relative group py-2"> 
        <div class="w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center overflow-hidden cursor-pointer shadow-lg group-hover:ring-2 group-hover:ring-blue-400 transition">
           <IconUser />
        </div>
        
        <div class="absolute right-0 top-full mt-1 w-48 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 overflow-hidden border border-gray-100">
          
          <div v-if="showSettings" @click="goToSettings" class="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition">
            <IconSettings />
            <span>Impostazioni</span>
          </div>

          <div class="border-t border-gray-100"></div>

          <div @click="handleLogout" class="flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600 cursor-pointer transition">
            <IconLogout />
            <span>Logout</span>
          </div>

        </div>
      </div>
    </div>

  </nav>
</template>