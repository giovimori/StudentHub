import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Importiamo lo store per controllare il login

// Import delle pagine
import LandingPage from '../pages/LandingPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import HomePage from '../pages/HomePage.vue'
import CareerPage from '../pages/CareerPage.vue'
import InsertExamPage from '../pages/InsertExamPage.vue'
import StatsPage from '../pages/StatsPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'
import NotFound from '../pages/NotFound.vue'

// Definiamo le rotte con i metadati di sicurezza
const routes = [
  // 1. ROTTE PUBBLICHE (Guest)
  // Se un utente loggato prova ad accedervi, verrà reindirizzato alla Home
  { 
    path: '/', 
    name: 'Landing', 
    component: LandingPage,
    meta: { guest: true } 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginPage,
    meta: { guest: true }
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: RegisterPage,
    meta: { guest: true }
  },

  // 2. ROTTE PROTETTE (Richiedono Login)
  // Se un utente NON loggato prova ad accedervi, verrà reindirizzato al Login
  { 
    path: '/home', 
    name: 'Home', 
    component: HomePage,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/career', 
    name: 'Career', 
    component: CareerPage,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/career/insert', 
    name: 'InsertExam', 
    component: InsertExamPage,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/stats', 
    name: 'Stats', 
    component: StatsPage,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/settings', 
    name: 'Settings', 
    component: SettingsPage,
    meta: { requiresAuth: true } 
  },

  // 3. Pagine accessorie (solitamente pubbliche)
  { path: '/about', name: 'About', component: NotFound }, // Placeholder
  { path: '/contact', name: 'Contact', component: NotFound }, // Placeholder
  { path: '/privacy', name: 'Privacy', component: NotFound }, // Placeholder
  { path: '/terms', name: 'Terms', component: NotFound }, // Placeholder

  // 4. Catch-all (Pagina non trovata)
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// --- NAVIGATION GUARD ---
// Questo controllo viene eseguito prima di ogni cambio pagina
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // CASO 1: La rotta richiede login, ma l'utente NON è autenticato
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // Reindirizza al login
  } 
  // CASO 2: La rotta è per ospiti (es. Login), ma l'utente È autenticato
  else if (to.meta.guest && isAuthenticated) {
    next('/home') // Reindirizza alla dashboard
  }
  // CASO 3: Tutto ok, procedi
  else {
    next()
  }
})

export default router