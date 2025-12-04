import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Lo configureremo dopo

// Importiamo le pagine (Lazy loading per performance migliori)
const LandingPage = () => import('../pages/LandingPage.vue')
const LoginPage = () => import('../pages/LoginPage.vue')
const RegisterPage = () => import('../pages/RegisterPage.vue')
const HomePage = () => import('../pages/HomePage.vue')
const CareerPage = () => import('../pages/CareerPage.vue')
const InsertExamPage = () => import('../pages/InsertExamPage.vue')
const StatsPage = () => import('../pages/StatsPage.vue')
const ObjectivesPage = () => import('../pages/ObjectivesPage.vue')
const AdminPage = () => import('../pages/AdminPage.vue')
const NotFound = () => import('../pages/NotFound.vue')
const SettingsPage = () => import('../pages/SettingsPage.vue')
const AboutPage = () => import('../pages/AboutPage.vue')
const ContactPage = () => import('../pages/ContactPage.vue')
const PrivacyPage = () => import('../pages/PrivacyPage.vue')
const TermsPage = () => import('../pages/TermsPage.vue')

const routes = [
  { path: '/', name: 'Landing', component: LandingPage, meta: { public: true } },
  { path: '/login', name: 'Login', component: LoginPage, meta: { public: true } },
  { path: '/register', name: 'Register', component: RegisterPage, meta: { public: true } },
  {path: '/about', name: 'About', component: AboutPage, meta: { public: true } }, // <--- AGGIUNGI QUESTO
  { path: '/contact', name: 'Contact', component: ContactPage, meta: { public: true } }, // <--- AGGIUNTO

  // Rotte Protette (Richiedono Login)
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/career', name: 'Career', component: CareerPage },
  { path: '/career/insert', name: 'InsertExam', component: InsertExamPage },
  { path: '/stats', name: 'Stats', component: StatsPage },
  { path: '/objectives', name: 'Objectives', component: ObjectivesPage },
  { path: '/admin', name: 'Admin', component: AdminPage },
  { path: '/settings', name: 'Settings', component: SettingsPage },
  { path: '/privacy', name: 'Privacy', component: PrivacyPage, meta: { public: true } },
  { path: '/terms', name: 'Terms', component: TermsPage, meta: { public: true } },
  
  // Catch-all per 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard: Protezione delle rotte
router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/register', '/about', '/contact', '/privacy', '/terms'];
  const authRequired = !publicPages.includes(to.path);
  
  // Nota: useremo Pinia per controllare se siamo loggati
  // Per ora commentiamo il controllo reale finché non facciamo lo store
  // const auth = useAuthStore();
  
  // if (authRequired && !auth.token) {
  //   return next('/login');
  // }

  next();
})

export default router