import { useEffect } from "react";
import { useRouter } from "expo-router";

// This is a dummy screen — the tab button opens the emergency modal directly
export default function EmergencyTab() {
  const router = useRouter();
  useEffect(() => {
    router.push("/emergency");
  }, []);
  return null;
}
