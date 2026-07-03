import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Profile } from "../types";
import { clearProfile, getProfile, saveProfile, wipeAllData } from "../db/db";
import { genId } from "../utils/id";

interface ProfileContextValue {
  profile: Profile | null;
  loading: boolean;
  createProfile: (data: Omit<Profile, "id" | "createdAt">) => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getProfile().then((p) => {
      if (!active) return;
      setProfile(p ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const createProfile = async (data: Omit<Profile, "id" | "createdAt">) => {
    const newProfile: Profile = { ...data, id: genId(), createdAt: Date.now() };
    await saveProfile(newProfile);
    setProfile(newProfile);
  };

  const updateProfile = async (patch: Partial<Profile>) => {
    if (!profile) return;
    const next = { ...profile, ...patch };
    await saveProfile(next);
    setProfile(next);
  };

  const deleteAccount = async () => {
    await wipeAllData();
    await clearProfile();
    setProfile(null);
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, createProfile, updateProfile, deleteAccount }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
