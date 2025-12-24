import { defineStore } from "pinia";
import api from "../api/axios";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    preferences: {
      tema_voti: "DEFAULT",
      rgb_soglia_bassa: 18,
      rgb_soglia_alta: 27,
    },
    loaded: false, // Per evitare di ricaricare se abbiamo già i dati
  }),

  actions: {
    // Scarica le impostazioni dal backend
    async fetchSettings() {
      if (this.loaded) return;
      try {
        const response = await api.get("/settings");
        this.preferences = response.data;
        this.loaded = true;
      } catch (error) {
        console.error("Errore caricamento settings:", error);
      }
    },

    // Aggiorna le impostazioni nel backend e nello store
    async updateSettings(newSettings) {
      try {
        await api.put("/settings", newSettings);
        this.preferences = { ...this.preferences, ...newSettings };
        return true;
      } catch (error) {
        console.error("Errore salvataggio settings:", error);
        return false;
      }
    },
  },
});
