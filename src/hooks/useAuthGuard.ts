import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { auth } from "@/lib/store";

export function useAuthGuard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!auth.current()) {
      navigate({ to: "/auth" });
    } else {
      setReady(true);
    }
  }, [navigate]);
  return ready;
}
