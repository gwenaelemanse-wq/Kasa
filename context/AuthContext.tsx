"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { loginAction, registerAction } from "@/lib/actions/auth";
import { updateUserRoleAction, updateUserPictureAction } from "@/lib/actions/users";
import type { User } from "@/lib/api";

const STORAGE_KEY = "kasa-auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoaded: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateRole: (role: string) => Promise<void>;
  updateProfilePicture: (pictureUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  async function login(email: string, password: string) {
    const result = await loginAction(email, password);
    if (!result.success) {
      // Ce throw se produit ENTIÈREMENT côté client : on ne fait que relire
      // un champ .error déjà présent dans un objet normal reçu du serveur,
      // donc aucune erreur ne traverse la frontière serveur/client.
      throw new Error(result.error);
    }
    setUser(result.data.user);
    setToken(result.data.token);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
  }

  async function register(name: string, email: string, password: string) {
    const result = await registerAction(name, email, password);
    if (!result.success) {
      throw new Error(result.error);
    }
    setUser(result.data.user);
    setToken(result.data.token);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
  }

  function logout() {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  async function updateRole(role: string) {
    if (!user || !token) throw new Error("Non connecté");
    const updatedUser = await updateUserRoleAction(user.id, role, token);
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token }));
  }

  async function updateProfilePicture(pictureUrl: string) {
    if (!user || !token) throw new Error("Non connecté");
    const updatedUser = await updateUserPictureAction(user.id, pictureUrl, token);
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token }));
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoaded, login, register, logout, updateRole, updateProfilePicture }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur de AuthProvider");
  }
  return context;
}