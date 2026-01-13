import { defineStore } from "pinia";
import api from "../api/axios";

interface Preferences {
  tema_voti: string;
  rgb_soglia_bassa: number;
  rgb_soglia_alta: number;
}

interface SettingsState {
  preferences: Preferences;
  loaded: boolean;
}

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsState => ({
    preferences: {
      tema_voti: "DEFAULT",
      rgb_soglia_bassa: 18,
      rgb_soglia_alta: 27,
    },
    loaded: false,
  }),

  actions: {

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


    async updateSettings(newSettings: Partial<Preferences>): Promise<boolean> {
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
