# 🏗️ Architettura del Progetto StudentHub

Questo documento delinea la struttura delle cartelle e dei file del progetto, seguendo le best practices per un'applicazione full-stack (Vue.js + Express).

```text
StudentHub/
├── .git/
├── .gitignore             # File per escludere node_modules e file di sistema
├── LICENSE                # Licenza MIT del progetto
├── README.md              # Documentazione principale con link ai mockup
│
├── backend/               # Logica Server (Express + MySQL)
│   ├── .env               # Password DB e Secret JWT (DA NON COMMITYARE!)
│   ├── package.json       # Dipendenze backend
│   ├── server.js          # Entry point del server API
│   │
│   ├── sql/               # Script Database
│   │   ├── init.sql       # Script per creare Tabelle (Utenti, Esami, Badge)
│   │   └── seed.sql       # Dati di prova iniziali
│   │
│   └── src/               # Codice sorgente Backend
│       ├── config/
│       │   └── db.js      # Configurazione connessione al DB
│       ├── controllers/   # Logica di business (es. calcolo XP, media voti)
│       ├── middleware/    # Protezione rotte (es. controllo Token JWT)
│       └── routes/        # Definizione endpoint API (es. POST /login)
│
└── frontend/              # Interfaccia Utente (Vue.js + Vite)
    ├── index.html         # Entry point HTML
    ├── package.json       # Dipendenze frontend
    ├── vite.config.js     # Configurazione Vite
    │
    └── src/
        ├── main.js        # Entry point JavaScript
        ├── App.vue        # Componente Root (Layout principale)
        ├── style.css      # Stili globali e Tailwind imports
        │
        ├── api/           # Chiamate HTTP verso il backend
        │   └── axios.js   # Istanza axios configurata
        │
        ├── assets/        # Risorse statiche (Logo, Icone, Avatar)
        │
        ├── components/    # Componenti riutilizzabili (PascalCase)
        │   ├── NavBar.vue         # Barra di navigazione con Avatar e Logout
        │   ├── XpBar.vue          # Barra progresso livello/XP
        │   ├── ExamTable.vue      # Tabella esami generica
        │   └── ObjectiveCard.vue  # Card per singolo obiettivo
        │
        ├── pages/         # Viste principali (collegate al Router)
        │   ├── LandingPage.vue    # Pagina iniziale pubblica
        │   ├── LoginPage.vue      # Form di accesso
        │   ├── RegisterPage.vue   # Form di registrazione
        │   ├── HomePage.vue       # Dashboard studente (dopo login)
        │   ├── CareerPage.vue     # Gestione carriera (CRUD)
        │   ├── InsertExamPage.vue # Form inserimento esame
        │   ├── StatsPage.vue      # Grafici e statistiche
        │   ├── ObjectivesPage.vue # Lista obiettivi e classifica
        │   ├── AdminPage.vue      # Dashboard amministratore
        │   └── NotFound.vue       # Pagina 404
        │
        ├── router/        # Gestione della navigazione (Vue Router)
        │   └── index.js
        │
        └── stores/        # Gestione stato globale (Pinia)
            ├── auth.js    # Dati sessione utente
            └── gamification.js # Stato punti e livello