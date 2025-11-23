import { useEffect, useState } from "react";
import api from "../config/api";

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data.user);
    } catch (err) {
      console.log("Profile load error", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return { profile, loading, reload: loadProfile };
}