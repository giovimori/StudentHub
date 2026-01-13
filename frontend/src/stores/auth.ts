import { defineStore } from "pinia";
import api from "../api/axios";
import { User } from "../types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
  },

  actions: {

    async login(email: string, password: string): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {

        const response = await api.post("/auth/login", { email, password });


        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        return true; // Login riuscito
      } catch (err: any) {
        this.error = err.response?.data?.message || "Login fallito";
        return false;
      } finally {
        this.loading = false;
      }
    },


    async register(userData: any): Promise<boolean> {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/auth/register", userData);


        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Registrazione fallita";
        return false;
      } finally {
        this.loading = false;
      }
    },


    async logout(): Promise<void> {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        console.error("Logout error", err);
      } finally {
        this.user = null;
        localStorage.removeItem("user");
        // lascia che sia il componente a fare router.push('/')
      }
    },
  },
});
